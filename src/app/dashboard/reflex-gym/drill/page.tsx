"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Mock Data for Drills
const MOCK_DRILL_DATA = [
    {
        id: "1",
        objection: "Es muy caro para nosotros en este momento.",
        options: [
            { id: "A", text: "Entiendo, pero ¿cuál es su presupuesto?", correct: false, feedback: "Demasiado directo. No validaste la preocupación primero." },
            { id: "B", text: "Entiendo que el presupuesto es clave. ¿Con qué lo están comparando exactamente?", correct: true, feedback: "¡Excelente! Validaste y exploraste el contexto (LAER)." },
            { id: "C", text: "Podemos ofrecerte un descuento del 10%.", correct: false, feedback: "Nunca ofrezcas descuentos sin entender el problema real." },
        ]
    },
    {
        id: "2",
        objection: "Ya trabajamos con un competidor.",
        options: [
            { id: "A", text: "¿Y están felices con ellos?", correct: true, feedback: "Bien. Pregunta abierta que invita a compartir dolor sin ser agresivo." },
            { id: "B", text: "Nuestro producto es mejor porque...", correct: false, feedback: "No pelees. Escucha primero." },
            { id: "C", text: "Ese competidor tiene mala fama.", correct: false, feedback: "Nunca hables mal de la competencia." },
        ]
    },
    // We can add more later
]

const TIME_LIMIT = 5 // seconds

