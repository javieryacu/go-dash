"use client"

import { Play, Pause, Volume2, Maximize } from "lucide-react"
import { useState } from "react"
import { Button } from "./button"

interface VideoPlayerProps {
    src?: string
    poster?: string
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)

    return (
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group shadow-lg">
            {/* Poster / Thumbnail Placeholder */}
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                {!isPlaying && (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <Button
                            size="icon"
                            className="w-16 h-16 rounded-full bg-primary/90 text-primary-foreground hover:bg-primary hover:scale-105 transition-all shadow-xl z-20"
                            onClick={() => setIsPlaying(true)}
                        >
                            <Play className="w-8 h-8 fill-current ml-1" />
                        </Button>
                        <p className="absolute bottom-4 left-4 text-white font-medium z-20">
                            Video de la Lección (Simulado)
                        </p>
                    </>
                )}

                {isPlaying && (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 flex-col gap-2 animate-in fade-in">
                        <Play className="w-12 h-12 opacity-50" />
                        <p>Video Playing...</p>
                        <Button variant="outline" size="sm" onClick={() => setIsPlaying(false)}>
                            Pausar
                        </Button>
                    </div>
                )}
            </div>

            {/* Controls Overlay (Mock) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-1 w-full bg-white/30 rounded-full mb-4 overflow-hidden">
                    <div className="h-full w-1/3 bg-primary" />
                </div>
                <div className="flex items-center justify-between text-white">
                    <div className="flex gap-2">
                        <Play className="w-5 h-5 fill-white" />
                        <Volume2 className="w-5 h-5" />
                        <span className="text-xs font-medium ml-2">02:30 / 05:00</span>
                    </div>
                    <Maximize className="w-5 h-5" />
                </div>
            </div>
        </div>
    )
}
