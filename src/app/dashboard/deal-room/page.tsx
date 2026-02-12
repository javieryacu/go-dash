'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import {
    MessageSquare,
    Users,
    Phone,
    Mail,
    Trophy,
    Frown,
    XCircle,
    Clock,
    Play,
    ChevronRight,
    Target
} from 'lucide-react'

interface SimulationRecord {
    id: string
    channel: string
    difficulty: string
    client_persona: { name: string; role: string; company: string }
    overall_score: number
    completed: boolean
    created_at: string
}

const channelIcons: Record<string, any> = {
    whatsapp: MessageSquare,
    f2f: Users,
    phone: Phone,
    email: Mail,
}

const channelColors: Record<string, string> = {
    whatsapp: 'bg-green-500',
    f2f: 'bg-pink-500',
    phone: 'bg-purple-500',
    email: 'bg-blue-500',
}

export default function DealRoomPage() {
    const router = useRouter()
    const [simulations, setSimulations] = useState<SimulationRecord[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/login'); return }

            const { data } = await supabase
                .from('simulations')
                .select('id, channel, difficulty, client_persona, overall_score, completed, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20)

            setSimulations(data || [])
            setIsLoading(false)
        }
        load()
    }, [router, supabase])

    const handleNewSimulation = async () => {
        try {
            const res = await fetch('/api/simulation/quick', {
                method: 'POST',
                body: JSON.stringify({ channel: 'whatsapp' })
            })
            const data = await res.json()
            if (data.success) {
                router.push(`/dashboard/simulation/${data.simulationId}`)
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
            <header className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-600">
                        Deal Room
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Tus simulaciones de ventas
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNewSimulation}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/25 flex items-center gap-2"
                >
                    <Play className="w-4 h-4" />
                    Nueva Simulación
                </motion.button>
            </header>

            {simulations.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                >
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <Target className="w-10 h-10 text-primary/50" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        No tienes simulaciones aún
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        Practica tus habilidades de venta con clientes IA en tiempo real
                    </p>
                    <button
                        onClick={handleNewSimulation}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                    >
                        Comenzar Primera Simulación
                    </button>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {simulations.map((sim, i) => {
                        const ChannelIcon = channelIcons[sim.channel] || MessageSquare
                        const channelColor = channelColors[sim.channel] || 'bg-gray-500'
                        const date = new Date(sim.created_at)
                        const isWin = sim.overall_score >= 70

                        return (
                            <motion.div
                                key={sim.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => sim.completed
                                    ? router.push(`/dashboard/simulation/${sim.id}`)
                                    : router.push(`/dashboard/simulation/${sim.id}`)
                                }
                                className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-5 hover:border-primary/50 transition-all cursor-pointer group flex items-center gap-4"
                            >
                                {/* Channel Icon */}
                                <div className={`w-12 h-12 rounded-xl ${channelColor} flex items-center justify-center shrink-0`}>
                                    <ChannelIcon className="w-6 h-6 text-white" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                        {sim.client_persona?.name || 'Cliente IA'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {sim.client_persona?.role} - {sim.client_persona?.company}
                                    </p>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-3 shrink-0">
                                    {sim.completed ? (
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${isWin
                                            ? 'bg-green-500/10 text-green-500'
                                            : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {isWin ? <Trophy className="w-3.5 h-3.5" /> : <Frown className="w-3.5 h-3.5" />}
                                            {sim.overall_score}%
                                        </div>
                                    ) : (
                                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium">
                                            <Clock className="w-3.5 h-3.5" />
                                            En curso
                                        </span>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                        {date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
