"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

// Definiowanie typu użytkownika
interface User {
  id: string
  name: string
  email: string
  image?: string
  role: "admin" | "user"
}

// Definiowanie typów dla kontekstu
interface UserContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

// Tworzenie kontekstu
const UserContext = createContext<UserContextType | undefined>(undefined)

// Mock danych użytkownika
const mockUser: User = {
  id: "user-1",
  name: "Jan Kowalski",
  email: "jan.kowalski@example.com",
  role: "admin",
}

// Provider kontekstu
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Symulacja sprawdzania sesji użytkownika przy ładowaniu
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // W przyszłości tutaj będzie API call do backendu
        // Aktualnie używamy lokalnego storage jako symulacji
        const savedUser = localStorage.getItem("user")
        
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        } else {
          // Dla celów demonstracyjnych automatycznie logujemy użytkownika
          setUser(mockUser)
          localStorage.setItem("user", JSON.stringify(mockUser))
        }
      } catch (error) {
        console.error("Błąd sprawdzania sesji:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUserSession()
  }, [])

  // Funkcja logowania
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Tutaj w przyszłości będzie rzeczywiste logowanie
      // Aktualnie akceptujemy wszystkie dane
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error("Błąd logowania:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Funkcja wylogowania
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

// Hook do korzystania z kontekstu
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}