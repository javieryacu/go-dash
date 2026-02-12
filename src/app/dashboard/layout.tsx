export const dynamic = 'force-dynamic'

import { Sidebar } from "@/components/dashboard/Sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 overflow-y-auto h-screen bg-gradient-to-br from-background via-background to-accent/20">
                {children}
            </main>
        </div>
    )
}
