import { generateObject } from 'ai';
import { getModel } from '../ai-config';
import { z } from 'zod';
import { TranscriptMessage, AIFeedback } from '../supabase/types';

// Schema para el análisis de la simulación
const AnalysisSchema = z.object({
    overall_score: z.number().min(0).max(100).describe('Score general de 0-100'),
    discovery_score: z.number().min(0).max(100).describe('Calidad del descubrimiento de necesidades'),
    qualification_score: z.number().min(0).max(100).describe('Calidad de la calificación del prospecto'),
    objection_handling_score: z.number().min(0).max(100).describe('Manejo de objeciones'),
    closing_score: z.number().min(0).max(100).describe('Técnica de cierre'),
    overall_summary: z.string().describe('Resumen general de la performance en 2-3 oraciones'),
    strengths: z.array(z.string()).length(2).describe('2 fortalezas específicas observadas'),
    weaknesses: z.array(z.string()).length(2).describe('2 debilidades específicas observadas'),
    next_steps: z.array(z.string()).length(3).describe('3 acciones concretas para mejorar'),
    detailed_scores: z.object({
        rapport_building: z.number().min(0).max(100),
        question_quality: z.number().min(0).max(100),
        active_listening: z.number().min(0).max(100),
        objection_handling: z.number().min(0).max(100),
        closing_technique: z.number().min(0).max(100)
    })
});

export type SimulationAnalysis = z.infer<typeof AnalysisSchema>;

export class AnalystAgent {
    private model = getModel('passive'); // Modelo pasivo (Gemini) para análisis profundo

    async analyzeSimulation(
        transcript: TranscriptMessage[],
        clientPersona: any,
        channel: string
    ): Promise<SimulationAnalysis> {
        // Convertir transcripción a formato legible
        const formattedTranscript = transcript
            .map(msg => `${msg.role === 'user' ? 'Vendedor' : 'Cliente'}: ${msg.content}`)
            .join('\n');

        const prompt = `
Actúa como un Coach Experto en Ventas. Analiza la siguiente conversación de venta.

CONTEXTO:
- Canal: ${channel}
- Cliente: ${clientPersona.name} (${clientPersona.role})
- Personalidad: ${clientPersona.personality}
- Pain Level: ${clientPersona.pain_level}

TRANSCRIPCIÓN:
${formattedTranscript}

INSTRUCCIONES DE EVALUACIÓN:

1. DISCOVERY (0-100):
   - ¿Hizo preguntas abiertas para entender necesidades?
   - ¿Exploró el contexto antes de "vender"?
   - ¿Identificó pain points?

2. QUALIFICATION (0-100):
   - ¿Confirmó presupuesto, timing, autoridad de decisión?
   - ¿Validó que el producto/servicio es el adecuado?

3. OBJECTION HANDLING (0-100):
   - ¿Escuchó sin interrumpir?
   - ¿Validó la preocupación del cliente?
   - ¿Re-encuadró objeciones en valor?

4. CLOSING (0-100):
   - ¿Intentó cerrar cuando correspondía?
   - ¿Usó técnicas de cierre efectivas (alternativa, asumido, etc.)?
   - ¿O presionó demasiado pronto?

5. OVERALL SCORE (0-100):
   - Promedio ponderado de los anteriores

FEEDBACK:
- Strengths: 2 cosas específicas que hizo bien (con ejemplos de la transcripción)
- Weaknesses: 2 cosas específicas que debe mejorar
- Next Steps: 3 acciones concretas (ej: "Módulo: Active Listening", "Drill: Objeciones de precio")

SÉ HONESTO Y CONSTRUCTIVO. El objetivo es que mejore, no inflar el ego.
        `;

        const { object } = await generateObject({
            model: this.model,
            schema: AnalysisSchema,
            prompt,
            temperature: 0.3 // Bajo para consistencia en scoring
        });

        return object;
    }
}
