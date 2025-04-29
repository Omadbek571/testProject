"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart2, FileText, Save, Users } from "lucide-react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"

export default function TestDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [testId, setTestId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")
  const [testCard, setTestCard] = useState([])
  const [statisticUser, setStatsticUser] = useState([])

  useEffect(() => {
    if (params?.id) {
      setTestId(params.id)
    }
  }, [params])

  // Test malumotlarini olish
  useEffect(() => {
    if (!testId) return

    axios
      .get(`https://testonline.pythonanywhere.com/api/admin/tests/${Number(testId)}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setTestCard(res.data)
      })
      .catch((err) => {
       console.log(err);
       
      })
  }, [testId])

  // Test statistic malumotlarini olish
  useEffect(() => {
    if (!testId) return

    axios
      .get(`https://testonline.pythonanywhere.com/api/admin/tests/${Number(testId)}/statistics/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setStatsticUser(res.data)
      })
      .catch((err) => {
        console.log(err);
        
      })
  }, [testId]) // testId o'zgarganda faqat ishlaydi

    // Test statistic malumotlarini olish  shu qismi qolib ketga
    useEffect(() => {
      if (!testId) return
  
      axios
        .get(`https://testonline.pythonanywhere.com/api/admin/tests/${Number(testId)}/participants/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log(84, res);
          
        })
        .catch((err) => {
          console.log(err);
          
        })
    }, [testId])
  

  // Mock test data
  const testData = {
    id: testId,
    title: testCard.title,
    subject: testCard.subject_name,
    type: testCard.type_display,
    questionsCount: testCard.question_count,
    timeLimit: testCard.time_limit,
    difficulty: testCard.difficulty_display,
    price: testCard.price,
    reward: testCard.reward_points,
    createdDate: testCard.created_at,
    status: testCard.status,
    description: testCard.description,
    completions: statisticUser.participants_count,
    averageScore: statisticUser.average_score,
  }

  // Mock questions data
  const questionsData = Array.from({ length: 2 }).map((_, index) => ({
    id: 1000 + index,
    text: `Savol ${index + 1}: ${index % 2 === 0 ? "Agar x^2 + 3x + 2 = 0 bo'lsa, x ning qiymati nima?" : "Agar y = 2x + 3 va x = 4 bo'lsa, y ning qiymati nima?"}`,
    options: [
      { id: "A", text: "Variant A" },
      { id: "B", text: "Variant B" },
      { id: "C", text: "Variant C" },
      { id: "D", text: "Variant D" },
    ],
    correctAnswer: ["A", "B", "C", "D"][index % 4],
    difficulty: ["Oson", "O'rta", "Qiyin"][index % 3],
  }))

  // Mock users data
  const usersData = Array.from({ length: 2 }).map((_, index) => ({
    id: 2000 + index,
    name: `Foydalanuvchi ${index + 1}`,
    date: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
    score: Math.floor(Math.random() * 30) + 70,
    maxScore: 100,
    time: Math.floor(Math.random() * 30) + 30,
  }))

  const handleSaveChanges = () => {
    alert("O'zgarishlar saqlandi")
  }

  const handleDeleteTest = () => {
    if (confirm("Haqiqatan ham bu testni o'chirmoqchimisiz?")) {
      alert("Test o'chirildi")
      router.push("/admin/tests")
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="outline" className="mr-4" onClick={() => router.push("/admin/tests")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Orqaga
            </Button>
            <div>
              <h2 className="text-2xl font-bold mb-1">Test ma'lumotlari</h2>
              <p className="text-gray-600">ID: {testId}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => router.push(`/admin/tests/edit/${testId}`)}>
              Tahrirlash
            </Button>
            <Button variant="destructive" onClick={handleDeleteTest}>
              O'chirish
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="details">Tafsilotlar</TabsTrigger>
            <TabsTrigger value="questions">Savollar</TabsTrigger>
            <TabsTrigger value="users">Foydalanuvchilar</TabsTrigger>
            <TabsTrigger value="statistics">Statistika</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-500" />
                      Test ma'lumotlari
                    </CardTitle>
                    <CardDescription>Test haqida asosiy ma'lumotlar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Test nomi</Label>
                          <Input id="title" defaultValue={testData.title} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Fan</Label>
                          <Select defaultValue={testData.subject}>
                            <SelectTrigger id="subject">
                              <SelectValue placeholder="Fan tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Matematika">Matematika</SelectItem>
                              <SelectItem value="Fizika">Fizika</SelectItem>
                              <SelectItem value="Kimyo">Kimyo</SelectItem>
                              <SelectItem value="Biologiya">Biologiya</SelectItem>
                              <SelectItem value="Ingliz tili">Ingliz tili</SelectItem>
                              <SelectItem value="Ona tili">Ona tili</SelectItem>
                              <SelectItem value="Tarix">Tarix</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">Tur</Label>
                          <Select defaultValue={testData.type}>
                            <SelectTrigger id="type">
                              <SelectValue placeholder="Tur tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Free">Bepul</SelectItem>
                              <SelectItem value="Premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="difficulty">Qiyinlik</Label>
                          <Select defaultValue={testData.difficulty}>
                            <SelectTrigger id="difficulty">
                              <SelectValue placeholder="Qiyinlik tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Oson">Oson</SelectItem>
                              <SelectItem value="O'rta">O'rta</SelectItem>
                              <SelectItem value="Qiyin">Qiyin</SelectItem>
                              <SelectItem value="Murakkab">Murakkab</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="questions-count">Savollar soni</Label>
                          <Input id="questions-count" type="number" defaultValue={testData.questionsCount} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time-limit">Vaqt chegarasi (daqiqa)</Label>
                          <Input id="time-limit" type="number" defaultValue={testData.timeLimit} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Narxi (so'm)</Label>
                          <Input id="price" type="number" defaultValue={testData.price} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reward">Mukofot (so'm)</Label>
                          <Input id="reward" type="number" defaultValue={testData.reward} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Tavsif</Label>
                        <Textarea id="description" defaultValue={testData.description} rows={4} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="active-status">Faol holati</Label>
                          <div className="text-sm text-gray-500">Test faol holatini o'zgartirish</div>
                        </div>
                        <Switch id="active-status" defaultChecked={testData.status === "Faol"} />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSaveChanges}>
                      <Save className="mr-2 h-4 w-4" />
                      Saqlash
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-500" />
                      Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Test nomi</h3>
                        <p className="font-medium">{testData.title}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Fan</h3>
                        <p>{testData.subject}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Tur</h3>
                        <Badge
                          className={
                            testData.type === "Premium" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
                          }
                        >
                          {testData.type}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                        <Badge
                          className={
                            testData.status === "Faol" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }
                        >
                          {testData.status}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Yaratilgan sana</h3>
                        <p>{new Date(testData.createdDate).toLocaleDateString("uz-UZ")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-blue-500" />
                      Ishtirokchilar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">{testData.completions}</div>
                      <p className="text-sm text-gray-500 mb-4">Ishtirokchilar soni</p>
                      <Button className="w-full" onClick={() => setActiveTab("users")}>
                        Batafsil ko'rish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-500" />
                  Test savollari
                </CardTitle>
                <CardDescription>Test savollari ro'yxati</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Jami savollar: {questionsData.length}</h3>
                    <Button onClick={() => router.push(`/admin/tests/questions/add/${testId}`)}>Savol qo'shish</Button>
                  </div>

                  <div className="space-y-4">
                    {questionsData.map((question, index) => (
                      <Card key={question.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <Badge variant="outline" className="mr-2">
                                  Savol {index + 1}
                                </Badge>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {question.difficulty}
                                </Badge>
                              </div>
                              <p className="mb-4">{question.text}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {question.options.map((option) => (
                                  <div
                                    key={option.id}
                                    className={`p-2 border rounded-md ${
                                      option.id === question.correctAnswer
                                        ? "bg-green-50 border-green-200"
                                        : "bg-gray-50"
                                    }`}
                                  >
                                    <span className="font-medium mr-2">{option.id}:</span>
                                    {option.text}
                                    {option.id === question.correctAnswer && (
                                      <Badge className="ml-2 bg-green-100 text-green-800">To'g'ri javob</Badge>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="ml-4 flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/admin/tests/questions/edit/${question.id}`)}
                              >
                                Tahrirlash
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => alert(`Savol ${question.id} o'chirildi`)}
                              >
                                O'chirish
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-500" />
                  Test ishtirokchilari
                </CardTitle>
                <CardDescription>Testni topshirgan foydalanuvchilar ro'yxati</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">ID</th>
                          <th className="text-left p-3 font-medium">Foydalanuvchi</th>
                          <th className="text-left p-3 font-medium">Sana</th>
                          <th className="text-left p-3 font-medium">Ball</th>
                          <th className="text-left p-3 font-medium">Vaqt (daqiqa)</th>
                          <th className="text-left p-3 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersData.map((user) => (
                          <tr key={user.id} className="border-t">
                            <td className="p-3">#{user.id}</td>
                            <td className="p-3">{user.name}</td>
                            <td className="p-3">{new Date(user.date).toLocaleDateString("uz-UZ")}</td>
                            <td className="p-3 font-medium">
                              {user.score}/{user.maxScore}
                            </td>
                            <td className="p-3">{user.time}</td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/users/${user.id}`)}>
                                Ko'rish
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-blue-500" />
                  Test statistikasi
                </CardTitle>
                <CardDescription>Test bo'yicha statistik ma'lumotlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">Ishtirokchilar</div>
                      <div className="text-2xl font-bold">{testData.completions}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">O'rtacha ball</div>
                      <div className="text-2xl font-bold">{testData.averageScore}%</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">Jami daromad</div>
                      <div className="text-2xl font-bold">
                        {(testData.price * testData.completions).toLocaleString()} so'm
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center p-10 border rounded-lg">
                  <p className="text-gray-500">Bu yerda test statistikasi grafiklari bo'ladi</p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => router.push(`/admin/statistics/tests/${testId}`)}
                  >
                    Batafsil statistika
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

