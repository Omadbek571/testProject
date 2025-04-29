"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Plus, Save, Trash2 } from "lucide-react"
import { motion } from "framer-motion"

export default function ScheduleCreatePage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [scheduleItems, setScheduleItems] = useState([
    { id: 1, day: "monday", subject: "Matematika", startTime: "09:00", endTime: "10:30", type: "lesson" },
    { id: 2, day: "monday", subject: "Fizika", startTime: "11:00", endTime: "12:30", type: "lesson" },
    { id: 3, day: "tuesday", subject: "Ingliz tili", startTime: "09:00", endTime: "10:30", type: "lesson" },
    { id: 4, day: "wednesday", subject: "Matematika", startTime: "15:00", endTime: "16:30", type: "practice" },
    { id: 5, day: "thursday", subject: "Fizika", startTime: "09:00", endTime: "10:30", type: "practice" },
    { id: 6, day: "friday", subject: "Ingliz tili", startTime: "11:00", endTime: "12:30", type: "practice" },
    { id: 7, day: "saturday", subject: "Matematika", startTime: "09:00", endTime: "12:00", type: "test" },
  ])

  const days = [
    { value: "monday", label: "Dushanba" },
    { value: "tuesday", label: "Seshanba" },
    { value: "wednesday", label: "Chorshanba" },
    { value: "thursday", label: "Payshanba" },
    { value: "friday", label: "Juma" },
    { value: "saturday", label: "Shanba" },
    { value: "sunday", label: "Yakshanba" },
  ]

  const subjects = ["Matematika", "Fizika", "Kimyo", "Biologiya", "Ingliz tili", "Ona tili", "Tarix", "Geografiya"]

  const types = [
    { value: "lesson", label: "Dars" },
    { value: "practice", label: "Amaliyot" },
    { value: "test", label: "Test" },
    { value: "self-study", label: "Mustaqil o'qish" },
  ]

  const handleAddItem = () => {
    const newId = scheduleItems.length > 0 ? Math.max(...scheduleItems.map((item) => item.id)) + 1 : 1
    setScheduleItems([
      ...scheduleItems,
      { id: newId, day: "monday", subject: "Matematika", startTime: "09:00", endTime: "10:30", type: "lesson" },
    ])
  }

  const handleRemoveItem = (id: number) => {
    setScheduleItems(scheduleItems.filter((item) => item.id !== id))
  }

  const handleItemChange = (id: number, field: string, value: string) => {
    setScheduleItems(scheduleItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      setIsSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push("/schedule")
      }, 2000)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-green-600">Jadval muvaffaqiyatli saqlandi</CardTitle>
              <CardDescription className="text-center">O'qish jadvalingiz yaratildi</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-10 w-10 text-green-600" />
              </div>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
                className="h-2 bg-green-500 rounded-full mb-4"
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push("/schedule")}>
                Jadvalga qaytish
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/schedule")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <h1 className="text-2xl font-bold">O'qish jadvalini yaratish</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Jadval ma'lumotlari</CardTitle>
            <CardDescription>O'qish jadvalingizni yarating</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="schedule-name">Jadval nomi</Label>
                  <Input id="schedule-name" placeholder="Masalan: Asosiy o'qish jadvali" required />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Jadval elementlari</h3>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                      <Plus className="h-4 w-4 mr-1" /> Qo'shish
                    </Button>
                  </div>

                  {scheduleItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Element #{item.id}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Kun</Label>
                          <Select value={item.day} onValueChange={(value) => handleItemChange(item.id, "day", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Kunni tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                              {days.map((day) => (
                                <SelectItem key={day.value} value={day.value}>
                                  {day.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Fan</Label>
                          <Select
                            value={item.subject}
                            onValueChange={(value) => handleItemChange(item.id, "subject", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Fanni tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Boshlanish vaqti</Label>
                          <Input
                            type="time"
                            value={item.startTime}
                            onChange={(e) => handleItemChange(item.id, "startTime", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tugash vaqti</Label>
                          <Input
                            type="time"
                            value={item.endTime}
                            onChange={(e) => handleItemChange(item.id, "endTime", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Tur</Label>
                          <Select value={item.type} onValueChange={(value) => handleItemChange(item.id, "type", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Turni tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                              {types.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" type="button" onClick={() => router.push("/schedule")}>
                    Bekor qilish
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>Saqlanmoqda...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Saqlash
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

