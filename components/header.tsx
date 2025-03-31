"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BellIcon } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
  return (
    <header className="border-b bg-white dark:bg-gray-950">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <BellIcon className="h-5 w-5" />
            <span className="sr-only">Powiadomienia</span>
          </Button>
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}