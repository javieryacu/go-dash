import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Marcar módulo como completado y avanzar current_module_index
export async function POST(request: Request) {
    try {
        const { pathId, moduleIndex } = await request.json()
        const supabase = await createClient()

        // 1. Auth
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // 2. Fetch path
        const { data: path, error: pathError } = await supabase
            .from('learning_paths')
            .select('*')
            .eq('id', pathId)
            .eq('user_id', user.id)
            .single()

        if (pathError || !path) {
            return NextResponse.json({ error: 'Path not found' }, { status: 404 })
        }

        // 3. Update syllabus_data - mark module as completed
        const syllabusData = Array.isArray(path.syllabus_data)
            ? [...path.syllabus_data]
            : typeof path.syllabus_data === 'string'
                ? JSON.parse(path.syllabus_data)
                : []

        if (syllabusData[moduleIndex]) {
            syllabusData[moduleIndex] = {
                ...syllabusData[moduleIndex],
                completed: true
            }
        }

        // 4. Advance current_module_index
        const newModuleIndex = Math.min(moduleIndex + 1, path.total_modules)
        const isComplete = newModuleIndex >= path.total_modules

        const { error: updateError } = await supabase
            .from('learning_paths')
            .update({
                syllabus_data: syllabusData,
                current_module_index: newModuleIndex,
                completed: isComplete
            })
            .eq('id', pathId)

        if (updateError) throw updateError

        // 5. Update profile stats (increment total_simulations count if it was a simulation)
        const module = syllabusData[moduleIndex]
        if (module?.content_type === 'simulation') {
            try {
                await supabase.rpc('increment_user_simulations', { user_id_param: user.id })
            } catch {
                // RPC might not exist, ignore
            }
        }

        return NextResponse.json({
            success: true,
            nextModuleIndex: isComplete ? null : newModuleIndex,
            isTrackComplete: isComplete
        })

    } catch (error: any) {
        console.error('Error completing module:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to complete module' },
            { status: 500 }
        )
    }
}
