"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bell, BookOpen, CheckCircle, Clock, FileText, Settings, Wallet } from "lucide-react"

export default function NotificationsPage() {
  const router = useRouter()

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "Yangi test qo'shildi",
      message: "Matematika fanidan yangi test qo'shildi. Hoziroq sinab ko'ring!",
      date: "2023-06-10T10:30:00",
      type: "test",
      isRead: false,
    },
    {
      id: 2,
      title: "To'lov muvaffaqiyatli amalga oshirildi",
      message: "Hisobingiz 50,000 so'mga to'ldirildi.",
      date: "2023-06-09T15:45:00",
      type: "payment",
      isRead: true,
    },
    {
      id: 3,
      title: "Test natijasi",
      message: "Fizika testidan 85% natija ko'rsatdingiz. Tabriklaymiz!",
      date: "2023-06-08T09:15:00",
      type: "result",
      isRead: true,
    },
    {
      id: 4,
      title: "Yangi material qo'shildi",
      message: "Ingliz tili fanidan yangi o'quv materiallari qo'shildi.",
      date: "2023-06-07T14:20:00",
      type: "material",
      isRead: false,
    },
    {
      id: 5,
      title: "O'qish eslatmasi",
      message: "Bugun matematika fanidan tayyorlanishni unutmang!",
      date: "2023-06-06T08:00:00",
      type: "reminder",
      isRead: true,
    },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "test":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "payment":
        return <Wallet className="h-5 w-5 text-green-500" />
      case "result":
        return <CheckCircle className="h-5 w-5 text-purple-500" />
      case "material":
        return <BookOpen className="h-5 w-5 text-amber-500" />
      case "reminder":
        return <Clock className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("uz-UZ", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="outline" className="mr-4" onClick={() => router.push("/profile")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Orqaga
            </Button>
            <h1 className="text-2xl font-bold">Bildirishnomalar</h1>
          </div>
          <Button variant="outline" onClick={() => router.push("/notifications/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Sozlamalar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Barcha bildirishnomalar</CardTitle>
            <CardDescription>Sizning so'nggi bildirishnomalaringiz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 ${notification.isRead ? "bg-white" : "bg-blue-50 border-blue-200"}`}
                >
                  <div className="flex">
                    <div className="mr-4 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{notification.title}</h3>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        {!notification.isRead && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Yangi
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">{formatDate(notification.date)}</div>
                    </div>
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

