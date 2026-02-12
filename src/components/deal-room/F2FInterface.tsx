'use client'

import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Mic, ArrowLeft } from 'lucide-react'
import { ClientProfile, Message } from './WhatsAppInterface'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface F2FInterfaceProps {
    messages: Message[]
    client: ClientProfile
    onSendMessage: (text: string) => void
    onExit: () => void
    isTyping?: boolean
    onEndSimulation?: () => void
}

export default function F2FInterface({
    messages,
    client,
    onSendMessage,
    onExit,
    isTyping = false
}: F2FInterfaceProps) {
    const [inputValue, setInputValue] = React.useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (inputValue.trim()) {
            onSendMessage(inputValue)
            setInputValue('')
        }
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative">
            {/* Background Ambience - Meeting Room Abstract */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center filter blur-sm pointer-events-none" />

            {/* Header / Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                <Button variant="ghost" className="text-white hover:bg-white/10" onClick={onExit}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Salir
                </Button>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    En Reunión
                </div>
            </div>

            {/* Main Scene Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-5xl mx-auto px-4 pt-16 pb-24">

                {/* Client Avatar / Presence */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center mb-8"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000"></div>
                        <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-slate-800 shadow-2xl relative rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                            {client.avatar_url ? (
                                <img src={client.avatar_url} alt={client.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-bold text-white">{client.name.charAt(0)}</span>
                            )}
                        </div>

                        {/* Status Indicator */}
                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                            <div className={`w-4 h-4 rounded-full ${client.status === 'online' ? 'bg-green-500' : 'bg-slate-500'} border-2 border-slate-900`} />
                        </div>
                    </div>

                    <div className="mt-4 text-center bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
                        <h2 className="text-xl font-bold text-white">{client.name}</h2>
                        <p className="text-slate-300 text-sm flex items-center justify-center gap-2">
                            {client.role}
                        </p>
                    </div>
                </motion.div>

                {/* Dialogue History (Visual Novel Style) */}
                <div className="w-full flex-1 overflow-y-auto pr-2 space-y-4 max-h-[50vh] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl shadow-lg backdrop-blur-md border 
                                ${msg.role === 'user'
                                    ? 'bg-blue-600/20 border-blue-500/30 text-white rounded-tr-none'
                                    : 'bg-slate-800/80 border-slate-700 text-slate-100 rounded-tl-none'
                                }`}
                            >
                                <p className="text-base leading-relaxed">{msg.content}</p>
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start w-full">
                            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-1">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

            </div>

            {/* Input Area (Bottom Bar) */}
            <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 p-4 pb-6 z-20">
                <div className="max-w-4xl mx-auto flex gap-4 items-end">
                    <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white rounded-full h-12 w-12 shrink-0">
                        <Mic className="h-6 w-6" />
                    </Button>

                    <form onSubmit={handleSend} className="flex-1 relative">
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Escribe tu respuesta..."
                            className="bg-slate-800/50 border border-white/10 text-white h-12 w-full pl-4 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg placeholder:text-slate-500 transition-all"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="absolute right-1 top-1 h-10 w-10 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                            disabled={!inputValue.trim()}
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
