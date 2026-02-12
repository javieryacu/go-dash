import { createOpenAI } from '@ai-sdk/openai';

// =====================================================
// Configuración de Modelos LLM - Interfaz Unificada
// =====================================================
//
// Todos los proveedores se acceden vía endpoints OpenAI-compatible.
// No se necesita un SDK por proveedor ni LiteLLM proxy.
//
// ACTOR (Proactivo - Simulación):
//   → Groq + Llama 3.3 (~100ms latencia)
//   → Endpoint: https://api.groq.com/openai/v1
//
// PASSIVE (Architect, Producer, Analyst):
//   → Google Gemini 2.0 Flash (1M tokens contexto)
//   → Endpoint: https://generativelanguage.googleapis.com/v1beta/openai/
//
// =====================================================

export type AgentRole = 'actor' | 'passive';

export const getModel = (role: AgentRole = 'passive') => {

    // ─── ACTOR: Groq (baja latencia para simulaciones) ───
    if (role === 'actor') {
        const baseURL = process.env.LLM_ACTOR_BASE_URL;
        const apiKey = process.env.LLM_ACTOR_API_KEY;
        const model = process.env.LLM_ACTOR_MODEL || 'llama-3.3-70b-versatile';

        if (baseURL && apiKey) {
            const provider = createOpenAI({ baseURL, apiKey });
            return provider(model);
        }
    }

    // ─── PASSIVE: Google Gemini (contexto largo) ───
    if (role === 'passive') {
        const baseURL = process.env.LLM_PASSIVE_BASE_URL;
        const apiKey = process.env.LLM_PASSIVE_API_KEY;
        const model = process.env.LLM_PASSIVE_MODEL || 'gemini-2.0-flash';

        if (baseURL && apiKey) {
            const provider = createOpenAI({ baseURL, apiKey });
            return provider(model);
        }
    }

    // ─── FALLBACK: OpenAI directo ───
    const globalModel = process.env.LLM_MODEL || 'gpt-4-turbo';
    const provider = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    return provider(globalModel);
};
