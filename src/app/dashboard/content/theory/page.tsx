
"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, BookOpen, Lightbulb, CheckCircle, Play, Sparkles, Zap, Trophy, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ModeToggle } from '@/components/mode-toggle'
import { VideoPlayer } from '@/components/ui/video-player'
import { cn } from '@/lib/utils'
import confetti from 'canvas-confetti'

interface StoryContent {
    title: string
    emoji: string
    hook: { text: string; emoji: string }
    story: {
        context: string
        problem: string
        solution: string
        character: string
    }
    versus: { wrong_way: string; right_way: string }
    interactive_challenge: {
        question: string
        options: string[]
        correct_option_index: number
    }
    key_takeaway: string
}

export default function TheoryContentPage() {
    const router = useRouter()
    const [content, setContent] = useState<StoryContent | any>(null)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [loading, setLoading] = useState(true)
    const [isCompleting, setIsCompleting] = useState(false)
    const [pathId, setPathId] = useState<string | null>(null)
    const [moduleIndex, setModuleIndex] = useState<number | null>(null)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [showFeedback, setShowFeedback] = useState(false)

    // Total slides: Intro (Hook) -> Story -> Versus -> Challenge -> Outro (Takeaway)
    const totalSlides = 5

    useEffect(() => {
        const stored = sessionStorage.getItem('current_theory_content')
        const storedPathId = sessionStorage.getItem('current_path_id')
        const storedModuleIndex = sessionStorage.getItem('current_module_index')

        if (stored) {
            setContent(JSON.parse(stored))
            if (storedPathId) setPathId(storedPathId)
            if (storedModuleIndex) setModuleIndex(parseInt(storedModuleIndex, 10))
            setLoading(false)
        } else {
            setLoading(false)
        }
    }, [router])

    const nextSlide = () => {
        if (currentSlide < totalSlides - 1) {
            setCurrentSlide(prev => prev + 1)
        } else {
            handleComplete()
        }
    }

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1)
        }
    }

    const handleChallengeSubmit = (index: number) => {
        setSelectedOption(index)
        setShowFeedback(true)
        if (index === content.interactive_challenge.correct_option_index) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            })
        }
    }

    const handleComplete = async () => {
        if (pathId !== null && moduleIndex !== null) {
            setIsCompleting(true)
            try {
                const res = await fetch('/api/module/complete', {
                    method: 'POST',
                    body: JSON.stringify({ pathId, moduleIndex })
                })
                const data = await res.json()
                if (data.success) {
                    sessionStorage.removeItem('current_theory_content')
                    sessionStorage.removeItem('current_module_title')
                    sessionStorage.removeItem('current_path_id')
                    sessionStorage.removeItem('current_module_index')
                    router.push(`/dashboard/track/${pathId}`)
                    return
                }
            } catch (err) {
                console.error('Error completing module:', err)
            } finally {
                setIsCompleting(false)
            }
        } else {
            router.back()
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
        )
    }

    if (!content) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
                <p>No se encontró contenido.</p>
                <Button onClick={() => router.push('/dashboard')}>Volver</Button>
            </div>
        )
    }

    // Determine if content is legacy or new story format
    const isNewFormat = 'hook' in content

    if (!isNewFormat) {
        // Fallback for legacy content (simple redirect or simple render)
        // For now, let's just render a simple message or the old component logic if needed.
        // But since we want to move forward, let's assume all new content will be generated in new format
        // Or wrap old content in a simple compatible object if we wanted to be robust.
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-8">
                <p className="text-xl mb-4">Formato de lección antiguo.</p>
                <Button onClick={handleComplete}>Marcar como Leído</Button>
            </div>
        )
    }

    const storyContent = content as StoryContent

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden flex flex-col">

            {/* Progress Bar */}
            <div className="flex gap-1 p-2">
                {Array.from({ length: totalSlides }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1.5 flex-1 rounded-full transition-all duration-300",
                            i <= currentSlide ? "bg-purple-500" : "bg-slate-800"
                        )}
                    />
                ))}
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white/50 hover:text-white">
                    <XCircle className="w-6 h-6" />
                </Button>
                <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                    {storyContent.emoji} {storyContent.title}
                </Badge>
                <div className="w-8" /> {/* Spacer */}
            </div>

            <main className="flex-1 flex flex-col relative max-w-md mx-auto w-full px-6 py-6 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">

                    {/* SLIDE 1: HOOK */}
                    {currentSlide === 0 && (
                        <motion.div
                            key="hook"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col justify-center h-full text-center space-y-8"
                        >
                            <div className="text-8xl animate-bounce">{storyContent.hook.emoji}</div>
                            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 leading-tight">
                                "{storyContent.hook.text}"
                            </h1>
                            <p className="text-white/60 text-lg">¿Te suena familiar?</p>
                        </motion.div>
                    )}

                    {/* SLIDE 2: STORY */}
                    {currentSlide === 1 && (
                        <motion.div
                            key="story"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-lg">
                                        {storyContent.story.character[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{storyContent.story.character}</p>
                                        <p className="text-xs text-white/40 uppercase tracking-wider">La Situación</p>
                                    </div>
                                </div>
                                <p className="text-white/80 italic border-l-2 border-purple-500 pl-4 mb-4">
                                    "{storyContent.story.context}"
                                </p>
                                <div className="space-y-4">
                                    <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                        <p className="text-red-300 font-medium text-sm mb-1">❌ El Problema</p>
                                        <p className="text-white/90">{storyContent.story.problem}</p>
                                    </div>
                                    <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                                        <p className="text-green-300 font-medium text-sm mb-1">✅ La Solución</p>
                                        <p className="text-white/90">{storyContent.story.solution}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SLIDE 3: VERSUS */}
                    {currentSlide === 2 && (
                        <motion.div
                            key="versus"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                                <Zap className="text-yellow-400 fill-yellow-400" />
                                VS
                                <Zap className="text-yellow-400 fill-yellow-400" />
                            </h2>

                            <div className="space-y-6">
                                <div className="relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-red-500/20 blur-xl group-hover:bg-red-500/30 transition-all" />
                                    <div className="relative bg-slate-900 border border-red-500/30 p-6 rounded-xl">
                                        <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">NOVATO 👶</div>
                                        <p className="text-white/90 font-medium">{storyContent.versus.wrong_way}</p>
                                    </div>
                                </div>

                                <div className="relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-green-500/20 blur-xl group-hover:bg-green-500/30 transition-all" />
                                    <div className="relative bg-slate-900 border border-green-500/30 p-6 rounded-xl scale-105 shadow-xl shadow-green-900/20">
                                        <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">PRO 🏆</div>
                                        <p className="text-white/90 font-bold text-lg">{storyContent.versus.right_way}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SLIDE 4: CHALLENGE */}
                    {currentSlide === 3 && (
                        <motion.div
                            key="challenge"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-6">
                                <span className="inline-block p-3 rounded-full bg-purple-500/20 mb-4">
                                    <Trophy className="w-8 h-8 text-purple-400" />
                                </span>
                                <h2 className="text-xl font-bold">Challenge Rápido</h2>
                            </div>

                            <p className="text-lg font-medium text-center mb-8">{storyContent.interactive_challenge.question}</p>

                            <div className="space-y-3">
                                {storyContent.interactive_challenge.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleChallengeSubmit(idx)}
                                        disabled={showFeedback}
                                        className={cn(
                                            "w-full p-4 rounded-xl text-left transition-all border-2",
                                            showFeedback && idx === storyContent.interactive_challenge.correct_option_index
                                                ? "bg-green-500/20 border-green-500 text-green-200"
                                                : showFeedback && idx === selectedOption
                                                    ? "bg-red-500/20 border-red-500 text-red-200"
                                                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                                                showFeedback && idx === storyContent.interactive_challenge.correct_option_index
                                                    ? "border-green-500 bg-green-500 text-black"
                                                    : "border-white/30"
                                            )}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            {option}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {showFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-purple-500/20 rounded-xl text-center text-purple-200 text-sm font-medium"
                                >
                                    {selectedOption === storyContent.interactive_challenge.correct_option_index
                                        ? "¡Correcto! Entendiste la idea. 🎉"
                                        : "Casi... Revisa el ejemplo Pro de nuevo."}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* SLIDE 5: TAKEAWAY (OUTRO) */}
                    {currentSlide === 4 && (
                        <motion.div
                            key="outro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col justify-center h-full text-center space-y-10"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 animate-pulse" />
                                <Sparkles className="w-16 h-16 text-purple-400 mx-auto relative z-10" />
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-4">La Lección de Hoy</h3>
                                <p className="text-2xl font-bold leading-relaxed">
                                    "{storyContent.key_takeaway}"
                                </p>
                            </div>

                            <div className="pt-8">
                                <Button
                                    size="lg"
                                    onClick={handleComplete}
                                    className="w-full bg-white text-purple-900 hover:bg-white/90 font-bold text-lg h-14 rounded-xl shadow-xl shadow-white/10"
                                >
                                    Completar y Guardar
                                </Button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>

            {/* Navigation Controls */}
            <div className="p-6 flex items-center justify-between bg-slate-900 border-t border-white/5">
                <Button
                    variant="ghost"
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="text-white/50 hover:text-white"
                >
                    Atrás
                </Button>

                {/* Only show 'Next' if not in Challenge slide (must answer first) or if answered */}
                {currentSlide < totalSlides - 1 && (
                    <Button
                        onClick={nextSlide}
                        disabled={currentSlide === 3 && !showFeedback} // Block 'Next' on Challenge until answered
                        className="bg-purple-600 hover:bg-purple-500 text-white rounded-full px-8"
                    >
                        Siguiente
                    </Button>
                )}
            </div>
        </div>
    )
}
