"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  CheckSquare, 
  Briefcase, 
  Users, 
  Building2, 
  Settings, 
  Calendar 
} from "lucide-react"
import { cn } from "@/lib/utils"

// Definicja elementów nawigacji
const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Zadania",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Spotkania",
    href: "/meetings",
    icon: Calendar,
  },
  {
    title: "Projekty",
    href: "/projects",
    icon: Briefcase,
  },
  {
    title: "Zespół",
    href: "/team",
    icon: Users,
  },
  {
    title: "Struktura",
    href: "/structure",
    icon: Building2,
  },
  {
    title: "Ustawienia",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="group/sidebar h-screen bg-white dark:bg-gray-950 border-r w-16 lg:w-64 transition-all duration-300 flex flex-col">
      <div className="h-16 flex items-center justify-center lg:justify-start px-4 border-b">
        <Link
          href="/"
          className="flex items-center text-lg font-semibold"
        >
          <span className="lg:inline-block bg-primary text-primary-foreground w-8 h-8 rounded flex items-center justify-center">T</span>
          <span className="hidden lg:inline-block ml-2">Tasker</span>
        </Link>
      </div>
      <nav className="p-2 flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center py-2 px-3 rounded-md group-hover/sidebar:justify-start",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="hidden lg:inline-block ml-2">{item.title}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 text-xs text-muted-foreground hidden lg:block">
        <p className="mb-1">Potrzebujesz pomocy?</p>
        <p>Sprawdź naszą dokumentację lub skontaktuj się z supportem.</p>
        <Link 
          href="#" 
          className="inline-block mt-2 px-4 py-1 bg-background border rounded-md hover:bg-muted transition-colors"
        >
          Pomoc
        </Link>
      </div>
    </div>
  )
}