export default function DrillPage() {
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
    const [isActive, setIsActive] = useState(false) // Start strict timer only after ready? Or immediately? Let's do immediate for now.
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [isPaused, setIsPaused] = useState(false)
    const [score, setScore] = useState(0)
    const [showFeedback, setShowFeedback] = useState(false)

    const currentQuestion = MOCK_DRILL_DATA[currentIndex]
    const isLastQuestion = currentIndex === MOCK_DRILL_DATA.length - 1

    // Timer Logic
    useEffect(() => {
        if (showFeedback || isPaused) return

        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
            return () => clearTimeout(timer)
        } else if (timeLeft === 0 && !selectedOption) {
            // Time out!
            handleSelectOption(null) // Treat as incorrect/missed
        }
    }, [timeLeft, showFeedback, isPaused, selectedOption])

    const handleSelectOption = (optionId: string | null) => {
        setSelectedOption(optionId)
        setShowFeedback(true)

        // Check correctness
        const option = currentQuestion.options.find(o => o.id === optionId)
        if (option?.correct) {
            setScore(prev => prev + 1)
        }
    }

    const handleNext = () => {
        if (isLastQuestion) {
            // Finish Drill
            // Here we would save stats to DB
            router.push('/dashboard/reflex-gym') // For now back to menu, ideal: Results Screen
        } else {
            setCurrentIndex(prev => prev + 1)
            setTimeLeft(TIME_LIMIT)
            setSelectedOption(null)
            setShowFeedback(false)
        }
    }

    const progress = ((currentIndex) / MOCK_DRILL_DATA.length) * 100

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Top Bar - Mobile Optimized */}
            <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </Button>

                <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Drill Progress</span>
                    <div className="w-32 h-2 bg-secondary rounded-full mt-1 overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${((currentIndex + 1) / MOCK_DRILL_DATA.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="w-10 flex justify-end font-mono font-bold text-lg text-primary">
                    {score}/{MOCK_DRILL_DATA.length}
                </div>
            </header>

            {/* Main Content - Centered & Mobile First */}
            <main className="flex-1 flex flex-col p-4 md:p-6 max-w-2xl mx-auto w-full justify-center">

                {/* Timer & Question Card */}
                <div className="space-y-6 mb-8">
                    {/* Timer */}
                    <div className="flex justify-center">
                        <div className={cn(
                            "relative w-20 h-20 rounded-full flex items-center justify-center border-4 text-3xl font-bold transition-colors duration-300",
                            timeLeft <= 2 ? "border-red-500 text-red-500 animate-pulse" : "border-primary text-primary"
                        )}>
                            {timeLeft}
                            <Clock className="absolute w-4 h-4 top-2 right-2 opacity-50" />
                        </div>
                    </div>

                    {/* Objection Text */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center"
                        >
                            <h2 className="text-2xl md:text-4xl font-bold leading-tight text-foreground">
                                "{currentQuestion.objection}"
                            </h2>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Options List - Large Touch Targets */}
                <div className="space-y-3 md:space-y-4">
                    {currentQuestion.options.map((option) => {
                        const isSelected = selectedOption === option.id
                        const showResultState = showFeedback

                        let baseStyle = "w-full text-left p-4 md:p-6 h-auto text-base md:text-lg rounded-xl transition-all border-2"
                        let variantStyle = "bg-card border-border hover:border-primary/50"

                        if (showResultState) {
                            if (option.correct) {
                                variantStyle = "bg-green-500/10 border-green-500 text-green-500"
                            } else if (isSelected && !option.correct) {
                                variantStyle = "bg-red-500/10 border-red-500 text-red-500"
                            } else {
                                variantStyle = "opacity-50 border-transparent bg-transparent"
                            }
                        }

                        return (
                            <Button
                                key={option.id}
                                variant="outline"
                                className={cn(baseStyle, variantStyle, "justify-start whitespace-normal")}
                                onClick={() => !showFeedback && handleSelectOption(option.id)}
                                disabled={showFeedback}
                            >
                                <span className="mr-4 font-bold opacity-70">{option.id}</span>
                                {option.text}
                                {showResultState && option.correct && <CheckCircle className="ml-auto w-6 h-6" />}
                                {showResultState && isSelected && !option.correct && <XCircle className="ml-auto w-6 h-6" />}
                            </Button>
                        )
                    })}
                </div>

                {/* Feedback Overlay / Bottom Sheet */}
                <AnimatePresence>
                    {showFeedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="fixed inset-x-0 bottom-0 p-4 bg-background border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] z-50 rounded-t-3xl md:relative md:bg-transparent md:border-none md:shadow-none md:p-0 md:mt-8"
                        >
                            <div className="max-w-2xl mx-auto space-y-4">
                                <div className={cn(
                                    "p-4 rounded-xl border flex gap-3 items-start",
                                    currentQuestion.options.find(o => o.id === selectedOption)?.correct
                                        ? "bg-green-500/10 border-green-500/20 text-green-200"
                                        : "bg-red-500/10 border-red-500/20 text-red-200"
                                )}>
                                    <div>
                                        {currentQuestion.options.find(o => o.id === selectedOption)?.correct
                                            ? <CheckCircle className="w-6 h-6 text-green-500" />
                                            : <XCircle className="w-6 h-6 text-red-500" />
                                        }
                                    </div>
                                    <div>
                                        <p className="font-bold mb-1">
                                            {currentQuestion.options.find(o => o.id === selectedOption)?.correct ? '¡Bien hecho!' : 'No exactamente...'}
                                        </p>
                                        <p className="text-sm opacity-90 leading-relaxed">
                                            {currentQuestion.options.find(o => o.id === selectedOption)?.feedback}
                                            {/* Show correct answer feedback if wrong? */}
                                            {selectedOption && !currentQuestion.options.find(o => o.id === selectedOption)?.correct && (
                                                <span className="block mt-2 font-semibold">
                                                    Mejor opción: {currentQuestion.options.find(o => o.correct)?.text}
                                                </span>
                                            )}
                                            {!selectedOption && (
                                                <span className="block mt-2">
                                                    Se acabó el tiempo. La mejor opción era: {currentQuestion.options.find(o => o.correct)?.text}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    size="lg"
                                    className="w-full text-lg font-bold py-6 rounded-xl animate-in fade-in slide-in-from-bottom-4"
                                    onClick={handleNext}
                                >
                                    {isLastQuestion ? "Finalizar Drill" : "Siguiente Objeción"}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    )
}
