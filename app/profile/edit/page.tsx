"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, User } from "lucide-react"
import { motion } from "framer-motion"

export default function ProfileEditPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Mock user data
  const userData = {
    fullName: "Alisher Karimov",
    birthDate: "2005-03-15",
    phone: "+998 90 123 45 67",
    email: "alisher@example.com",
    address: "Toshkent sh., Chilonzor tumani",
    school: "5-son maktab",
    grade: "11-sinf",
    targetUniversity: "Toshkent Axborot Texnologiyalari Universiteti",
    targetFaculty: "Dasturiy injiniring",
    bio: "Men abituriyentman va dasturlashga qiziqaman. Kelajakda dasturiy ta'minot muhandisi bo'lishni xohlayman.",
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
        router.push("/profile")
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
              <CardTitle className="text-center text-green-600">Ma'lumotlar muvaffaqiyatli saqlandi</CardTitle>
              <CardDescription className="text-center">Profil ma'lumotlaringiz yangilandi</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-green-600" />
              </div>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
                className="h-2 bg-green-500 rounded-full mb-4"
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push("/profile")}>
                Profilga qaytish
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/profile")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <h1 className="text-2xl font-bold">Profil ma'lumotlarini tahrirlash</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
            <CardDescription>Profil ma'lumotlaringizni tahrirlang</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-12 w-12 text-blue-600" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                      type="button"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">To'liq ism</Label>
                    <Input id="fullName" defaultValue={userData.fullName} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Tug'ilgan sana</Label>
                    <Input id="birthDate" type="date" defaultValue={userData.birthDate} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon raqam</Label>
                    <Input id="phone" defaultValue={userData.phone} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={userData.email} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Manzil</Label>
                    <Input id="address" defaultValue={userData.address} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school">Maktab</Label>
                    <Input id="school" defaultValue={userData.school} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Sinf</Label>
                    <Select defaultValue={userData.grade}>
                      <SelectTrigger id="grade">
                        <SelectValue placeholder="Sinfni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9-sinf">9-sinf</SelectItem>
                        <SelectItem value="10-sinf">10-sinf</SelectItem>
                        <SelectItem value="11-sinf">11-sinf</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetUniversity">Maqsad universitet</Label>
                    <Input id="targetUniversity" defaultValue={userData.targetUniversity} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="targetFaculty">Maqsad fakultet</Label>
                    <Input id="targetFaculty" defaultValue={userData.targetFaculty} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">O'zingiz haqingizda</Label>
                    <Textarea id="bio" defaultValue={userData.bio} rows={4} />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" type="button" onClick={() => router.push("/profile")}>
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

