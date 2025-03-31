"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, BellIcon } from "lucide-react"
import { UserNav } from "@/components/user-nav"

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          {/* Usuń przycisk Nowe zadanie stąd, ponieważ już istnieje na stronie zadań */}
          {/* 
          <Button variant="outline" size="sm" asChild>
            <Link href="/tasks/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nowe zadanie
            </Link>
          </Button>
          */}
          <Button variant="ghost" size="icon">
            <BellIcon className="h-5 w-5" />
            <span className="sr-only">Powiadomienia</span>
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  )
}
