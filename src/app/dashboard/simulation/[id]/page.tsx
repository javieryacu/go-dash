'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import WhatsAppInterface, { Message, ClientProfile } from '@/components/deal-room/WhatsAppInterface'
import F2FInterface from '@/components/deal-room/F2FInterface'
import { createClient } from '@/lib/supabase/client'
import { ClientPersona, TranscriptMessage } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import { Trophy, Frown, XCircle, Star, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { AIFeedback } from '@/lib/supabase/types'

export default function SimulationPage() {
    const params = useParams()
    const router = useRouter()
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [channel, setChannel] = useState<string>('whatsapp')
    const [outcome, setOutcome] = useState<{ reason: string, outcome: string, feedback_hint?: string } | null>(null)
    const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null)
    const [overallScore, setOverallScore] = useState<number>(0)

    const supabase = createClient()

    useEffect(() => {
        const loadSimulation = async () => {
            if (!params.id) return

            const { data: simulation, error } = await supabase
                .from('simulations')
                .select('*')
                .eq('id', params.id)
                .single()

            if (error || !simulation) {
                console.error('Error loading simulation:', error)
                // router.push('/dashboard') 
                return
            }

            setChannel(simulation.channel)

            // If already completed, load outcome & feedback
            if (simulation.completed) {
                setOverallScore(simulation.overall_score || 0)
                if (simulation.ai_feedback) {
                    setAiFeedback(simulation.ai_feedback as AIFeedback)
                }
                setOutcome({
                    outcome: (simulation.overall_score || 0) >= 70 ? 'deal_won' : 'deal_lost',
                    reason: (simulation.ai_feedback as any)?.overall_summary || 'Simulación completada'
                })
            }

            // Map Persona to UI Profile
            const persona = simulation.client_persona as ClientPersona
            setClientProfile({
                name: persona.name,
                role: persona.role,
                status: 'online',
                avatar_url: undefined // We don't have avatar gen yet, let UI use initials
            })

            // Map Transcript to Messages
            const transcript = (simulation.transcript as TranscriptMessage[]) || []
            const uiMessages: Message[] = transcript.map((t, i) => ({
                id: i.toString(),
                role: t.role,
                content: t.content,
                timestamp: new Date(t.timestamp), // Ensure timestamp is date
                status: t.role === 'user' ? 'read' : undefined
            }))

            setMessages(uiMessages)
            setIsLoading(false)

            // If transcript is empty and we are live, trigger initial hello
            if (uiMessages.length === 0 && !simulation.completed) {
                handleInitialGreeting(persona)
            }
        }

        loadSimulation()
    }, [params.id, supabase])

    const handleInitialGreeting = (persona: ClientPersona) => {
        setIsTyping(true)
        setTimeout(() => {
            setIsTyping(false)
            const welcomeMsg: Message = {
                id: 'welcome',
                role: 'client',
                content: `Hola! Soy ${persona.name}. Gracias por atenderme.`, // Simple fallback
                timestamp: new Date()
            }
            // Only add if not strictly managed by backend (backend usually empty at start)
            setMessages([welcomeMsg])
        }, 1500)
    }

    const handleUserMessage = async (text: string) => {
        // 1. Optimistic UI Update
        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date(),
            status: 'sent'
        }
        setMessages(prev => [...prev, newUserMsg])

        try {
            // 2. Call Chat API
            const response = await fetch('/api/simulation/chat', {
                method: 'POST',
                body: JSON.stringify({
                    simulationId: params.id,
                    message: text
                })
            })

            const data = await response.json()

            if (data.success) {
                // Mark user message as read
                setMessages(prev => prev.map(m => m.id === newUserMsg.id ? { ...m, status: 'read' } : m))

                // Check for Simulation End signal
                if (data.simulationEnded) {
                    setOutcome(data.outcome)
                    // Load feedback from DB after a brief delay (backend writes it)
                    setTimeout(async () => {
                        const { data: sim } = await supabase
                            .from('simulations')
                            .select('overall_score, ai_feedback')
                            .eq('id', params.id)
                            .single()
                        if (sim) {
                            setOverallScore(sim.overall_score || 0)
                            setAiFeedback(sim.ai_feedback as AIFeedback)
                        }
                    }, 1000)
                    return
                }

                if (data.reply) {
                    // Simulate typing delay based on response length 
                    setIsTyping(true)

                    // Heuristic: 30ms per char + 500ms base delay, max 4s
                    const typingDuration = Math.min(500 + (data.reply.length * 30), 4000)

                    setTimeout(() => {
                        setIsTyping(false)
                        const aiMsg: Message = {
                            id: Date.now().toString(),
                            role: 'client',
                            content: data.reply,
                            timestamp: new Date(data.reply_timestamp || Date.now()),
                        }
                        setMessages(prev => [...prev, aiMsg])
                    }, typingDuration)
                }

            } else {
                console.error('Chat API Error', data.error)
            }

        } catch (err) {
            console.error('Failed to send message', err)
        }
    }

    const handleExit = () => {
        router.push('/dashboard')
    }

    if (isLoading || !clientProfile) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p>Preparando simulación...</p>
                </div>
            </div>
        )
    }

    // Outcome Overlay
    if (outcome) {
        const isWin = outcome.outcome === 'deal_won'
        const isHangup = outcome.outcome === 'hangup'

        return (
            <div className="fixed inset-0 z-50 bg-[#0f1419]/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-500 overflow-y-auto">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl relative overflow-hidden"
                >
                    {/* Background glow */}
                    <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20 ${isWin ? 'bg-yellow-500' : 'bg-red-500'}`} />

                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-slate-800 relative z-10 
                        ${isWin ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : 'bg-gradient-to-br from-red-500 to-pink-600 text-white'}`}>
                        {isWin ? <Trophy className="w-12 h-12" /> : (isHangup ? <XCircle className="w-12 h-12" /> : <Frown className="w-12 h-12" />)}
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {isWin ? '¡Trato Cerrado!' : (isHangup ? 'Cliente Colgó' : 'Simulación Terminada')}
                    </h2>

                    {overallScore > 0 && (
                        <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
                            {overallScore}%
                        </div>
                    )}

                    <p className="text-slate-400 mb-6 text-lg font-light leading-relaxed">
                        {outcome.reason}
                    </p>

                    {/* AI Feedback Details */}
                    {aiFeedback && (
                        <div className="text-left space-y-4 mb-6">
                            {aiFeedback.strengths?.length > 0 && (
                                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                                    <h4 className="text-green-400 font-semibold flex items-center gap-2 mb-2">
                                        <Star className="w-4 h-4" /> Fortalezas
                                    </h4>
                                    <ul className="text-sm text-slate-300 space-y-1">
                                        {aiFeedback.strengths.map((s, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-green-400 mt-0.5">•</span> {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {aiFeedback.weaknesses?.length > 0 && (
                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                                    <h4 className="text-orange-400 font-semibold flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-4 h-4" /> Áreas de Mejora
                                    </h4>
                                    <ul className="text-sm text-slate-300 space-y-1">
                                        {aiFeedback.weaknesses.map((w, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-orange-400 mt-0.5">•</span> {w}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {aiFeedback.next_steps?.length > 0 && (
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                    <h4 className="text-blue-400 font-semibold flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-4 h-4" /> Próximos Pasos
                                    </h4>
                                    <ul className="text-sm text-slate-300 space-y-1">
                                        {aiFeedback.next_steps.map((n, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-blue-400 mt-0.5">•</span> {n}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {outcome.feedback_hint && !aiFeedback && (
                        <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-sm text-slate-300 border border-slate-700">
                            <strong>💡 Feedback Rápido:</strong> {outcome.feedback_hint}
                        </div>
                    )}

                    <Button
                        onClick={() => router.push('/dashboard')}
                        size="lg"
                        className={`w-full text-lg h-14 rounded-xl shadow-lg hover:scale-[1.02] transition-transform
                            ${isWin ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-white hover:bg-slate-200 text-slate-900'}`}
                    >
                        Volver al Dashboard
                        <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                </motion.div>
            </div>
        )
    }

    // Polymorphic Render
    if (channel === 'f2f') {
        return (
            <F2FInterface
                messages={messages}
                client={clientProfile}
                onSendMessage={handleUserMessage}
                onExit={handleExit}
                isTyping={isTyping}
            />
        )
    }

    // Default to WhatsApp
    return (
        <WhatsAppInterface
            messages={messages}
            client={clientProfile}
            onSendMessage={handleUserMessage}
            onExit={handleExit}
            isTyping={isTyping}
        />
    )
}
