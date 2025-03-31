"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { useUser } from "@/contexts/user-context"

export function SiteHeader() {
  const { user, isLoading } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="font-bold text-lg mr-8">
          Tasker
        </Link>
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          {!isLoading && !user ? (
            <Button asChild>
              <Link href="/login">Zaloguj się</Link>
            </Button>
          ) : (
            <UserNav />
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}