"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Star, Award, BarChart } from "lucide-react"
import { motion } from "framer-motion"

export default function TestsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [userStats, setUserStats] = useState({
    completedTests: 0,
    averageScore: 0,
    totalEarnings: 0,
  })

  // Fan kategoriyalari
  const subjects = [
    {
      id: "matematika",
      name: "Matematika",
      icon: "📐",
      color: "bg-blue-100 text-blue-700",
      testsCount: 28,
      rating: 4.8,
    },
    { id: "fizika", name: "Fizika", icon: "⚛️", color: "bg-purple-100 text-purple-700", testsCount: 24, rating: 4.7 },
    { id: "kimyo", name: "Kimyo", icon: "🧪", color: "bg-green-100 text-green-700", testsCount: 22, rating: 4.6 },
    {
      id: "biologiya",
      name: "Biologiya",
      icon: "🧬",
      color: "bg-emerald-100 text-emerald-700",
      testsCount: 20,
      rating: 4.5,
    },
    {
      id: "ingliz-tili",
      name: "Ingliz tili",
      icon: "🔤",
      color: "bg-red-100 text-red-700",
      testsCount: 30,
      rating: 4.9,
    },
    { id: "ona-tili", name: "Ona tili", icon: "📝", color: "bg-amber-100 text-amber-700", testsCount: 25, rating: 4.7 },
    { id: "tarix", name: "Tarix", icon: "🏛️", color: "bg-indigo-100 text-indigo-700", testsCount: 26, rating: 4.6 },
    {
      id: "geografiya",
      name: "Geografiya",
      icon: "🌍",
      color: "bg-cyan-100 text-cyan-700",
      testsCount: 18,
      rating: 4.5,
    },
  ]

  const filteredSubjects = subjects.filter((subject) => subject.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Foydalanuvchi statistikasini yuklash
  useEffect(() => {
    // Mock data - real app would load from API or localStorage
    const mockStats = {
      completedTests: 12,
      averageScore: 78,
      totalEarnings: 15000,
    }
    setUserStats(mockStats)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Testlar</h1>
            <p className="text-gray-600">Barcha fanlar bo'yicha testlar</p>
          </div>
          <Button onClick={() => router.push("/profile")}>Profilga qaytish</Button>
        </div>

        {/* Statistika kartlari */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-4 flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tugatilgan testlar</p>
                <p className="text-2xl font-bold">{userStats.completedTests}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4 flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <BarChart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">O'rtacha ball</p>
                <p className="text-2xl font-bold">{userStats.averageScore}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardContent className="p-4 flex items-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Jami ishlangan</p>
                <p className="text-2xl font-bold">{userStats.totalEarnings.toLocaleString()} so'm</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Fan qidirish..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Fanlar ro'yxati */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSubjects.map((subject) => (
            <motion.div key={subject.id} whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow h-full"
                onClick={() => router.push(`/tests/${subject.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full ${subject.color} flex items-center justify-center mr-3 text-xl`}
                    >
                      {subject.icon}
                    </div>
                    {subject.name}
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center mt-2">
                      <BookOpen className="h-4 w-4 mr-1 text-gray-500" />
                      <span>Testlar soni: {subject.testsCount}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      <span>{subject.rating}/5 reyting</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 mb-4">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Bepul
                    </Badge>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      Premium
                    </Badge>
                  </div>
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/tests/${subject.id}`)
                    }}
                  >
                    Testlarni ko'rish
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

