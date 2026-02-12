import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ProducerAgent } from '@/lib/agents/producer'
import type { SyllabusModule } from '@/lib/supabase/types'

// Maximum duration for serverless function (prevent timeout during AI gen)
export const maxDuration = 60

export async function POST(request: Request) {
    try {
        const { trackId } = await request.json()
        const supabase = await createClient()

        // 1. Auth Check
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Fetch Standard Track Template
        const { data: track, error: trackError } = await supabase
            .from('standard_tracks')
            .select('*')
            .eq('id', trackId)
            .single()

        if (trackError || !track) {
            return NextResponse.json({ error: 'Track not found' }, { status: 404 })
        }

        // 3. Create Learning Path (Clone Standard Track Structure)
        const { data: path, error: pathError } = await supabase
            .from('learning_paths')
            .insert({
                user_id: user.id,
                title: track.title,
                description: track.description,
                track_type: 'standard',
                industry: track.industry,
                syllabus_data: track.syllabus_template, // Initial skeleton
                total_modules: (track.syllabus_template as any[]).length,
                current_module_index: 0
            })
            .select()
            .single()

        if (pathError) throw pathError

        // 4. Trigger AI Content Generation for the First Module
        // User requested clear AI generation. 
        // We will generate the specific content for the first module immediately.

        const producer = new ProducerAgent()
        const firstModule = (track.syllabus_template as SyllabusModule[])[0]

        // Determine what content to generate based on type
        let aiContent = null

        if (firstModule.content_type === 'theory') {
            // Check if content already exists (static)
            if (firstModule.content) {
                console.log('Using static content for first module theory')
                aiContent = firstModule.content
            } else {
                const theory = await producer.generateTheory(
                    firstModule.title,
                    track.industry,
                    'mid' // Default to mid, should come from user profile
                )
                aiContent = theory
            }
        }
        else if (firstModule.content_type === 'simulation') {
            let scenario = null

            if (firstModule.content) {
                console.log('Using static content for first module simulation')
                scenario = firstModule.content
            } else {
                scenario = await producer.generateSimulationScenario(
                    firstModule.title,
                    track.industry,
                    track.difficulty || 'medium'
                )
            }

            // Create the simulation record with this persona
            const { error: simError } = await supabase
                .from('simulations')
                .insert({
                    user_id: user.id,
                    path_id: path.id,
                    channel: 'whatsapp',
                    difficulty: track.difficulty || 'medium',
                    client_persona: scenario.client_persona,
                    duration_seconds: 0,
                    user_talk_percentage: 0,
                    overall_score: 0,
                    completed: false,
                    transcript: []
                })

            if (simError) console.error('Error creating initial simulation:', simError)
        }

        // 5. Update Path Status (Optional: Mark as generating completed)
        // For now we just return success

        return NextResponse.json({
            success: true,
            pathId: path.id
        })

    } catch (error: any) {
        console.error('Error starting track:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to start track' },
            { status: 500 }
        )
    }
}
