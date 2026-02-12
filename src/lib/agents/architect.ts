import { generateObject } from 'ai';
import { getModel } from '../ai-config';
import { z } from 'zod';
import type { ExperienceLevel, TrainingGoal } from '@/lib/supabase/types';

// Schema for the Syllabus Structure
export const SyllabusSchema = z.object({
    title: z.string().describe('Título atractivo del learning path'),
    description: z.string().describe('Descripción breve del objetivo del curso'),
    modules: z.array(z.object({
        title: z.string().describe('Título del módulo'),
        description: z.string().describe('Qué aprenderá el usuario'),
        objectives: z.array(z.string()).describe('Lista de 3 objetivos clave'),
        duration_minutes: z.number().describe('Duración estimada total'),
        content_type: z.enum(['theory', 'drill', 'simulation']).describe('Tipo de contenido principal'),
        focus_topic: z.string().describe('Tema específico para generar contenido (ej: manejo de objeciones de precio)')
    })).describe('Lista de módulos ordenados lógicamente')
});

export type Syllabus = z.infer<typeof SyllabusSchema>;

interface ArchitectParams {
    experience_level: ExperienceLevel;
    training_goal: TrainingGoal;
    industry: string;
}

export class ArchitectAgent {
    private model = getModel('passive'); // Modelo pasivo (Gemini) para generación de contenido

    async generateSyllabus({ experience_level, training_goal, industry }: ArchitectParams): Promise<Syllabus> {
        const prompt = `
      Actúa como un Arquitecto de Entrenamiento de Ventas Senior.
      
      Diseña un plan de estudios (Syllabus) personalizado para un vendedor con el siguiente perfil:
      - Nivel de Experiencia: ${experience_level}
      - Objetivo: ${training_goal}
      - Industria: ${industry}
      
      REGLAS DE DISEÑO:
      1. Junior (0-2 años): Enfocarse 60% en Teoría (fundamentos), 40% práctica simple.
      2. Mid (2-5 años): Enfocarse 30% Teoría, 70% Simulación y Drills tácticos.
      3. Senior (5+ años): Enfocarse 10% Teoría (solo conceptos avanzados), 90% Simulación compleja.
      
      ESTRUCTURA:
      - Genera entre 4 y 6 módulos.
      - Asegura una progresión lógica (Learn -> Train -> Execute).
      - Los títulos deben ser profesionales y orientados a la acción.
      
      IMPORTANTE:
      - El output debe ser JSON válido siguiendo el schema.
      - Idioma: Español.
    `;

        const { object } = await generateObject({
            model: this.model,
            schema: SyllabusSchema,
            prompt: prompt,
            temperature: 0.7, // Creatividad balanceada con estructura
        });

        return object;
    }
}
