"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Download, FileText, Users, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { useEffect, useState } from "react"
import axios from "axios"

export default function AdminDashboard() {
  const router = useRouter();
  const [userCard, setUserCard] = useState([]);
  const [testCard, setTestCard] = useState([]);
  const [statistic, setStatistic] = useState([]);
  const [payments, setPayments] = useState([]);
  const [token, setToken] = useState<string | null>(null); // Token uchun state qo'shamiz


  // Statisticalardi olish uchun
  useEffect(() => {
    if (!token) return;

    axios
      .get("https://testonline.pythonanywhere.com/api/admin/dashboard/stats/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStatistic(res.data)
      })
      .catch((err) => {
        if (err.response.data.detail === 'Given token not valid for any token type') {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/");
        }
        console.log(err);
      });
  }, [token])


  const usersStatistic = {
    totalUsers: {
      value: statistic?.total_users?.value,
      change: statistic?.total_users?.change_percentage,
      target: statistic?.total_users?.target
    },
    activeStudents: {
      value: statistic?.active_students?.value,
      change: statistic?.active_students?.change_percentage,
      target: statistic?.active_students?.target
    },
    totalTests: {
      value: statistic?.total_tests_taken?.value,
      change: statistic?.total_tests_taken?.change_percentage,
      target: statistic?.total_tests_taken?.target
    },
    totalRevenue: {
      value: statistic?.total_revenue?.value,
      change: statistic?.total_revenue?.change_percentage,
      target: statistic?.total_revenue?.target
    }
  }



  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  // Foydalanuvchilar ma'lumotlarini olish
  useEffect(() => {
    if (!token) return;

    axios
      .get("https://testonline.pythonanywhere.com/api/admin/dashboard/latest/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setUserCard(res.data.latest_users);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  // Testlar ma'lumotlarini olish
  useEffect(() => {
    if (!token) return;

    axios
      .get(`https://testonline.pythonanywhere.com/api/admin/tests/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setTestCard(res.data.results)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  // Tolovlardi malumotini olish 
  useEffect(() => {
    if (!token) return;

    axios
      .get(`https://testonline.pythonanywhere.com/api/admin/payments/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPayments(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token])
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Xush kelibsiz, SuperAdmin!</h2>
          <p className="text-gray-600">Bilimdon Abituriyent platformasi boshqaruv paneli</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Jami foydalanuvchilar</p>
                  <h3 className="text-3xl font-bold">{usersStatistic.totalUsers.value || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-green-600 flex items-center">
                <span>+{usersStatistic.totalUsers.change_percentage || 0}% o'sish</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Faol abituriyentlar</p>
                  <h3 className="text-3xl font-bold">{usersStatistic.activeStudents.value || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-green-600 flex items-center">
                <span>+{usersStatistic.activeStudents.change || 0}% o'sish</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Jami testlar</p>
                  <h3 className="text-3xl font-bold">{usersStatistic.totalTests.value || 0}</h3>

                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-green-600 flex items-center">
                <span>+{usersStatistic.totalTests.change || 0}% o'sish</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Jami daromad</p>
                  <h3 className="text-3xl font-bold">{usersStatistic.totalRevenue.value || 0}</h3>

                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-green-600 flex items-center">
                <span>+{usersStatistic.totalRevenue.change || 0}% o'sish</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="mb-6">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="users">Foydalanuvchilar</TabsTrigger>
            <TabsTrigger value="tests">Testlar</TabsTrigger>
            <TabsTrigger value="payments">To'lovlar</TabsTrigger>
            <TabsTrigger value="stats">Statistika</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>So'nggi ro'yxatdan o'tgan foydalanuvchilar</CardTitle>
                <CardDescription>Platformada ro'yxatdan o'tgan eng so'nggi {userCard.length} ta foydalanuvchi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">ID</th>
                          <th className="text-left p-3 font-medium">Ism</th>
                          <th className="text-left p-3 font-medium">Telefon</th>
                          <th className="text-left p-3 font-medium">Ro'yxatdan o'tgan sana</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {userCard?.length > 0 &&
                          userCard.map((value, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-3">#{value?.id}</td>
                              <td className="p-3">{value?.full_name}</td>
                              <td className="p-3">{value?.phone_number}</td>
                              <td className="p-3">
                                {value?.date_joined
                                  ? new Date(value.date_joined).toLocaleDateString("uz-UZ", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                  : "-"}
                              </td>
                              <td className="p-3">
                                <Badge
                                  variant="outline"
                                  className={`border px-2 py-1 text-sm font-medium rounded 
    ${value?.status_display === "Faol"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-red-50 text-red-700 border-red-200"}`}
                                >
                                  {value?.status_display}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/admin/users/${value?.id}`)}
                                >
                                  Ko'rish
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" onClick={() => router.push("/admin/users")}>
                    <Download className="mr-2 h-4 w-4" />
                    Hisobot
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests">
            <Card>
              <CardHeader>
                <CardTitle>So'nggi qo'shilgan testlar</CardTitle>
                <CardDescription>Platformaga qo'shilgan eng so'nggi {testCard.length} ta test</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">ID</th>
                          <th className="text-left p-3 font-medium">Test nomi</th>
                          <th className="text-left p-3 font-medium">Fan</th>
                          <th className="text-left p-3 font-medium">Qo'shilgan sana</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          testCard.length > 0 && testCard.map(function (value, index) {
                            const date = new Date(value.created_at);
                            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

                            return (
                              <tr key={index} className="border-t">
                                <td className="p-3">#{value.id}</td>
                                <td className="p-3">{value.title}</td>
                                <td className="p-3">{value.subject_name}</td>
                                <td className="p-3">{formattedDate}</td>
                                <td className="p-3">
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    {value.status}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push(`/admin/tests/${value.id}`)}
                                  >
                                    Ko'rish
                                  </Button>
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" onClick={() => router.push("/admin/tests")}>
                    <Download className="mr-2 h-4 w-4" />
                    Hisobot
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>So'nggi to'lovlar</CardTitle>
                <CardDescription>Platformada amalga oshirilgan eng so'nggi {payments.length}ta to'lov</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">ID</th>
                          <th className="text-left p-3 font-medium">Foydalanuvchilar</th>
                          <th className="text-left p-3 font-medium">Summa</th>
                          <th className="text-left p-3 font-medium">Sana</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>

                        {
                          payments.length > 0 && payments.map(function (value, index) {
                            return (
                              <tr key={index} className="border-t">
                                <td className="p-3">#{value.id}</td>
                                <td className="p-3">{value.user_email}</td>
                                <td className="p-3">{value.amount_display} </td>
                                <td className="p-3">{value.created_at}</td>
                                <td className="p-3">
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    {value.status_display}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push(`/admin/payments/${value.id}`)}
                                  >
                                    Ko'rish
                                  </Button>
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" onClick={() => router.push("/admin/payments")}>
                    <Download className="mr-2 h-4 w-4" />
                    Hisobot
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Platforma statistikasi</CardTitle>
                <CardDescription>Platformaning umumiy statistikasi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-10">
                  <p className="text-gray-500">Bu yerda platforma statistikasi grafiklari bo'ladi</p>
                  <Button className="mt-4" variant="outline" onClick={() => router.push("/admin/statistics")}>
                    Batafsil statistika
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

