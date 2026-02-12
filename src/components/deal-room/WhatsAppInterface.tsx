'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Send,
    MoreVertical,
    Phone,
    Video,
    Search,
    Paperclip,
    Smile,
    Mic,
    Check,
    CheckCheck,
    ArrowLeft
} from 'lucide-react'

// Types for the interface
export interface Message {
    id: string
    role: 'user' | 'client'
    content: string
    timestamp: Date
    status?: 'sent' | 'delivered' | 'read'
}

export interface ClientProfile {
    name: string
    avatar_url?: string
    status: 'online' | 'offline' | 'typing...'
    role: string // e.g., "Comprador de Ropa"
}

interface WhatsAppInterfaceProps {
    messages: Message[]
    client: ClientProfile
    onSendMessage: (text: string) => void
    onExit: () => void
    isTyping?: boolean
}

export default function WhatsAppInterface({
    messages,
    client,
    onSendMessage,
    onExit,
    isTyping = false
}: WhatsAppInterfaceProps) {
    const [inputValue, setInputValue] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
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

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="flex h-screen bg-[#0f1419] overflow-hidden">
            {/* Side Bar (Left - Simulation Context) */}
            <div className="hidden md:flex w-[400px] flex-col border-r border-[#2f3336]">
                {/* Header */}
                <div className="h-[60px] bg-[#202c33] flex items-center justify-between px-4 border-b border-[#2f3336]">
                    <div className="w-10 h-10 rounded-full bg-slate-400 overflow-hidden">
                        {/* User Avatar Placeholder */}
                        <div className="w-full h-full bg-gradient-to-tr from-purple-500 to-pink-500" />
                    </div>
                    <div className="flex gap-4 text-[#aebac1]">
                        <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#aebac1]" title="Status" />
                        <MoreVertical className="w-6 h-6 cursor-pointer" />
                    </div>
                </div>

                {/* Search */}
                <div className="h-[49px] bg-[#111b21] flex items-center px-3 border-b border-[#2f3336]">
                    <div className="bg-[#202c33] rounded-lg h-[35px] w-full flex items-center px-3 gap-3">
                        <Search className="w-4 h-4 text-[#aebac1]" />
                        <input
                            placeholder="Buscar o empezar un nuevo chat"
                            className="bg-transparent text-[#d1d7db] text-sm w-full outline-none placeholder-[#8696a0]"
                            disabled
                        />
                    </div>
                </div>

                {/* Chat List (Only one active chat for simulation) */}
                <div className="flex-1 overflow-y-auto bg-[#111b21]">
                    <div className="hover:bg-[#202c33] cursor-pointer transition-colors">
                        <div className="flex items-center px-3 py-3 gap-3 border-b border-[#2f3336]">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                                    {client.avatar_url ? (
                                        <img src={client.avatar_url} alt={client.name} className="w-full h-full object-cover" />
                                    ) : (
                                        client.name.charAt(0)
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[#d1d7db] font-normal text-[17px] truncate">
                                        {client.name}
                                    </span>
                                    <span className="text-[#8696a0] text-xs">
                                        {messages.length > 0 ? formatTime(messages[messages.length - 1].timestamp) : ''}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#8696a0] text-sm truncate block w-full">
                                        {isTyping ? (
                                            <span className="text-[#00a884] font-medium">Escribiendo...</span>
                                        ) : (
                                            messages.length > 0 ? messages[messages.length - 1].content : client.role
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer (Exit Simulation) */}
                <div className="bg-[#202c33] p-4 border-t border-[#2f3336]">
                    <button
                        onClick={onExit}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all font-medium text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Salir de la Simulación
                    </button>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full bg-[#0b141a] relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.06] bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/WhatsApp_Doodle.svg/1024px-WhatsApp_Doodle.svg.png')] bg-repeat" />

                {/* Header */}
                <div className="h-[60px] bg-[#202c33] flex items-center justify-between px-4 z-10 border-b border-[#2f3336]">
                    <div className="flex items-center gap-4">
                        {/* Mobile Back Button */}
                        <button onClick={onExit} className="md:hidden text-[#aebac1]">
                            <ArrowLeft className="w-6 h-6" />
                        </button>

                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold overflow-hidden">
                            {client.avatar_url ? (
                                <img src={client.avatar_url} alt={client.name} className="w-full h-full object-cover" />
                            ) : (
                                client.name.charAt(0)
                            )}
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-[#d1d7db] font-medium text-base leading-tight">
                                {client.name}
                            </span>
                            <span className="text-[#8696a0] text-xs leading-tight">
                                {client.status === 'typing...' ? 'escribiendo...' : client.status}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-[#aebac1]">
                        <Video className="w-6 h-6 cursor-pointer hover:text-white transition-colors" />
                        <Phone className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                        <div className="w-[1px] h-6 bg-[#2f3336]" />
                        <Search className="w-6 h-6 cursor-pointer hover:text-white transition-colors" />
                        <MoreVertical className="w-6 h-6 cursor-pointer hover:text-white transition-colors" />
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 z-10 space-y-2">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`
                     max-w-[75%] md:max-w-[60%] rounded-lg p-2 pl-3 shadow-sm relative text-sm leading-[19px] pb-4 min-w-[100px]
                     ${msg.role === 'user'
                                        ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                                        : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'
                                    }
                   `}
                            >
                                {msg.content}

                                {/* Timestamp & Status */}
                                <div className="absolute bottom-1 right-2 flex items-center gap-1">
                                    <span className="text-[11px] text-[#ffffff99]">
                                        {formatTime(msg.timestamp)}
                                    </span>
                                    {msg.role === 'user' && (
                                        <span className={msg.status === 'read' ? 'text-[#53bdeb]' : 'text-[#ffffff99]'}>
                                            {msg.status === 'read' ? <CheckCheck className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                                        </span>
                                    )}
                                </div>

                                {/* Triangle Tail */}
                                <div
                                    className={`absolute top-0 w-3 h-3 
                        ${msg.role === 'user'
                                            ? '-right-3 bg-[#005c4b] [clip-path:polygon(0_0,0_100%,100%_0)]'
                                            : '-left-3 bg-[#202c33] [clip-path:polygon(0_0,100%_0,100%_100%)]'
                                        }
                      `}
                                />
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                        >
                            <div className="bg-[#202c33] text-[#e9edef] rounded-lg rounded-tl-none p-4 shadow-sm relative max-w-[100px]">
                                <div className="flex gap-1">
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                        className="w-2 h-2 bg-[#8696a0] rounded-full"
                                    />
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                        className="w-2 h-2 bg-[#8696a0] rounded-full"
                                    />
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                        className="w-2 h-2 bg-[#8696a0] rounded-full"
                                    />
                                </div>
                                <div className="absolute top-0 -left-3 w-3 h-3 bg-[#202c33] [clip-path:polygon(0_0,100%_0,100%_100%)]" />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="min-h-[62px] bg-[#202c33] px-4 py-2 flex items-end gap-3 z-10 border-t border-[#2f3336]">
                    <div className="pb-3 flex gap-4 text-[#8696a0]">
                        <Smile className="w-6 h-6 cursor-pointer hover:text-[#cfd7da] transition-colors" />
                        <Paperclip className="w-6 h-6 cursor-pointer hover:text-[#cfd7da] transition-colors" />
                    </div>

                    <form onSubmit={handleSend} className="flex-1 mb-1">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full bg-[#2a3942] rounded-lg py-[9px] px-4 text-[#d1d7db] placeholder-[#8696a0] text-[15px] outline-none border-none focus:ring-0"
                            placeholder="Escribe un mensaje"
                        />
                    </form>

                    <div className="pb-2">
                        {inputValue.trim() ? (
                            <button
                                onClick={() => handleSend()}
                                className="p-3 bg-[#005c4b] rounded-full text-white hover:bg-[#00a884] transition-colors shadow-md" // Enviar
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        ) : (
                            <button className="p-3 bg-transparent text-[#8696a0] hover:text-[#cfd7da] transition-colors">
                                <Mic className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
