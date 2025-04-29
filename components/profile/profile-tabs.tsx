"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  BookOpen,
  Calendar,
  CheckCircle,
  Download,
  FileText,
  GraduationCap,
  History,
  Star,
  Wallet,
} from "lucide-react"
import { useRouter } from "next/navigation"

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  // Mock data
  const recentTests = [
    { id: 1, subject: "Matematika", title: "Algebra asoslari", score: 92, maxScore: 100, date: "2023-06-10" },
    { id: 2, subject: "Fizika", title: "Mexanika", score: 85, maxScore: 100, date: "2023-06-08" },
    { id: 3, subject: "Ingliz tili", title: "Grammar Test", score: 78, maxScore: 100, date: "2023-06-05" },
    { id: 4, subject: "Ona tili", title: "Sintaksis", score: 95, maxScore: 100, date: "2023-06-03" },
  ]

  const recommendedTests = [
    { id: 1, subject: "Matematika", title: "Trigonometriya", difficulty: "O'rta" },
    { id: 2, subject: "Fizika", title: "Elektr va magnetizm", difficulty: "Qiyin" },
    { id: 3, subject: "Ingliz tili", title: "Reading Comprehension", difficulty: "O'rta" },
  ]

  const transactions = [
    { id: 1, type: "Kirim", amount: 50000, description: "Hisobni to'ldirish", date: "2023-06-01" },
    { id: 2, type: "Chiqim", amount: -15000, description: "Premium test sotib olish", date: "2023-06-03" },
    { id: 3, type: "Chiqim", amount: -5000, description: "Qo'shimcha materiallar", date: "2023-06-07" },
    { id: 4, type: "Kirim", amount: 10000, description: "Do'stni taklif qilish bonusi", date: "2023-06-09" },
  ]

  const personalInfo = {
    fullName: "Alisher Karimov",
    birthDate: "2005-03-15",
    phone: "+998 90 123 45 67",
    email: "alisher@example.com",
    address: "Toshkent sh., Chilonzor tumani",
    school: "5-son maktab",
    grade: "11-sinf",
    targetUniversity: "Toshkent Axborot Texnologiyalari Universiteti",
    targetFaculty: "Dasturiy injiniring",
  }

  const handleStartTest = (testId: number) => {
    router.push(`/tests/${testId}`)
  }

  const handleViewTest = (testId: number) => {
    router.push(`/tests/results/${testId}`)
  }

  const handleDownloadMaterial = (materialId: number) => {
    // In a real app, this would download the file
    alert(`Material ${materialId} yuklab olinmoqda...`)
  }

  const handleAddFunds = (amount: number) => {
    router.push(`/payments/add?amount=${amount}`)
  }

  const handleEditProfile = () => {
    router.push("/profile/edit")
  }

  const handleCreateSchedule = () => {
    router.push("/schedule/create")
  }

  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-5 mb-6">
        <TabsTrigger value="overview">Umumiy</TabsTrigger>
        <TabsTrigger value="tests">Testlar</TabsTrigger>
        <TabsTrigger value="materials">Materiallar</TabsTrigger>
        <TabsTrigger value="payments">To'lovlar</TabsTrigger>
        <TabsTrigger value="settings">Sozlamalar</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <History className="mr-2 h-5 w-5 text-blue-500" />
                So'nggi faoliyat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTests.map((test) => (
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
                  </div>
                ))}
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
                {recommendedTests.map((test) => (
                  <Card key={test.id} className="border">
                    <CardContent className="p-4">
                      <Badge variant="outline" className="mb-2">
                        {test.subject}
                      </Badge>
                      <h3 className="font-medium mb-1">{test.title}</h3>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">Qiyinlik: {test.difficulty}</div>
                        <Button size="sm" variant="ghost" onClick={() => handleStartTest(test.id)}>
                          Boshlash
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-indigo-500" />
                O'qish jadvali
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-gray-500">Bu yerda sizning shaxsiy o'qish jadvalingiz bo'ladi</p>
                <Button className="mt-4" variant="outline" onClick={handleCreateSchedule}>
                  Jadval yaratish
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="tests">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              Mening testlarim
            </CardTitle>
            <CardDescription>Siz ishtirok etgan barcha testlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => router.push("/tests/all")}>
                    Barchasi
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push("/tests/completed")}>
                    Tugatilgan
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push("/tests/incomplete")}>
                    Tugatilmagan
                  </Button>
                </div>
                <div>
                  <Button variant="outline" size="sm" onClick={() => router.push("/tests/report")}>
                    <Download className="mr-2 h-4 w-4" />
                    Hisobot
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-medium">Test nomi</th>
                        <th className="text-left p-3 font-medium">Fan</th>
                        <th className="text-left p-3 font-medium">Sana</th>
                        <th className="text-left p-3 font-medium">Ball</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...recentTests, ...recentTests].map((test, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3">{test.title}</td>
                          <td className="p-3">{test.subject}</td>
                          <td className="p-3">{new Date(test.date).toLocaleDateString("uz-UZ")}</td>
                          <td className="p-3 font-medium">
                            {test.score}/{test.maxScore}
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" /> Tugatilgan
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm" onClick={() => handleViewTest(test.id)}>
                              Ko'rish
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="materials">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
              O'quv materiallari
            </CardTitle>
            <CardDescription>Sizga tavsiya etilgan va yuklab olingan materiallar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => router.push("/materials/all")}>
                    Barchasi
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push("/materials/books")}>
                    Kitoblar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push("/materials/videos")}>
                    Video darslar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push("/materials/guides")}>
                    Qo'llanmalar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center mr-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-1">
                          Matematika
                        </Badge>
                        <h3 className="font-medium">Algebra va matematik analiz asoslari</h3>
                        <div className="text-sm text-gray-500 mt-1">PDF, 245 bet</div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-sm text-gray-500">Yuklab olingan: 10.06.2023</div>
                          <Button size="sm" variant="ghost" onClick={() => handleDownloadMaterial(1)}>
                            <Download className="h-4 w-4 mr-1" /> Yuklab olish
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center mr-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-1">
                          Fizika
                        </Badge>
                        <h3 className="font-medium">Mexanika bo'yicha masalalar to'plami</h3>
                        <div className="text-sm text-gray-500 mt-1">PDF, 120 bet</div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-sm text-gray-500">Yuklab olingan: 05.06.2023</div>
                          <Button size="sm" variant="ghost" onClick={() => handleDownloadMaterial(2)}>
                            <Download className="h-4 w-4 mr-1" /> Yuklab olish
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center mr-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-1">
                          Ingliz tili
                        </Badge>
                        <h3 className="font-medium">Grammar in Use - Intermediate</h3>
                        <div className="text-sm text-gray-500 mt-1">PDF, 180 bet</div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-sm text-gray-500">Yuklab olingan: 01.06.2023</div>
                          <Button size="sm" variant="ghost" onClick={() => handleDownloadMaterial(3)}>
                            <Download className="h-4 w-4 mr-1" /> Yuklab olish
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center mr-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-1">
                          Tarix
                        </Badge>
                        <h3 className="font-medium">O'zbekiston tarixi - Test to'plami</h3>
                        <div className="text-sm text-gray-500 mt-1">PDF, 95 bet</div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-sm text-gray-500">Yuklab olingan: 28.05.2023</div>
                          <Button size="sm" variant="ghost" onClick={() => handleDownloadMaterial(4)}>
                            <Download className="h-4 w-4 mr-1" /> Yuklab olish
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payments">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-blue-500" />
              To'lovlar tarixi
            </CardTitle>
            <CardDescription>Hisobingiz bo'yicha barcha operatsiyalar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => router.push("/payments/all")}>
                    Barchasi
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push("/payments/income")}>
                    Kirim
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push("/payments/expense")}>
                    Chiqim
                  </Button>
                </div>
                <div>
                  <Button variant="outline" size="sm" onClick={() => router.push("/payments/report")}>
                    <Download className="mr-2 h-4 w-4" />
                    Hisobot
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-medium">Sana</th>
                        <th className="text-left p-3 font-medium">Tavsif</th>
                        <th className="text-left p-3 font-medium">Tur</th>
                        <th className="text-right p-3 font-medium">Summa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3">{new Date(transaction.date).toLocaleDateString("uz-UZ")}</td>
                          <td className="p-3">{transaction.description}</td>
                          <td className="p-3">
                            <Badge
                              variant={transaction.type === "Kirim" ? "outline" : "secondary"}
                              className={
                                transaction.type === "Kirim"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {transaction.type}
                            </Badge>
                          </td>
                          <td
                            className={`p-3 text-right font-medium ${
                              transaction.amount > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.amount > 0 ? "+" : ""}
                            {transaction.amount.toLocaleString()} so'm
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Hisobni to'ldirish</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-4 flex flex-col" onClick={() => handleAddFunds(10000)}>
                    <span className="text-lg font-bold">10,000</span>
                    <span className="text-sm text-gray-500">so'm</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col" onClick={() => handleAddFunds(50000)}>
                    <span className="text-lg font-bold">50,000</span>
                    <span className="text-sm text-gray-500">so'm</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col"
                    onClick={() => handleAddFunds(100000)}
                  >
                    <span className="text-lg font-bold">100,000</span>
                    <span className="text-sm text-gray-500">so'm</span>
                  </Button>
                </div>
                <Button className="w-full mt-4" onClick={() => router.push("/payments/add")}>
                  To'ldirish
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5 text-blue-500" />
              Shaxsiy ma'lumotlar
            </CardTitle>
            <CardDescription>Sizning shaxsiy ma'lumotlaringiz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">To'liq ism</h3>
                    <p>{personalInfo.fullName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Tug'ilgan sana</h3>
                    <p>{new Date(personalInfo.birthDate).toLocaleDateString("uz-UZ")}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Telefon raqam</h3>
                    <p>{personalInfo.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                    <p>{personalInfo.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Manzil</h3>
                    <p>{personalInfo.address}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Maktab</h3>
                    <p>{personalInfo.school}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Sinf</h3>
                    <p>{personalInfo.grade}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Maqsad universitet</h3>
                    <p>{personalInfo.targetUniversity}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Maqsad fakultet</h3>
                    <p>{personalInfo.targetFaculty}</p>
                  </div>
                </div>
              </div>

              <Button onClick={handleEditProfile}>Ma'lumotlarni tahrirlash</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-blue-500" />
              Statistika sozlamalari
            </CardTitle>
            <CardDescription>Statistika va tahlil sozlamalari</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Haftalik hisobotlar</h3>
                  <p className="text-sm text-gray-500">Har hafta o'qish statistikasi bo'yicha hisobot olish</p>
                </div>
                <div>
                  <Button variant="outline" onClick={() => router.push("/settings/reports")}>
                    Yoqish
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">O'qish eslatmalari</h3>
                  <p className="text-sm text-gray-500">Muntazam o'qish uchun eslatmalar olish</p>
                </div>
                <div>
                  <Button variant="outline" onClick={() => router.push("/settings/reminders")}>
                    Yoqish
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Tavsiyalar</h3>
                  <p className="text-sm text-gray-500">Shaxsiy tavsiyalarni olish</p>
                </div>
                <div>
                  <Button variant="outline" onClick={() => router.push("/settings/recommendations")}>
                    Yoqilgan
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

