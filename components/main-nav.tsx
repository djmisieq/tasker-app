"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { useUser } from "@/contexts/user-context"

export function MainNav() {
  const pathname = usePathname()
  const { user, isLoading } = useUser()

  // Elementy nawigacji dostępne tylko dla zalogowanych użytkowników
  const authenticatedItems = [
    {
      title: "Pulpit",
      href: "/",
    },
    {
      title: "Zadania",
      href: "/tasks",
    },
    {
      title: "Projekty",
      href: "/projects",
    },
    {
      title: "Spotkania",
      href: "/meetings",
    },
    {
      title: "Zespół",
      href: "/team",
    },
    {
      title: "Organizacja",
      href: "/organization",
    },
  ]

  // Elementy nawigacji dostępne dla wszystkich użytkowników
  const publicItems = [
    {
      title: "O nas",
      href: "/about",
    },
  ]

  // Wybierz odpowiednie elementy nawigacji w zależności od stanu uwierzytelnienia
  const navItems = isLoading ? [] : user ? authenticatedItems : publicItems

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === item.href ? "text-foreground font-semibold" : "text-foreground/60"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}