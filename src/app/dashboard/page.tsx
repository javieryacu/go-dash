'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/supabase/types'
import {
    Zap,
    Target,
    Trophy,
    MessageSquare,
    Phone,
    Mail,
    Users,
    TrendingUp,
    Play,
    Settings,
    LogOut,
    ChevronRight
} from 'lucide-react'

export default function DashboardPage() {
    const router = useRouter()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [standardTracks, setStandardTracks] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        const loadData = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            const [profileResult, tracksResult] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                supabase.from('standard_tracks').select('*').eq('is_active', true)
            ])

            if (profileResult.data && !profileResult.data.onboarding_completed) {
                router.push('/onboarding')
                return
            }

            setProfile(profileResult.data)
            setStandardTracks(tracksResult.data || [])
            setIsLoading(false)
        }

        loadData()
    }, [router, supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
        )
    }

    const stats = [
        { label: 'Simulaciones', value: profile?.total_simulations || 0, icon: Target, color: 'from-blue-500 to-cyan-500' },
        { label: 'Score Promedio', value: `${Math.round(profile?.avg_simulation_score || 0)}%`, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
        { label: 'Nivel', value: profile?.experience_level || 'Junior', icon: Trophy, color: 'from-orange-500 to-yellow-500' },
    ]

    const channels = [
        { name: 'WhatsApp', icon: MessageSquare, available: true, color: 'bg-green-500' },
        { name: 'Email', icon: Mail, available: false, color: 'bg-blue-500' },
        { name: 'Teléfono', icon: Phone, available: false, color: 'bg-purple-500' },
        { name: 'Presencial', icon: Users, available: false, color: 'bg-pink-500' },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-y-auto">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none fixed">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">GoDash</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-white/10 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
                {/* Welcome */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">
                        ¡Hola, {profile?.full_name || 'Vendedor'}! 👋
                    </h1>
                    <p className="text-white/60">
                        Estás listo para entrenar. ¿Qué quieres practicar hoy?
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white capitalize">{stat.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Standard Tracks */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10"
                >
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Rutas Recomendadas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {standardTracks.map((track, i) => (
                            <motion.div
                                key={track.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden group hover:border-purple-500/50 transition-all cursor-pointer"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium">
                                            {track.industry}
                                        </span>
                                        {track.difficulty && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${track.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                                                    track.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {track.difficulty}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                                        {track.title}
                                    </h3>
                                    <p className="text-white/60 text-sm mb-6 line-clamp-2">
                                        {track.description}
                                    </p>
                                    <button className="w-full py-3 rounded-xl bg-white/10 text-white font-medium group-hover:bg-purple-500 group-hover:text-white transition-all flex items-center justify-center gap-2">
                                        <Play className="w-4 h-4" />
                                        Comenzar Ruta
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        {/* Generate Custom AI Track Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + standardTracks.length * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl border border-dashed border-white/20 overflow-hidden hover:border-purple-500 transition-all cursor-pointer relative"
                        >
                            <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity" />
                            <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                                    <Zap className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    Crear Ruta con IA
                                </h3>
                                <p className="text-white/60 text-sm mb-6">
                                    Personalizada para tu objetivo exacto
                                </p>
                                <span className="text-purple-400 text-sm font-medium flex items-center gap-1 group">
                                    Generar ahora <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Quick Actions (Deal Room) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-400" />
                        Simulación Rápida (Deal Room)
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {channels.map((channel, i) => (
                            <motion.button
                                key={channel.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + i * 0.05 }}
                                disabled={!channel.available}
                                className={`relative p-6 rounded-2xl border transition-all ${channel.available
                                    ? 'bg-white/5 border-white/10 hover:border-purple-500 hover:bg-white/10 cursor-pointer'
                                    : 'bg-white/[0.02] border-white/5 cursor-not-allowed opacity-50'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-xl ${channel.color} flex items-center justify-center mb-3 mx-auto`}>
                                    <channel.icon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-white font-medium text-center">{channel.name}</p>
                                {!channel.available && (
                                    <span className="absolute top-3 right-3 text-xs bg-white/10 text-white/50 px-2 py-1 rounded-full">
                                        Próximamente
                                    </span>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Start Training CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                ¿Listo para tu primera simulación?
                            </h2>
                            <p className="text-white/60">
                                Practica con un cliente IA en WhatsApp y recibe feedback inmediato
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/25"
                        >
                            <Play className="w-5 h-5" />
                            Comenzar Simulación
                            <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
