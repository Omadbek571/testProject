"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  Star,
  Target,
  TrendingUp,
  User,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()

  // Mock user data
  const userData = {
    name: "Alisher Karimov",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Abituriyent",
    balance: 50000,
    level: "Oltin",
    joinDate: "2023-05-15",
    stats: {
      totalTests: 42,
      completedTests: 38,
      averageScore: 87,
      totalHours: 68,
      currentStreak: 7,
      longestStreak: 14,
      level: 8,
      levelProgress: 75,
      nextLevelPoints: 250,
      currentPoints: 187,
    },
    subjects: [
      { name: "Matematika", progress: 85 },
      { name: "Fizika", progress: 72 },
      { name: "Ingliz tili", progress: 93 },
      { name: "Ona tili", progress: 78 },
      { name: "Tarix", progress: 65 },
    ],
    recentTests: [
      { id: 1, subject: "Matematika", title: "Algebra asoslari", score: 92, maxScore: 100, date: "2023-06-10" },
      { id: 2, subject: "Fizika", title: "Mexanika", score: 85, maxScore: 100, date: "2023-06-08" },
      { id: 3, subject: "Ingliz tili", title: "Grammar Test", score: 78, maxScore: 100, date: "2023-06-05" },
    ],
    recommendedTests: [
      { id: 1, subject: "Matematika", title: "Trigonometriya", difficulty: "O'rta" },
      { id: 2, subject: "Fizika", title: "Elektr va magnetizm", difficulty: "Qiyin" },
      { id: 3, subject: "Ingliz tili", title: "Reading Comprehension", difficulty: "O'rta" },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Shaxsiy kabinet</h1>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => router.push("/notifications")}
              >
                Bildirishnomalar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => router.push("/profile/settings")}
              >
                Sozlamalar
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="bg-blue-500 text-white text-2xl">
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{userData.name}</h2>
              <p className="text-blue-100">{userData.role}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="bg-white/20 rounded-full px-4 py-1 text-sm">
                  A'zo bo'lgan: {new Date(userData.joinDate).toLocaleDateString("uz-UZ")}
                </div>
                <div className="bg-yellow-500/80 rounded-full px-4 py-1 text-sm font-medium">
                  {userData.level} daraja
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-sm">Balans</div>
                <div className="text-xl font-bold">{userData.balance.toLocaleString()} so'm</div>
              </div>
              <Button className="bg-white text-blue-700 hover:bg-blue-50" onClick={() => router.push("/profile/edit")}>
                <User size={16} className="mr-2" />
                Profilni tahrirlash
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Stats */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Target className="mr-2 h-5 w-5 text-blue-500" />
                  O'qish statistikasi
                </CardTitle>
                <CardDescription>Sizning o'qish ko'rsatkichlaringiz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-500">Jami testlar</div>
                      <div className="text-2xl font-bold text-blue-700">{userData.stats.totalTests}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-500">Tugatilgan</div>
                      <div className="text-2xl font-bold text-green-700">{userData.stats.completedTests}</div>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-500">O'rtacha ball</div>
                    <div className="text-2xl font-bold text-amber-700">{userData.stats.averageScore}%</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-500">Jami soatlar</div>
                      <div className="text-2xl font-bold text-purple-700">{userData.stats.totalHours}</div>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-500">Streak</div>
                      <div className="text-2xl font-bold text-indigo-700">{userData.stats.currentStreak} kun</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5 text-yellow-500" />
                  Daraja va yutuqlar
                </CardTitle>
                <CardDescription>Sizning darajangiz va yutuqlaringiz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Joriy daraja</div>
                    <div className="text-2xl font-bold">{userData.stats.level}-daraja</div>
                    <div className="mt-2">
                      <Progress value={userData.stats.levelProgress} className="h-2" />
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {userData.stats.currentPoints}/{userData.stats.nextLevelPoints} ball (
                      {userData.stats.levelProgress}%)
                    </div>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium mb-2">So'nggi yutuqlar</div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">5 ta test ketma-ket</div>
                          <div className="text-xs text-gray-500">2 kun oldin</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">90% dan yuqori ball</div>
                          <div className="text-xs text-gray-500">5 kun oldin</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                          <Clock className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">1 haftalik streak</div>
                          <div className="text-xs text-gray-500">Bugun</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-indigo-500" />
                  Fanlar bo'yicha progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userData.subjects.map((subject) => (
                    <div key={subject.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{subject.name}</span>
                        <span className="text-sm text-gray-500">{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Main content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-blue-500" />
                  Umumiy ko'rsatkichlar
                </CardTitle>
                <CardDescription>Sizning o'qish ko'rsatkichlaringiz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-sm text-gray-500">Jami testlar</div>
                      <div className="text-2xl font-bold">{userData.stats.totalTests}</div>
                      <div className="text-xs text-green-600 mt-1">+5 o'tgan haftaga nisbatan</div>
                    </CardContent>
                  </Card>

                  <Card className="border">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-sm text-gray-500">O'rtacha ball</div>
                      <div className="text-2xl font-bold">{userData.stats.averageScore}%</div>
                      <div className="text-xs text-green-600 mt-1">+2% o'tgan haftaga nisbatan</div>
                    </CardContent>
                  </Card>

                  <Card className="border">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Clock className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-sm text-gray-500">O'qish vaqti</div>
                      <div className="text-2xl font-bold">{userData.stats.totalHours} soat</div>
                      <div className="text-xs text-green-600 mt-1">+8 soat o'tgan haftaga nisbatan</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  So'nggi faoliyat
                </CardTitle>
                <CardDescription>Sizning so'nggi test natijalari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.recentTests.map((test) => (
                    <div key={test.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">
                              {test.subject}
                            </Badge>
                            <h3 className="font-medium">{test.title}</h3>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {new Date(test.date).toLocaleDateString("uz-UZ")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {test.score}/{test.maxScore}
                          </div>
                          <div className="text-sm text-gray-500">{Math.round((test.score / test.maxScore) * 100)}%</div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress value={(test.score / test.maxScore) * 100} className="h-2" />
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/tests/results/${test.id}`)}>
                          Batafsil ko'rish
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-center">
                    <Button variant="outline" onClick={() => router.push("/tests/all")}>
                      Barcha testlarni ko'rish
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Star className="mr-2 h-5 w-5 text-amber-500" />
                  Tavsiya etilgan testlar
                </CardTitle>
                <CardDescription>Sizning o'qish ko'rsatkichlaringizga asoslangan testlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {userData.recommendedTests.map((test) => (
                    <Card key={test.id} className="border">
                      <CardContent className="p-4">
                        <Badge variant="outline" className="mb-2">
                          {test.subject}
                        </Badge>
                        <h3 className="font-medium mb-1">{test.title}</h3>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">Qiyinlik: {test.difficulty}</div>
                          <Button size="sm" variant="ghost" onClick={() => router.push(`/tests/${test.id}`)}>
                            Boshlash
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center mt-4">
                  <Button variant="outline" onClick={() => router.push("/tests/recommended")}>
                    Ko'proq tavsiyalar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-indigo-500" />
                  O'qish jadvali
                </CardTitle>
                <CardDescription>Bugungi o'qish jadvalingiz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Matematika</h3>
                          <div className="text-sm text-gray-500">09:00 - 10:30</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Hozir
                      </Badge>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <Clock className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Fizika</h3>
                          <div className="text-sm text-gray-500">11:00 - 12:30</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Keyingi
                      </Badge>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                          <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Ingliz tili</h3>
                          <div className="text-sm text-gray-500">14:00 - 15:30</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Keyingi
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-center mt-2">
                    <Button variant="outline" onClick={() => router.push("/schedule")}>
                      To'liq jadval
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

