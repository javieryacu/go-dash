import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ActorAgent } from '@/lib/agents/actor'
import { AnalystAgent } from '@/lib/agents/analyst'
import { ClientPersona, TranscriptMessage } from '@/lib/supabase/types'

// Handle POST request for chat interaction
export async function POST(request: Request) {
    try {
        const { simulationId, message } = await request.json()
        const supabase = await createClient()

        // 1. Auth Check
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // 2. Fetch Simulation Context
        const { data: simulation, error: simError } = await supabase
            .from('simulations')
            .select('*')
            .eq('id', simulationId)
            .single()

        if (simError || !simulation) return NextResponse.json({ error: 'Simulation not found' }, { status: 404 })

        // 3. Append User Message to Transcript in DB
        const newMessage: TranscriptMessage = {
            role: 'user',
            content: message,
            timestamp: Date.now()
        }

        const currentTranscript = (simulation.transcript as TranscriptMessage[]) || []
        const updatedTranscriptUser = [...currentTranscript, newMessage]

        // Optimistic save of user message (can act as "sent" confirmation)
        await supabase
            .from('simulations')
            .update({ transcript: updatedTranscriptUser })
            .eq('id', simulationId)

        // 4. Generate AI Response
        const actor = new ActorAgent()
        const { text: aiResponseText, toolCalls } = await actor.generateResponse(
            simulation.client_persona as ClientPersona,
            updatedTranscriptUser,
            simulation.difficulty
        )

        // 5. Check Tool Calls (End Simulation Check)
        let simulationEnded = false
        let outcomeData = null

        if (toolCalls && toolCalls.length > 0) {
            const endSimTool = toolCalls.find(t => t.toolName === 'endSimulation')
            if (endSimTool) {
                simulationEnded = true
                outcomeData = (endSimTool as any).input

                // ✨ NUEVO: Ejecutar análisis con AnalystAgent
                const analyst = new AnalystAgent()
                const analysis = await analyst.analyzeSimulation(
                    updatedTranscriptUser,
                    simulation.client_persona,
                    simulation.channel
                )

                // Actualizar simulación con feedback y scores
                await supabase
                    .from('simulations')
                    .update({
                        completed: true,
                        overall_score: analysis.overall_score,
                        discovery_score: analysis.discovery_score,
                        qualification_score: analysis.qualification_score,
                        objection_handling_score: analysis.objection_handling_score,
                        closing_score: analysis.closing_score,
                        ai_feedback: {
                            overall_summary: analysis.overall_summary,
                            strengths: analysis.strengths,
                            weaknesses: analysis.weaknesses,
                            next_steps: analysis.next_steps,
                            detailed_scores: analysis.detailed_scores
                        }
                    })
                    .eq('id', simulationId)
            }
        }

        // 5. Append AI Message to Transcript (only if text exists)
        let finalTranscript = updatedTranscriptUser

        if (aiResponseText) {
            const aiMessage: TranscriptMessage = {
                role: 'client',
                content: aiResponseText,
                timestamp: Date.now()
            }
            finalTranscript = [...updatedTranscriptUser, aiMessage]

            // Update DB with AI response
            await supabase
                .from('simulations')
                .update({ transcript: finalTranscript })
                .eq('id', simulationId)
        }

        return NextResponse.json({
            success: true,
            start_timestamp: newMessage.timestamp,
            reply: aiResponseText,
            reply_timestamp: Date.now(),
            simulationEnded,
            outcome: outcomeData
        })

    } catch (error: any) {
        console.error('Chat error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
