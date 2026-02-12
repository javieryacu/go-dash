import { generateObject } from 'ai';
import { getModel } from '../ai-config';
import { z } from 'zod';

// Schema for Gamified Micro-Learning (Story)
const StoryContentSchema = z.object({
    title: z.string(),
    emoji: z.string().describe('Un emoji representativo del tema'),
    hook: z.object({
        text: z.string().describe('Pregunta o afirmación provocadora que capture la atención inmediata (max 140 chars)'),
        emoji: z.string().describe('Emoji para el hook')
    }),
    story: z.object({
        context: z.string().describe('Breve intro de la situación (2 líneas)'),
        problem: z.string().describe('El conflicto o error común (2-3 líneas)'),
        solution: z.string().describe('La técnica o solución aplicada (2-3 líneas)'),
        character: z.string().describe('Nombre de un personaje ficticio para la historia (ej: "Juan el Vendedor")')
    }),
    versus: z.object({
        wrong_way: z.string().describe('Lo que hace la mayoría (forma incorrecta)'),
        right_way: z.string().describe('Lo que hacen los top performers (forma correcta)')
    }),
    interactive_challenge: z.object({
        question: z.string().describe('Pregunta de reflexión rápida para el usuario'),
        options: z.array(z.string()).describe('2 opciones breve para elegir'),
        correct_option_index: z.number()
    }),
    key_takeaway: z.string().describe('La lección en 1 frase memorable (tweet-style)')
});

// Schema for Drill Content
const DrillContentSchema = z.object({
    objection_text: z.string().describe('La objeción que dice el cliente'),
    objection_type: z.enum(['price', 'timing', 'authority', 'need', 'trust', 'competition']),
    ideal_response: z.string().describe('La respuesta ideal manejando la objeción'),
    difficulty: z.enum(['easy', 'medium', 'hard'])
});

// Schema for Simulation Scenario
const SimulationScenarioSchema = z.object({
    client_persona: z.object({
        name: z.string(),
        role: z.string().describe('Rol del cliente (ej: Comprador indeciso, Cliente apurado)'),
        personality: z.enum(['analytical', 'driver', 'amiable', 'expressive']),
        pain_level: z.enum(['low', 'medium', 'high']),
        objections: z.array(z.string()).describe('Lista de 3-5 objeciones probables'),
        decision_maker: z.boolean()
    }),
    context: z.string().describe('Contexto de la situación (ej: Cliente entra a tienda mirando precios)'),
    goal: z.string().describe('Objetivo de la simulación para el usuario')
});

export class ProducerAgent {
    private model = getModel('passive');

    async generateTheory(topic: string, industry: string, level: string) {
        const prompt = `
      Actúa como un Coach de Ventas Top Performer en ${industry} que crea contenido viral para redes sociales (estilo TikTok/LinkedIn).
      
      Tu objetivo: Enseñar "${topic}" usando el método "Micro-Learning Gamificado".
      Nivel del usuario: ${level}.
      
      Estructura OBLIGATORIA:
      1. HOOK: Algo que detenga el scroll. Emocional o curioso.
      2. STORY: Una mini-historia de fracaso -> éxito. Usa un personaje.
      3. VS: Comparación brutal entre "Novato" vs "Pro".
      4. CHALLENGE: Un reto mental rápido.
      
      Tono:
      - Usa emojis estratégicos 🔥🚀💡
      - Sé directo, usa lenguaje natural (no corporativo).
      - Provocador pero educativo.
      - "Tú" en lugar de "Usted".
    `;

        const { object } = await generateObject({
            model: this.model,
            schema: StoryContentSchema,
            prompt,
            temperature: 0.8 // Más creativo
        });

        return object;
    }
    // ... existing methods ...

    async generateDrill(topic: string, industry: string) {
        const prompt = `
      Genera una tarjeta de entrenamiento (Drill) para manejar objeciones en: "${topic}".
      Industria: ${industry}.
      
      Debe ser una objeción común y realista en este contexto.
      La respuesta ideal debe usar técnicas probadas (empatía, clarificación, reframe).
    `;

        const { object } = await generateObject({
            model: this.model,
            schema: DrillContentSchema,
            prompt,
            temperature: 0.8
        });

        return object;
    }

    async generateSimulationScenario(topic: string, industry: string, level: string) {
        const prompt = `
      Diseña un escenario de simulación de ventas para practicar: "${topic}".
      Industria: ${industry}.
      Nivel de dificultad: ${level}.
      
      El cliente debe ser realista para el contexto (ej: en Restaurante, un comensal; en Retail, un comprador).
      Define una personalidad clara y objeciones coherentes.
    `;

        const { object } = await generateObject({
            model: this.model,
            schema: SimulationScenarioSchema,
            prompt,
            temperature: 0.8
        });

        return object;
    }
}
