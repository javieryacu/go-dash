import { generateText, tool } from 'ai'
import { getModel } from '../ai-config'
import { z } from 'zod'
import { ClientPersona, TranscriptMessage } from '../supabase/types'

export class ActorAgent {
    async generateResponse(
        persona: ClientPersona,
        history: TranscriptMessage[], // Full conversation history
        difficulty: string = 'medium',
        context?: string
    ) {
        const systemPrompt = `
      You are roleplaying as a potential customer in a sales simulation.
      
      YOUR PERSONA:
      Name: ${persona.name}
      Role: ${persona.role}
      Company: ${persona.company}
      Personality: ${persona.personality} (Adjust tone, patience, and objection style accordingly)
      Pain Level: ${persona.pain_level}
      Decision Maker: ${persona.decision_maker ? 'Yes' : 'No'}
      Objections to use (if relevant context arises): ${persona.objections.join(', ')}

      YOUR GOAL:
      Act naturally. Don't be too easy, but don't be impossible unless "pain level" is low.
      React to the salesperson's inputs. If they ask good questions, open up. If they pitch too early, push back.
      
      CURRENT CONTEXT:
      ${context || 'No specific context provided.'}
      Difficulty Setting: ${difficulty}

      INSTRUCTIONS:
      - Reply as the character. Do NOT add "User:" or "Client:" prefixes.
      - Keep responses relatively short (like a WhatsApp chat), unless you are "expressive" personality.
      - **CRITICAL**: If you reach a conclusion (either you buy, you reject firmly, or you need to leave), use the 'endSimulation' tool.
      - If the user greeting is generic, respond with mild skepticism or polite interest depending on personality.
    `

        // Convert internal transcript format to Vercel AI SDK Core Message format
        const messages = history.map(m => ({
            role: m.role === 'client' ? 'assistant' : 'user' as 'user' | 'assistant',
            content: m.content
        }))

        const result = await generateText({
            model: getModel('actor'), // Usa modelo de baja latencia (Groq/Llama) para inmersión
            system: systemPrompt,
            messages: messages,
            temperature: 0.7, // Some creativity for realistic dialogue
            tools: {
                endSimulation: tool({
                    description: 'Ends the simulation when the conversation reaches a natural conclusion (success or failure).',
                    inputSchema: z.object({
                        reason: z.string().describe('The reason for ending the simulation (e.g., "User successfully closed the deal", "User was too aggressive").'),
                        outcome: z.enum(['deal_won', 'deal_lost', 'hangup']).describe('The final outcome of the interaction.'),
                        feedback_hint: z.string().optional().describe('A brief hint for the user on what they did right or wrong.')
                    })
                })
            }
        })

        return {
            text: result.text,
            toolCalls: result.toolCalls
        }
    }
}
