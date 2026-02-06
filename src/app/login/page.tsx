'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Zap, Mail, Lock, ArrowRight, Github } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error

                // Check if onboarding is completed
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('onboarding_completed')
                        .eq('id', user.id)
                        .single()

                    if (profile?.onboarding_completed) {
                        router.push('/dashboard')
                    } else {
                        router.push('/onboarding')
                    }
                }
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                })
                if (error) throw error
                router.push('/onboarding')
            }
        } catch (err: any) {
            setError(err.message || 'Error al procesar la solicitud')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 mb-4"
                    >
                        <Zap className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2">GoDash</h1>
                    <p className="text-white/60">Gimnasio Digital de Ventas</p>
                </div>

                {/* Card */}
                <motion.div
                    layout
                    className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl"
                >
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${isLogin
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                    : 'text-white/60 hover:text-white'
                                }`}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${!isLogin
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                    : 'text-white/60 hover:text-white'
                                }`}
                        >
                            Registrarse
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <label className="block text-white/80 text-sm mb-2">Nombre completo</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Tu nombre"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />
                            </motion.div>
                        )}

                        <div>
                            <label className="block text-white/80 text-sm mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white/80 text-sm mb-2">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-400 text-sm text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Entrar' : 'Crear cuenta'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-white/40 text-sm">o continúa con</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* OAuth */}
                    <button
                        type="button"
                        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                    >
                        <Github className="w-5 h-5" />
                        GitHub
                    </button>
                </motion.div>

                {/* Footer */}
                <p className="text-center text-white/40 text-sm mt-6">
                    Al continuar, aceptas nuestros términos y política de privacidad
                </p>
            </motion.div>
        </div>
    )
}
