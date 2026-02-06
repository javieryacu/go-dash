// Seed script for Retail and Restaurant tracks
// Run with: npx tsx scripts/seed-tracks.ts

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import type { SyllabusModule } from '../src/lib/supabase/types'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const RETAIL_SYLLABUS: SyllabusModule[] = [
    {
        title: 'El Arte de la Bienvenida',
        description: 'Cómo iniciar la interacción sin parecer un vendedor agresivo',
        objectives: ['Romper el hielo naturalmente', 'Leer el lenguaje corporal del cliente', 'Evitar el "¿te puedo ayudar?" genérico'],
        duration_minutes: 15,
        content_type: 'theory',
        completed: false
    },
    {
        title: 'Indagación de Estilo y Necesidades',
        description: 'Preguntas clave para entender qué busca el cliente',
        objectives: ['Identificar ocasión de uso', 'Entender preferencias de estilo', 'Detectar presupuesto indirectamente'],
        duration_minutes: 20,
        content_type: 'simulation',
        completed: false
    },
    {
        title: 'Venta Cruzada (Cross-selling)',
        description: 'Aumentar el ticket promedio con accesorios y complementos',
        objectives: ['Timing perfecto para sugerir', 'Regla de "el look completo"', 'Manejo de objeciones de precio'],
        duration_minutes: 25,
        content_type: 'drill',
        completed: false
    }
]

const RESTAURANT_SYLLABUS: SyllabusModule[] = [
    {
        title: 'Recepción y Primera Impresión',
        description: 'La importancia de los primeros 30 segundos en la mesa',
        objectives: ['Saludo cálido y profesional', 'Presentación de la carta', 'Lectura de la mesa (prisa vs relax)'],
        duration_minutes: 15,
        content_type: 'theory',
        completed: false
    },
    {
        title: 'Venta Sugestiva de Bebidas y Entradas',
        description: 'Cómo ofrecer sin presionar',
        objectives: ['Sugerir aperitivos específicos', 'Maridaje básico', 'Describir platos sensorialmente'],
        duration_minutes: 20,
        content_type: 'simulation',
        completed: false
    },
    {
        title: 'Manejo de Quejas Típicas',
        description: 'Convertir problemas en clientes leales',
        objectives: ['Platos fríos o demorados', 'Errores en la cuenta', 'Técnica LEASE (Listen, Empathize, Apologize, Solve, Evaluate)'],
        duration_minutes: 25,
        content_type: 'drill',
        completed: false
    }
]

async function seedTracks() {
    console.log('🌱 Seeding Standard Tracks...')

    const tracks = [
        {
            title: 'Venta Retail: Moda y Accesorios',
            description: 'Domina el piso de ventas. Desde el saludo inicial hasta el cierre y fidelización.',
            industry: 'Retail',
            difficulty: 'medium',
            syllabus_template: JSON.stringify(RETAIL_SYLLABUS),
            is_active: true
        },
        {
            title: 'Excelencia en Servicio: Restaurantes',
            description: 'Eleva la experiencia del comensal y aumenta el ticket promedio con venta sugestiva.',
            industry: 'Hospitality',
            difficulty: 'medium',
            syllabus_template: JSON.stringify(RESTAURANT_SYLLABUS),
            is_active: true
        }
    ]

    const { error } = await supabase
        .from('standard_tracks')
        .insert(tracks)

    if (error) {
        console.error('❌ Error seeding tracks:', error)
    } else {
        console.log('✅ Standard Tracks created successfully!')
    }
}

seedTracks()
