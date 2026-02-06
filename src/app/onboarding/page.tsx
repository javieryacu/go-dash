'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { ExperienceLevel, TrainingGoal } from '@/lib/supabase/types'
import {
    Rocket,
    Target,
    Zap,
    ArrowRight,
    ArrowLeft,
    Briefcase,
    GraduationCap,
    Trophy,
    Phone,
    MessageSquare,
    Presentation,
    BookOpen
} from 'lucide-react'

const INDUSTRIES = [
    'SaaS B2B',
    'Seguros',
    'Inmobiliaria',
    'Consultoría',
    'Retail',
    'Fintech',
    'Healthtech',
    'Otro'
]

const EXPERIENCE_OPTIONS = [
    {
        value: 'junior' as ExperienceLevel,
        label: 'Iniciando (0-2 años)',
        description: 'Estoy empezando mi carrera en ventas',
        icon: GraduationCap,
        color: 'from-green-500 to-emerald-600'
    },
    {
        value: 'mid' as ExperienceLevel,
        label: 'En crecimiento (2-5 años)',
        description: 'Tengo experiencia y quiero mejorar',
        icon: Briefcase,
        color: 'from-blue-500 to-indigo-600'
    },
    {
        value: 'senior' as ExperienceLevel,
        label: 'Experto (5+ años)',
        description: 'Domino ventas, busco perfeccionar',
        icon: Trophy,
        color: 'from-purple-500 to-pink-600'
    }
]

const GOAL_OPTIONS = [
    {
        value: 'learn_product' as TrainingGoal,
        label: 'Aprender producto/industria',
        description: 'Quiero conocer una nueva industria',
        icon: BookOpen,
        color: 'from-cyan-500 to-blue-600'
    },
    {
        value: 'improve_skill' as TrainingGoal,
        label: 'Mejorar habilidades',
        description: 'Discovery, objeciones, closing',
        icon: Target,
        color: 'from-orange-500 to-red-600'
    },
    {
        value: 'master_channel' as TrainingGoal,
        label: 'Dominar un canal',
        description: 'WhatsApp, teléfono, presencial',
        icon: Phone,
        color: 'from-green-500 to-teal-600'
    },
    {
        value: 'prepare_pitch' as TrainingGoal,
        label: 'Preparar pitch importante',
        description: 'Tengo un deal clave próximo',
        icon: Presentation,
        color: 'from-violet-500 to-purple-600'
    }
]

interface OnboardingData {
    experience_level: ExperienceLevel | null
    training_goal: TrainingGoal | null
    industry: string | null
}

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [data, setData] = useState<OnboardingData>({
        experience_level: null,
        training_goal: null,
        industry: null
    })

    const supabase = createClient()

    const handleNext = () => {
        if (step < 2) {
            setStep(step + 1)
        }
    }

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1)
        }
    }

    const handleComplete = async () => {
        setIsSubmitting(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                await supabase
                    .from('profiles')
                    .update({
                        experience_level: data.experience_level,
                        training_goal: data.training_goal,
                        onboarding_completed: true
                    })
                    .eq('id', user.id)
            }

            router.push('/dashboard')
        } catch (error) {
            console.error('Error saving onboarding:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const canProceed = () => {
        switch (step) {
            case 0: return data.experience_level !== null
            case 1: return data.training_goal !== null
            case 2: return data.industry !== null
            default: return false
        }
    }

    const steps = [
        { title: 'Experiencia', subtitle: '¿Cuánto tiempo llevas en ventas?' },
        { title: 'Objetivo', subtitle: '¿Qué quieres lograr?' },
        { title: 'Industria', subtitle: '¿En qué sector trabajas?' }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl relative z-10"
            >
                {/* Progress bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        {steps.map((s, i) => (
                            <div key={i} className="flex items-center">
                                <motion.div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${i <= step
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                            : 'bg-white/10 text-white/50'
                                        }`}
                                    animate={{ scale: i === step ? 1.1 : 1 }}
                                >
                                    {i + 1}
                                </motion.div>
                                {i < steps.length - 1 && (
                                    <div className={`w-20 md:w-32 h-1 mx-2 rounded-full transition-all duration-300 ${i < step ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/10'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card */}
                <motion.div
                    className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl"
                    layout
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                        >
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {steps[step].title}
                            </h1>
                            <p className="text-white/60">
                                {steps[step].subtitle}
                            </p>
                        </motion.div>
                    </div>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div
                                key="step-0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                {EXPERIENCE_OPTIONS.map((option) => (
                                    <motion.button
                                        key={option.value}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setData({ ...data, experience_level: option.value })}
                                        className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 text-left ${data.experience_level === option.value
                                                ? 'border-purple-500 bg-purple-500/20'
                                                : 'border-white/10 bg-white/5 hover:border-white/30'
                                            }`}
                                    >
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${option.color} flex items-center justify-center`}>
                                            <option.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold text-lg">{option.label}</h3>
                                            <p className="text-white/50 text-sm">{option.description}</p>
                                        </div>
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div
                                key="step-1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {GOAL_OPTIONS.map((option) => (
                                    <motion.button
                                        key={option.value}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setData({ ...data, training_goal: option.value })}
                                        className={`p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center text-center ${data.training_goal === option.value
                                                ? 'border-purple-500 bg-purple-500/20'
                                                : 'border-white/10 bg-white/5 hover:border-white/30'
                                            }`}
                                    >
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${option.color} flex items-center justify-center mb-3`}>
                                            <option.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-white font-semibold">{option.label}</h3>
                                        <p className="text-white/50 text-xs mt-1">{option.description}</p>
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step-2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-3"
                            >
                                {INDUSTRIES.map((industry) => (
                                    <motion.button
                                        key={industry}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setData({ ...data, industry })}
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${data.industry === industry
                                                ? 'border-purple-500 bg-purple-500/20'
                                                : 'border-white/10 bg-white/5 hover:border-white/30'
                                            }`}
                                    >
                                        <span className="text-white font-medium text-sm">{industry}</span>
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBack}
                            disabled={step === 0}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${step === 0
                                    ? 'opacity-0 pointer-events-none'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Atrás
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={step === 2 ? handleComplete : handleNext}
                            disabled={!canProceed() || isSubmitting}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${canProceed()
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {step === 2 ? 'Comenzar' : 'Continuar'}
                                    {step === 2 ? <Rocket className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Footer */}
                <p className="text-center text-white/40 text-sm mt-6">
                    Puedes cambiar estas preferencias más tarde en tu perfil
                </p>
            </motion.div>
        </div>
    )
}
