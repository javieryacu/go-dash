import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Schema for Theory Content
const TheoryContentSchema = z.object({
    title: z.string(),
    concept_explanation: z.string().describe('Explicación clara del concepto en 2-3 párrafos'),
    real_world_example: z.string().describe('Un ejemplo práctico aplicado a la industria del usuario'),
    key_takeaways: z.array(z.string()).describe('3 puntos clave para recordar')
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
    private model = openai('gpt-4-turbo');

    async generateTheory(topic: string, industry: string, level: string) {
        const prompt = `
      Actúa como Instructor de Ventas Experto en ${industry}.
      Genera una micro-lección teórica sobre: "${topic}".
      Nivel del usuario: ${level}.
      
      Enfoque: B2C / Venta Directa si aplica (Retail, Restaurantes, etc).
      Tono: Práctico, directo, sin relleno corporativo.
    `;

        const { object } = await generateObject({
            model: this.model,
            schema: TheoryContentSchema,
            prompt,
            temperature: 0.7
        });

        return object;
    }

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
