
import { ClientPersona } from "../supabase/types"

// Type definitions for our static content
export type TheoryContent = {
    title: string
    concept_explanation: string
    real_world_example: string
    key_takeaways: string[]
}

export type StaticModuleContent = {
    theory?: TheoryContent
    simulation?: {
        client_persona: ClientPersona
        context_brief: string
        first_message: string
        goals: string[]
    }
}

// Data Store
export const STANDARD_TRACKS_CONTENT: Record<string, Record<number, StaticModuleContent>> = {
    "Venta Retail (Tienda de Ropa)": {
        0: { // Module 1: Fundamentos de Atención
            theory: {
                title: "La Importancia del Primer Contacto",
                concept_explanation: "El primer contacto en retail define el 80% de la probabilidad de venta. No se trata solo de saludar, sino de romper la barrera de defensa del cliente ('Solo estoy mirando'). La clave es el saludo no invasivo y la pregunta de situación.",
                real_world_example: "En lugar de '¿Le puedo ayudar en algo?', que invita a un 'No, gracias', prueba con: '¡Hola! Veo que estás mirando las chaquetas de cuero, hoy llegaron esos modelos nuevos. Mi nombre es Javier, si necesitas tallas estoy por aquí'.",
                key_takeaways: [
                    "Evita preguntas cerradas al inicio.",
                    "Ofrece valor o información en el primer saludo.",
                    "Rompe el hielo antes de vender."
                ]
            }
        },
        1: { // Module 2: Simulación Básica
            simulation: {
                client_persona: {
                    name: "Laura",
                    role: "Compradora Casual",
                    company: "N/A",
                    personality: "amiable",
                    pain_level: "low",
                    objections: ["Solo estoy mirando", "Es un poco caro para lo que buscaba"],
                    decision_maker: true
                },
                context_brief: "Una clienta entra a la tienda mirando camisetas básicas. Parece relajada pero evasiva.",
                first_message: "Hola, permiso... solo estoy dando una vuelta viendo qué hay.",
                goals: ["Romper el hielo", "Identificar si busca algo específico", "Lograr que se pruebe una prenda"]
            }
        },
        2: { // Module: Manejo de Objeciones (Precio)
            theory: {
                title: "Desarmando la Objeción de Precio",
                concept_explanation: "Cuando un cliente dice 'es caro', rara vez es sobre el dinero. Generalmente es sobre el VALOR percibido. Tu trabajo no es bajar el precio, sino subir el valor. Usa la técnica 'Sentir, Sintieron, Encontraron' o el aislamiento de la objeción.",
                real_world_example: "Cliente: 'Es muy caro'. Tú: 'Entiendo que el precio es importante. Muchos clientes pensaban lo mismo al principio, pero descubrieron que la durabilidad de este material les ahorraba comprar dos veces al año. ¿Lo buscas para uso diario?'",
                key_takeaways: [
                    "No te defiendas ni justifiques inmediatamente.",
                    "Valida la preocupación del cliente (Empatía).",
                    "Re-enfoca la conversación en el beneficio a largo plazo."
                ]
            }
        },
        3: { // Module: Simulación Cierre
            simulation: {
                client_persona: {
                    name: "Carlos",
                    role: "Cliente Apurado",
                    company: "N/A",
                    personality: "driver",
                    pain_level: "medium",
                    objections: ["No tengo tiempo ahora", "¿Me puedes hacer un descuento?"],
                    decision_maker: true
                },
                context_brief: "Carlos tiene prisa. Le gustó una chaqueta pero duda por el precio y el tiempo.",
                first_message: "Mira, me gusta la chaqueta, pero cuesta 20% más de lo que quería gastar y tengo prisa.",
                goals: ["Validar la prisa", "Justificar el valor", "Cerrar la venta rápidamente"]
            }
        }
    },
    "Atención Restaurante": {
        0: {
            theory: {
                title: "Protocolo de Bienvenida",
                concept_explanation: "La bienvenida en un restaurante establece el tono de toda la experiencia. Debe ser cálida, eficiente y personalizada. Evita el '¿Tienen reserva?' como primera frase si el restaurante está vacío.",
                real_world_example: "Mala: '¿Cuántos son?'. Buena: '¡Buenas noches! Bienvenidos a La Estancia. ¿Vienen a celebrar algo especial o es una cena casual?'",
                key_takeaways: [
                    "Sonríe siempre antes de hablar.",
                    "Pregunta el motivo de la visita para personalizar.",
                    "Guía a la mesa activamente."
                ]
            }
        },
        1: {
            simulation: {
                client_persona: {
                    name: "Marta",
                    role: "Comensal Exigente",
                    company: "N/A",
                    personality: "analytical",
                    pain_level: "medium",
                    objections: ["Esta mesa está muy cerca de la cocina", "¿Tienen opciones sin gluten reales?"],
                    decision_maker: true
                },
                context_brief: "Marta llega con una amiga. Parece examinar todo con ojo crítico.",
                first_message: "Buenas noches. Teníamos reserva a las 8. Espero que no nos den la mesa del fondo como la otra vez.",
                goals: ["Validar la reserva con amabilidad", "Ofrecer una buena mesa o alternativa", "Manejar la queja pasada"]
            }
        }
    }
}
