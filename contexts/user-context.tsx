"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  initials: string
  role: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Symulacja ładowania danych użytkownika
    const loadUser = async () => {
      // W rzeczywistej aplikacji, pobieralibyśmy dane z API
      // Tutaj symulujemy opóźnienie i zwracamy dane testowe
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUser({
        id: "user-1",
        name: "Jan Kowalski",
        email: "jan.kowalski@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JK",
        role: "Project Manager",
      })

      setIsLoading(false)
    }

    loadUser()
  }, [])

  return <UserContext.Provider value={{ user, isLoading, setUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}