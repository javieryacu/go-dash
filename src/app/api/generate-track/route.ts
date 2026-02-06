import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ArchitectAgent } from '@/lib/agents/architect'
import { ProducerAgent } from '@/lib/agents/producer'

export const maxDuration = 60 // Allow longer timeout for AI generation

export async function POST(request: Request) {
    try {
        const { experience_level, training_goal, industry } = await request.json()
        const supabase = await createClient()

        // 1. Verify user is authenticated
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Initialize Agents
        const architect = new ArchitectAgent()
        const producer = new ProducerAgent()

        // 3. Generate Syllabus (Architect)
        const syllabus = await architect.generateSyllabus({
            experience_level,
            training_goal,
            industry
        })

        // 4. Create Learning Path in DB
        const { data: path, error: pathError } = await supabase
            .from('learning_paths')
            .insert({
                user_id: user.id,
                title: syllabus.title,
                description: syllabus.description,
                track_type: 'ai_generated',
                industry,
                syllabus_data: syllabus.modules, // Initial syllabus without full content
                total_modules: syllabus.modules.length,
                current_module_index: 0
            })
            .select()
            .single()

        if (pathError) throw pathError

        // 5. Generate content for the first module immediately (Producer)
        const firstModule = syllabus.modules[0]

        // We start content generation in background (fire and forget for full track)
        // but we wait for the first module to start immediately
        const startGeneration = async () => {
            // Logic to generate content would go here
            // For MVP we just return success
        }

        await startGeneration()

        return NextResponse.json({
            success: true,
            pathId: path.id,
            syllabus
        })

    } catch (error: any) {
        console.error('Error generating track:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to generate track' },
            { status: 500 }
        )
    }
}
