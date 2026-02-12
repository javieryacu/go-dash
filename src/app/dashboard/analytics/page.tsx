'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import {
    BarChart,
    TrendingUp,
    Target,
    Trophy,
    MessageSquare,
    Users,
    Phone,
    Mail,
    Zap,
    Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PerformanceData {
    total_simulations: number
    avg_overall_score: number
    avg_discovery_score: number
    avg_qualification_score: number
    avg_objection_score: number
    avg_closing_score: number
    whatsapp_count: number
    email_count: number
    phone_count: number
    f2f_count: number
    objections_mastered: number
}

export default function AnalyticsPage() {
    const router = useRouter()
    const [data, setData] = useState<PerformanceData | null>(null)
    const [recentSims, setRecentSims] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/login'); return }

            // Cargar stats del perfil
            const { data: profile } = await supabase
                .from('profiles')
                .select('total_simulations, avg_simulation_score')
                .eq('id', user.id)
                .single()

            // Cargar simulaciones completadas para calcular scores
            const { data: sims } = await supabase
                .from('simulations')
                .select('overall_score, discovery_score, qualification_score, objection_handling_score, closing_score, channel, completed')
                .eq('user_id', user.id)
                .eq('completed', true)
                .order('created_at', { ascending: false })
                .limit(50)

            const completedSims = sims || []

            // Calcular promedios
            const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0

            setData({
                total_simulations: profile?.total_simulations || completedSims.length,
                avg_overall_score: avg(completedSims.map(s => s.overall_score || 0)),
                avg_discovery_score: avg(completedSims.map(s => s.discovery_score || 0)),
                avg_qualification_score: avg(completedSims.map(s => s.qualification_score || 0)),
                avg_objection_score: avg(completedSims.map(s => s.objection_handling_score || 0)),
                avg_closing_score: avg(completedSims.map(s => s.closing_score || 0)),
                whatsapp_count: completedSims.filter(s => s.channel === 'whatsapp').length,
                email_count: completedSims.filter(s => s.channel === 'email').length,
                phone_count: completedSims.filter(s => s.channel === 'phone').length,
                f2f_count: completedSims.filter(s => s.channel === 'f2f').length,
                objections_mastered: 0 // TODO: from objection_drills table
            })

            setIsLoading(false)
        }
        load()
    }, [router, supabase])

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    if (!data || data.total_simulations === 0) {
        return (
            <div className="p-6 md:p-8 max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                        Analytics
                    </h1>
                </header>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                >
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <BarChart className="w-10 h-10 text-primary/50" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        Sin datos todavía
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        Completa tu primera simulación para ver tu análisis de rendimiento
                    </p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                    >
                        Ir al Dashboard
                    </button>
                </motion.div>
            </div>
        )
    }

    const skills = [
        { name: 'Discovery', score: data.avg_discovery_score, icon: Target, color: 'from-blue-500 to-cyan-500' },
        { name: 'Calificación', score: data.avg_qualification_score, icon: Award, color: 'from-purple-500 to-pink-500' },
        { name: 'Objeciones', score: data.avg_objection_score, icon: Zap, color: 'from-orange-500 to-yellow-500' },
        { name: 'Cierre', score: data.avg_closing_score, icon: Trophy, color: 'from-green-500 to-emerald-500' },
    ]

    const channels = [
        { name: 'WhatsApp', count: data.whatsapp_count, icon: MessageSquare, color: 'text-green-500' },
        { name: 'Presencial', count: data.f2f_count, icon: Users, color: 'text-pink-500' },
        { name: 'Teléfono', count: data.phone_count, icon: Phone, color: 'text-purple-500' },
        { name: 'Email', count: data.email_count, icon: Mail, color: 'text-blue-500' },
    ]

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                    Analytics
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Tu rendimiento en detalle
                </p>
            </header>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="bg-card/50 backdrop-blur border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Simulaciones</CardTitle>
                            <Target className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data.total_simulations}</div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="bg-card/50 backdrop-blur border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Score Promedio</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data.avg_overall_score}%</div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="bg-card/50 backdrop-blur border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Objeciones Dominadas</CardTitle>
                            <Zap className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data.objections_mastered}</div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Skills Breakdown */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="text-xl font-semibold text-foreground mb-4">Habilidades</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {skills.map((skill, i) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                        >
                            <Card className="bg-card/50 backdrop-blur border-border/50">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${skill.color} flex items-center justify-center`}>
                                                <skill.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="font-medium text-foreground">{skill.name}</span>
                                        </div>
                                        <span className="text-2xl font-bold text-foreground">{skill.score}%</span>
                                    </div>
                                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${skill.score}%` }}
                                            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                            className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Channels Distribution */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <h2 className="text-xl font-semibold text-foreground mb-4">Canales Practicados</h2>
                <div className="grid gap-4 md:grid-cols-4">
                    {channels.map((ch) => (
                        <Card key={ch.name} className="bg-card/50 backdrop-blur border-border/50">
                            <CardContent className="pt-6 flex flex-col items-center">
                                <ch.icon className={`w-8 h-8 ${ch.color} mb-2`} />
                                <span className="text-sm text-muted-foreground">{ch.name}</span>
                                <span className="text-2xl font-bold text-foreground">{ch.count}</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
