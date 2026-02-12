import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Simulación rápida sin necesidad de track/ruta
// Crea una simulación con persona genérica para práctica rápida
export async function POST(request: Request) {
    try {
        const { channel = 'whatsapp' } = await request.json()
        const supabase = await createClient()

        // 1. Auth
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // 2. Obtener perfil para contextualizar
        const { data: profile } = await supabase
            .from('profiles')
            .select('experience_level, training_goal')
            .eq('id', user.id)
            .single()

        // 3. Persona genérica para práctica rápida
        const personas = [
            {
                name: 'Carlos Méndez',
                role: 'Director de Operaciones',
                company: 'TechFlow Solutions',
                personality: 'analytical' as const,
                pain_level: 'medium' as const,
                objections: ['El precio es alto para nuestro presupuesto actual', 'Necesito ver ROI claro antes de decidir'],
                decision_maker: true
            },
            {
                name: 'María López',
                role: 'Gerente de Compras',
                company: 'Grupo Retail Plus',
                personality: 'driver' as const,
                pain_level: 'high' as const,
                objections: ['Ya tenemos un proveedor que nos funciona bien', 'No tengo tiempo para implementaciones largas'],
                decision_maker: false
            },
            {
                name: 'Andrés García',
                role: 'CEO',
                company: 'InnovaDigital',
                personality: 'expressive' as const,
                pain_level: 'low' as const,
                objections: ['Suena interesante pero no es prioridad ahora', 'Necesito consultarlo con mi equipo'],
                decision_maker: true
            }
        ]

        const persona = personas[Math.floor(Math.random() * personas.length)]

        // 4. Crear simulación
        const difficulty = profile?.experience_level === 'senior' ? 'hard' :
            profile?.experience_level === 'mid' ? 'medium' : 'easy'

        const { data: simulation, error } = await supabase
            .from('simulations')
            .insert({
                user_id: user.id,
                path_id: null, // Sin ruta asociada (práctica libre)
                channel,
                difficulty,
                client_persona: persona,
                completed: false,
                transcript: []
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({
            success: true,
            simulationId: simulation.id
        })

    } catch (error: any) {
        console.error('Error creating quick simulation:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to create simulation' },
            { status: 500 }
        )
    }
}
