"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import {
    LayoutDashboard,
    Target, // Reflex Gym
    Route, // Track/Journey
    MessageSquare, // Deal Room
    BarChart, // Analytics
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        variant: "default",
    },
    {
        title: "Mi Ruta",
        href: "/dashboard/track",
        icon: Route,
        variant: "ghost",
    },
    {
        title: "Reflex Gym",
        href: "/dashboard/reflex-gym",
        icon: Target,
        variant: "ghost",
    },
    {
        title: "Deal Room",
        href: "/dashboard/deal-room",
        icon: MessageSquare,
        variant: "ghost",
    },
    {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart,
        variant: "ghost",
    },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <>
            {/* Mobile Trigger */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)} className="bg-background/80 backdrop-blur-md">
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Sidebar Container */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 transform bg-card border-r border-border transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen md:flex md:flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full",
                className
            )}>

                {/* Logo/Header */}
                <div className="flex h-16 items-center px-6 border-b border-border">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                        <span className="font-bold text-white text-lg">G</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">GoDash</span>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <nav className="space-y-2">
                        {sidebarItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <span
                                    className={cn(
                                        "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                        pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href))
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    <item.icon className={cn("mr-3 h-5 w-5",
                                        pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href))
                                            ? "text-primary"
                                            : "text-muted-foreground group-hover:text-primary"
                                    )} />
                                    {item.title}
                                </span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Footer actions */}
                <div className="p-4 border-t border-border space-y-2">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Cerrar Sesión
                    </Button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}
