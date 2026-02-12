'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { LearningPath } from '@/lib/supabase/types'
import {
    Route,
    Clock,
    ChevronRight,
    BookOpen,
    Target,
    Zap,
    CheckCircle
} from 'lucide-react'

export default function TrackListPage() {
    const router = useRouter()
    const [paths, setPaths] = useState<LearningPath[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/login'); return }

            const { data } = await supabase
                .from('learning_paths')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            setPaths(data || [])
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

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Mi Ruta
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Tu progreso de aprendizaje personalizado
                </p>
            </header>

            {paths.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                >
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <Route className="w-10 h-10 text-primary/50" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        Aún no tienes rutas activas
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        Comienza una ruta recomendada desde el Dashboard o genera una personalizada con IA
                    </p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/25 hover:scale-105 transition-transform"
                    >
                        Ir al Dashboard
                    </button>
                </motion.div>
            ) : (
                <div className="grid gap-6">
                    {paths.map((path, i) => {
                        const progress = path.total_modules > 0
                            ? Math.round((path.current_module_index / path.total_modules) * 100)
                            : 0

                        return (
                            <motion.div
                                key={path.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => router.push(`/dashboard/track/${path.id}`)}
                                className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                                {path.industry || 'General'}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium capitalize">
                                                {path.track_type === 'ai_generated' ? '✨ IA' : 'Estándar'}
                                            </span>
                                            {path.completed && (
                                                <span className="flex items-center gap-1 text-green-500 text-xs font-medium">
                                                    <CheckCircle className="w-3 h-3" /> Completada
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                            {path.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                            {path.description}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                        <span>Módulo {path.current_module_index + 1} de {path.total_modules}</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                                            style={{ width: `${Math.max(progress, 5)}%` }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
