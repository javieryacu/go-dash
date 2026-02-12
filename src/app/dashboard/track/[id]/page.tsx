'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { LearningPath, SyllabusModule } from '@/lib/supabase/types'
import {
    ArrowLeft,
    BookOpen,
    CheckCircle,
    Circle,
    Clock,
    Play,
    Lock,
    Map
} from 'lucide-react'

export default function TrackPage() {
    const params = useParams()
    const router = useRouter()
    const [path, setPath] = useState<LearningPath | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [startingModuleIndex, setStartingModuleIndex] = useState<number | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const loadPath = async () => {
            if (!params.id) return

            const { data, error } = await supabase
                .from('learning_paths')
                .select('*')
                .eq('id', params.id)
                .single()

            if (error) {
                console.error('Error loading path:', error)
                router.push('/dashboard')
                return
            }

            setPath(data)
            setIsLoading(false)
        }

        loadPath()
    }, [params.id, router, supabase])

    const handleStartModule = async (index: number) => {
        // Logic to start simulation for this module
        // For now, we just redirect to simulation if it's the current module
        // In future: create simulation record if not exists
        router.push(`/dashboard/simulation/new?pathId=${path?.id}&moduleIndex=${index}`)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
        )
    }

    if (!path) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold text-white truncate">{path.title}</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Track Info */}
                {(() => {
                    // Safely parse syllabus_data (might be string or object)
                    const modules: SyllabusModule[] = Array.isArray(path.syllabus_data)
                        ? path.syllabus_data
                        : typeof path.syllabus_data === 'string'
                            ? JSON.parse(path.syllabus_data)
                            : []

                    const totalMinutes = modules.reduce((acc, m) => acc + (m.duration_minutes || 0), 0)

                    return (
                        <>
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium border border-purple-500/30">
                                        {path.industry}
                                    </span>
                                    <span className="flex items-center gap-1 text-white/40 text-sm">
                                        <Clock className="w-4 h-4" />
                                        {totalMinutes} min total
                                    </span>
                                </div>
                                <p className="text-white/70 text-lg leading-relaxed">
                                    {path.description}
                                </p>
                            </div>

                            {/* Modules Timeline */}
                            <div className="relative pl-8 border-l-2 border-white/10 space-y-12">
                                {modules.map((module, index) => {
                                    const isUnlocked = index <= path.current_module_index
                                    const isCompleted = index < path.current_module_index
                                    const isCurrent = index === path.current_module_index

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`relative ${!isUnlocked ? 'opacity-50 blur-[0.5px]' : ''}`}
                                        >
                                            {/* Timeline Dot */}
                                            <div className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 transition-colors ${isCompleted ? 'bg-green-500 border-green-500' :
                                                isCurrent ? 'bg-purple-500 border-purple-500 ring-4 ring-purple-500/20' :
                                                    'bg-slate-900 border-white/20'
                                                }`}>
                                                {isCompleted && <CheckCircle className="w-full h-full text-white" />}
                                            </div>

                                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                                                            {module.title}
                                                        </h3>
                                                        <div className="flex items-center gap-3 text-sm">
                                                            <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wider ${module.content_type === 'theory' ? 'bg-blue-500/20 text-blue-300' :
                                                                module.content_type === 'simulation' ? 'bg-green-500/20 text-green-300' :
                                                                    'bg-orange-500/20 text-orange-300'
                                                                }`}>
                                                                {module.content_type}
                                                            </span>
                                                            <span className="text-white/40 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" /> {module.duration_minutes} min
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {isCurrent && (
                                                        <button
                                                            disabled={startingModuleIndex === index}
                                                            onClick={async () => {
                                                                try {
                                                                    setStartingModuleIndex(index)
                                                                    console.log('Starting module index:', index, 'Path ID:', path.id)

                                                                    const res = await fetch('/api/module/start', {
                                                                        method: 'POST',
                                                                        body: JSON.stringify({ pathId: path.id, moduleIndex: index })
                                                                    })

                                                                    if (!res.ok) {
                                                                        const errorData = await res.json()
                                                                        throw new Error(errorData.error || 'Failed to start module')
                                                                    }

                                                                    const data = await res.json()
                                                                    console.log('Module start response:', data)

                                                                    if (data.success) {
                                                                        if (data.type === 'simulation') {
                                                                            router.push(`/dashboard/simulation/${data.resourceId}`)
                                                                        } else {
                                                                            sessionStorage.setItem('current_theory_content', JSON.stringify(data.content))
                                                                            sessionStorage.setItem('current_module_title', module.title)
                                                                            sessionStorage.setItem('current_path_id', path.id)
                                                                            sessionStorage.setItem('current_module_index', index.toString())
                                                                            router.push('/dashboard/content/theory')
                                                                        }
                                                                    }
                                                                } catch (err: any) {
                                                                    console.error('Failed to start module', err)
                                                                    alert(`Error al iniciar: ${err.message}`)
                                                                    setStartingModuleIndex(null)
                                                                }
                                                            }}
                                                            className={`px-5 py-2 rounded-xl font-medium shadow-lg flex items-center gap-2 transition-all ${startingModuleIndex === index
                                                                ? 'bg-purple-600/50 cursor-wait'
                                                                : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'
                                                                } text-white`}
                                                        >
                                                            {startingModuleIndex === index ? (
                                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            ) : (
                                                                <Play className="w-4 h-4" />
                                                            )}
                                                            {startingModuleIndex === index ? 'Cargando...' : 'Comenzar'}
                                                        </button>
                                                    )}
                                                    {!isUnlocked && <Lock className="w-5 h-5 text-white/20" />}
                                                </div>

                                                <p className="text-white/60 mb-6">{module.description}</p>

                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium text-white/40 uppercase tracking-widest">Objetivos</h4>
                                                    <ul className="space-y-2">
                                                        {module.objectives.map((obj, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 mt-1.5" />
                                                                {obj}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </>
                    )
                })()}
            </main>
        </div>
    )
}
