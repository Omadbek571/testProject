"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Clock, Edit, Plus } from "lucide-react"

export default function SchedulePage() {
  const router = useRouter()

  // Mock schedule data
  const schedule = {
    monday: [
      { id: 1, subject: "Matematika", startTime: "09:00", endTime: "10:30", type: "Dars" },
      { id: 2, subject: "Fizika", startTime: "11:00", endTime: "12:30", type: "Dars" },
      { id: 3, subject: "Ingliz tili", startTime: "14:00", endTime: "15:30", type: "Dars" },
    ],
    tuesday: [
      { id: 4, subject: "Tarix", startTime: "09:00", endTime: "10:30", type: "Dars" },
      { id: 5, subject: "Ona tili", startTime: "11:00", endTime: "12:30", type: "Dars" },
      { id: 6, subject: "Matematika", startTime: "14:00", endTime: "15:30", type: "Amaliy mashg'ulot" },
    ],
    wednesday: [
      { id: 7, subject: "Fizika", startTime: "09:00", endTime: "10:30", type: "Amaliy mashg'ulot" },
      { id: 8, subject: "Ingliz tili", startTime: "11:00", endTime: "12:30", type: "Dars" },
      { id: 9, subject: "Matematika", startTime: "14:00", endTime: "15:30", type: "Dars" },
    ],
    thursday: [
      { id: 10, subject: "Ona tili", startTime: "09:00", endTime: "10:30", type: "Dars" },
      { id: 11, subject: "Tarix", startTime: "11:00", endTime: "12:30", type: "Dars" },
      { id: 12, subject: "Ingliz tili", startTime: "14:00", endTime: "15:30", type: "Amaliy mashg'ulot" },
    ],
    friday: [
      { id: 13, subject: "Matematika", startTime: "09:00", endTime: "10:30", type: "Dars" },
      { id: 14, subject: "Fizika", startTime: "11:00", endTime: "12:30", type: "Dars" },
    ],
    saturday: [{ id: 15, subject: "Matematika", startTime: "10:00", endTime: "11:30", type: "Qo'shimcha dars" }],
    sunday: [],
  }

  const getSubjectColor = (subject: string) => {
    const colors = {
      Matematika: "bg-blue-100 text-blue-800",
      Fizika: "bg-purple-100 text-purple-800",
      "Ingliz tili": "bg-green-100 text-green-800",
      Tarix: "bg-amber-100 text-amber-800",
      "Ona tili": "bg-red-100 text-red-800",
    }
    return colors[subject as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getTypeColor = (type: string) => {
    const colors = {
      Dars: "bg-blue-50 text-blue-700 border-blue-200",
      "Amaliy mashg'ulot": "bg-green-50 text-green-700 border-green-200",
      "Qo'shimcha dars": "bg-amber-50 text-amber-700 border-amber-200",
    }
    return colors[type as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  const getDayName = (day: string) => {
    const days = {
      monday: "Dushanba",
      tuesday: "Seshanba",
      wednesday: "Chorshanba",
      thursday: "Payshanba",
      friday: "Juma",
      saturday: "Shanba",
      sunday: "Yakshanba",
    }
    return days[day as keyof typeof days]
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="outline" className="mr-4" onClick={() => router.push("/profile")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Orqaga
            </Button>
            <h1 className="text-2xl font-bold">O'qish jadvali</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/schedule/create")}>
              <Edit className="mr-2 h-4 w-4" />
              Tahrirlash
            </Button>
            <Button onClick={() => router.push("/schedule/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Yangi jadval
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Haftalik jadval
            </CardTitle>
            <CardDescription>Sizning haftalik o'qish jadvalingiz</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monday">
              <TabsList className="grid w-full grid-cols-7 mb-6">
                <TabsTrigger value="monday">Du</TabsTrigger>
                <TabsTrigger value="tuesday">Se</TabsTrigger>
                <TabsTrigger value="wednesday">Cho</TabsTrigger>
                <TabsTrigger value="thursday">Pa</TabsTrigger>
                <TabsTrigger value="friday">Ju</TabsTrigger>
                <TabsTrigger value="saturday">Sha</TabsTrigger>
                <TabsTrigger value="sunday">Ya</TabsTrigger>
              </TabsList>

              {Object.entries(schedule).map(([day, lessons]) => (
                <TabsContent key={day} value={day}>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{getDayName(day)}</h3>

                    {lessons.length > 0 ? (
                      lessons.map((lesson) => (
                        <div key={lesson.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getSubjectColor(lesson.subject)}`}
                              >
                                <Clock className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-medium">{lesson.subject}</h4>
                                <div className="text-sm text-gray-500">
                                  {lesson.startTime} - {lesson.endTime}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className={getTypeColor(lesson.type)}>
                              {lesson.type}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-6 border border-dashed rounded-lg">
                        <p className="text-gray-500">Bu kun uchun darslar yo'q</p>
                        <Button variant="outline" className="mt-2" onClick={() => router.push("/schedule/create")}>
                          <Plus className="mr-2 h-4 w-4" />
                          Dars qo'shish
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bugungi jadval</CardTitle>
            <CardDescription>Bugungi kungi darslar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedule.monday.map((lesson) => (
                <div key={lesson.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getSubjectColor(lesson.subject)}`}
                      >
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{lesson.subject}</h4>
                        <div className="text-sm text-gray-500">
                          {lesson.startTime} - {lesson.endTime}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={getTypeColor(lesson.type)}>
                      {lesson.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

