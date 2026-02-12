import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ProducerAgent } from '@/lib/agents/producer'
import { SyllabusModule } from '@/lib/supabase/types'

export const maxDuration = 60

export async function POST(request: Request) {
    try {
        const { pathId, moduleIndex } = await request.json()
        const supabase = await createClient()

        // 1. Auth Check
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Fetch Learning Path
        const { data: path, error: pathError } = await supabase
            .from('learning_paths')
            .select('*')
            .eq('id', pathId)
            .single()

        if (pathError || !path) {
            return NextResponse.json({ error: 'Path not found' }, { status: 404 })
        }

        // Parse syllabus_data safely (might be string JSON or array)
        const syllabusData: SyllabusModule[] = Array.isArray(path.syllabus_data)
            ? path.syllabus_data
            : typeof path.syllabus_data === 'string'
                ? JSON.parse(path.syllabus_data)
                : []

        const module = syllabusData[moduleIndex]
        if (!module) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 })
        }

        // 3. Logic based on Content Type

        // 3a. Check for Pre-defined Static Content
        // First check if module has content directly (new paths)
        // If not, fallback to fetching from standard_tracks (for existing paths)
        let staticContent = module.content

        console.log('[MODULE START] Module:', module.title, 'Type:', module.content_type)
        console.log('[MODULE START] Has direct content?', !!staticContent)
        console.log('[MODULE START] Path track_type:', path.track_type)

        if (!staticContent && path.track_type === 'standard') {
            console.log('[MODULE START] Fetching fallback from standard_tracks...')
            // Fallback: Fetch content from the source standard_track
            const { data: standardTrack, error: stdError } = await supabase
                .from('standard_tracks')
                .select('syllabus_template')
                .eq('title', path.title)
                .single()

            console.log('[MODULE START] Standard track found?', !!standardTrack, 'Error?', stdError?.message)

            if (standardTrack?.syllabus_template) {
                const templateModules = Array.isArray(standardTrack.syllabus_template)
                    ? standardTrack.syllabus_template
                    : typeof standardTrack.syllabus_template === 'string'
                        ? JSON.parse(standardTrack.syllabus_template)
                        : []

                console.log('[MODULE START] Template modules count:', templateModules.length)
                console.log('[MODULE START] Module at index', moduleIndex, ':', templateModules[moduleIndex]?.title)
                console.log('[MODULE START] Has content at index?', !!templateModules[moduleIndex]?.content)

                if (templateModules[moduleIndex]?.content) {
                    staticContent = templateModules[moduleIndex].content
                    console.log('[MODULE START] Got static content from fallback!')
                }
            }
        }

        console.log('[MODULE START] Final staticContent?', !!staticContent)

        if (staticContent) {
            console.log('[MODULE START] Returning static content for type:', module.content_type)

            if (module.content_type?.toLowerCase() === 'simulation') {
                // Use the static scenario from DB
                const scenario = staticContent

                const { data: simulation, error: simError } = await supabase
                    .from('simulations')
                    .insert({
                        user_id: user.id,
                        path_id: path.id,
                        channel: (scenario as any).channel || 'whatsapp',
                        difficulty: 'medium',
                        client_persona: scenario.client_persona,
                        completed: false,
                        transcript: []
                    })
                    .select()
                    .single()

                if (simError) throw simError

                return NextResponse.json({
                    success: true,
                    type: 'simulation',
                    resourceId: simulation.id,
                    isStatic: true
                })
            }
            else {
                // Theory or Drill
                return NextResponse.json({
                    success: true,
                    type: 'theory',
                    content: staticContent,
                    isStatic: true
                })
            }
        }

        // 3b. Fallback: Generate Content on-demand (AI Dynamic)

        if (module.content_type?.toLowerCase() === 'simulation') {
            const producer = new ProducerAgent()

            // Generate fresh scenario dynamically
            const scenario = await producer.generateSimulationScenario(
                module.title,
                path.industry || 'General',
                'medium'
            )

            const { data: simulation, error: simError } = await supabase
                .from('simulations')
                .insert({
                    user_id: user.id,
                    path_id: path.id,
                    channel: 'whatsapp',
                    difficulty: 'medium',
                    client_persona: scenario.client_persona,
                    completed: false,
                    transcript: []
                })
                .select()
                .single()

            if (simError) throw simError

            return NextResponse.json({
                success: true,
                type: 'simulation',
                resourceId: simulation.id
            })
        }
        else {
            // Theory or Drill - Generate dynamically
            const producer = new ProducerAgent()
            const theory = await producer.generateTheory(
                module.title,
                path.industry || 'General',
                'mid'
            )

            // Save to some 'module_contents' table or similar (skipped for MVP, just returning)
            return NextResponse.json({
                success: true,
                type: 'theory',
                content: theory
            })
        }

    } catch (error: any) {
        console.error('Error starting module:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to start module' },
            { status: 500 }
        )
    }
}
