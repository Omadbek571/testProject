"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  role: string
  name: string
  email: string
} | null

type AuthContextType = {
  user: User
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      // `/register` sahifasiga hech qanday yo‘naltirish qilinmasin
      if (pathname === "/register") return;

      if (!user) {
        // Foydalanuvchi yo‘q va hozirgi sahifa login sahifasi bo‘lmasa, login sahifasiga yo‘naltirish
        if (pathname !== "/") {
          router.push("/")
        }
      } else {
        // Foydalanuvchi tizimga kirgan bo‘lsa va login sahifasida bo‘lsa, kerakli sahifaga yo‘naltirish
        if (pathname === "/") {
          if (user.role === "superadmin") {
            router.push("/admin/dashboard")
          } else if (user.role === "applicant") {
            router.push("/profile")
          }
        }

        // Admin sahifalariga faqat superadmin kirishi mumkin
        if (pathname.startsWith("/admin") && user.role !== "superadmin") {
          router.push("/profile")
        }
      }
    }
  }, [user, isLoading, pathname, router])

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
