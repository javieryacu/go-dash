"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Play, TrendingUp, Award, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReflexGymPage() {
    const router = useRouter()

    // Mock stats - in real app would come from DB
    const stats = [
        { label: "Objeciones Dominadas", value: "23/50", icon: Award, color: "text-purple-500" },
        { label: "Tiempo Promedio", value: "2.1s", icon: Zap, color: "text-amber-500" },
        { label: "Racha Actual", value: "7 días", icon: TrendingUp, color: "text-green-500" },
    ]

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Reflex Gym
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Entrena tus reflejos de ventas. Responde objeciones en menos de 5 segundos.
                </p>
            </header>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Action Area */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-grid-white/5 mask-image-linear-gradient-to-b" />

                <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Zap className="w-10 h-10 text-primary" />
                    </div>

                    <h2 className="text-3xl font-bold text-foreground">
                        Sesión de Drill: Objeciones Comunes
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Enfréntate a 10 objeciones aleatorias. Tienes 5 segundos para elegir la mejor respuesta de acuerdo al framework LAER.
                    </p>

                    <Button
                        size="lg"
                        className="text-lg px-8 py-6 h-auto rounded-xl shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90"
                        onClick={() => router.push('/dashboard/reflex-gym/drill')}
                    >
                        <Play className="mr-2 h-5 w-5 fill-current" />
                        Comenzar Entrenamiento
                    </Button>
                </div>
            </motion.div>

            {/* Category / History placeholder */}
            <div className="space-y-4 pt-4">
                <h3 className="text-xl font-semibold">Categorías de Entrenamiento</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Placeholders for future categories */}
                    {['Precio', 'Competencia', 'Autoridad', 'Timing'].map((cat) => (
                        <Card key={cat} className="group cursor-pointer hover:bg-accent/50 transition-colors border-dashed border-border">
                            <CardContent className="p-6 flex items-center justify-between">
                                <span className="font-medium">{cat}</span>
                                <Play className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
