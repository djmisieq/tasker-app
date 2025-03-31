"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, X } from "lucide-react"

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [greeting, setGreeting] = useState("Dzień dobry")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting("Dzień dobry")
    } else if (hour < 18) {
      setGreeting("Witaj ponownie")
    } else {
      setGreeting("Dobry wieczór")
    }
  }, [])

  if (!isVisible) return null

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-none overflow-hidden relative">
      <CardContent className="p-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Zamknij</span>
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{greeting}, Jan!</h1>
            <p className="text-muted-foreground">Masz 3 nadchodzące spotkania i 8 zadań do wykonania w tym tygodniu.</p>
          </div>
          <Button className="gap-2">
            Przegląd tygodnia
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}