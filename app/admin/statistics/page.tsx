"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminLayout } from "@/components/admin/admin-layout"
import { BarChart, LineChart, PieChart } from "lucide-react"
import axios from "axios"

export default function StatisticsPage() {
  const [period, setPeriod] = useState("month");
  const [statisticPage, setStatisticPage] = useState({});
  const [downStatistic, setDownStatistic] = useState({});
  const [loading, setLoading] = useState(true); // Loading holatini qo‘shdik
  const [token, setToken] = useState<string | null>(null); // Token uchun state

  // Tokenni olish
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  // Tepa qismidagi statistika
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    axios
      .get(`https://testonline.pythonanywhere.com/api/admin/dashboard/stats/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStatisticPage(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [token]);

  // Pastki qismidagi statistika (period ga qarab yangilanadi)
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    axios
      .get(`https://testonline.pythonanywhere.com/api/admin/statistics/?period=${period}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDownStatistic(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [period, token]); // period o‘zgarganda so‘rov qayta yuboriladi

  // usersStatistic ni xavfsiz aniqlash
  const usersStatistic = {
    totalUsers: statisticPage?.total_users?.value ?? 0,
    activeStudents: statisticPage?.active_students?.value ?? 0,
    totalTests: statisticPage?.total_tests_taken?.value ?? 0,
    totalRevenue: statisticPage?.total_revenue?.value ?? 0,
    activeStudentsTarget: statisticPage?.active_students?.target ?? 0,
    totalUsersTarget: statisticPage?.total_users?.target ?? 0,
    totalRevenueTarget: statisticPage?.total_revenue?.target ?? 0,
  };

  // downStatisticObj ni xavfsiz aniqlash
  const downStatisticObj = {
    newUser: downStatistic?.users?.new_users?.value ?? 0,
    activeUsers: downStatistic?.users?.active_users?.value ?? 0,
    averageActivity: downStatistic?.users?.average_activity?.value ?? "0%",
    totalTests: downStatistic?.tests?.total_tests?.value ?? 0,
    totalSolvedTests: downStatistic?.tests?.tests_taken?.value ?? 0,
    averageScore: downStatistic?.tests?.average_score?.value ?? 0,
    paymentsTotal: downStatistic?.payments?.total_expenses?.value ?? 0,
    totalIncome: downStatistic?.payments?.total_income?.value ?? 0,
    averagePayment: downStatistic?.payments?.average_payment?.value ?? 0,
    completions: downStatistic?.courses?.completions?.value ?? 0,
    enrollments: downStatistic?.courses?.enrollments?.value ?? 0,
    totalCourses: downStatistic?.courses?.total_courses?.value ?? 0,
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Statistika</h2>
            <p className="text-gray-600">Platforma statistikasi va analitikasi</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Davr" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Hafta</SelectItem>
                <SelectItem value="month">Oy</SelectItem>
                <SelectItem value="quarter">Chorak</SelectItem>
                <SelectItem value="year">Yil</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Hisobotni yuklab olish</Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center p-6">
            <p className="text-gray-500">Yuklanmoqda...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Jami foydalanuvchilar</p>
                      <h3 className="text-3xl font-bold">{usersStatistic.totalUsers}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <LineChart className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full w-3/4"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-green-600">+0% o'sish</span>
                      <span className="text-gray-500">Maqsad: {usersStatistic.totalUsersTarget}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Faol abituriyentlar</p>
                      <h3 className="text-3xl font-bold">{usersStatistic.activeStudents}</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <BarChart className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full w-1/2"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-green-600">+0% o'sish</span>
                      <span className="text-gray-500">Maqsad: {usersStatistic.activeStudentsTarget}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Jami daromad</p>
                      <h3 className="text-3xl font-bold">{usersStatistic.totalRevenue.toLocaleString()} so'm</h3>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <PieChart className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-purple-500 rounded-full w-2/3"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-green-600">+0% o'sish</span>
                      <span className="text-gray-500">Maqsad: {usersStatistic.totalRevenueTarget.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="users" className="mb-6">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="users">Foydalanuvchilar</TabsTrigger>
                <TabsTrigger value="tests">Testlar</TabsTrigger>
                <TabsTrigger value="payments">To'lovlar</TabsTrigger>
                <TabsTrigger value="courses">Kurslar</TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>Foydalanuvchilar statistikasi ({period})</CardTitle>
                    <CardDescription>Platformadagi foydalanuvchilar soni va o'sish dinamikasi</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 bg-muted/20 rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Foydalanuvchilar grafigi</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500">Yangi foydalanuvchilar</div>
                          <div className="text-2xl font-bold">+{downStatisticObj.newUser}</div>
                          <div className="text-xs text-green-600">+0% o'tgan davrga nisbatan</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500">Faol foydalanuvchilar</div>
                          <div className="text-2xl font-bold">{downStatisticObj.activeUsers}</div>
                          <div className="text-xs text-green-600">+0% o'tgan davrga nisbatan</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500">O'rtacha faollik</div>
                          <div className="text-2xl font-bold">{downStatisticObj.averageActivity}</div>
                          <div className="text-xs text-green-600">+0% o'tgan davrga nisbatan</div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tests">
                <Card>
                  <CardHeader>
                    <CardTitle>Testlar statistikasi ({period})</CardTitle>
                    <CardDescription>Platformadagi testlar soni va o'sish dinamikasi</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 bg-muted/20 rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Testlar grafigi</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500">Jami testlar</div>
                          <div className="text-2xl font-bold">{downStatisticObj.totalTests}</div>
                          <div className="text-xs text-green-600">+0% o'tgan davrga nisbatan</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500">Yechilgan testlar</div>
                          <div className="text-2xl font-bold">{downStatisticObj.totalSolvedTests}</div>
                          <div className="text-xs text-green-600">+0% o'tgan davrga nisbatan</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500">O'rtacha ball</div>
                          <div className="text-2xl font-bold">{downStatisticObj.averageScore}%</div>
                          <div className="text-xs text-green-600">+0% o'tgan davrga nisbatan</div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments">
                <Card>
                  <CardHeader>
                    <CardTitle>To'lovlar statistikasi ({period})</CardTitle>
                    <CardDescription>Platformadagi to'lovlar soni va o'sish dinamikasi</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 bg-muted/20 rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">To'lovlar grafigi</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500">Jami to'lovlar</div>
                          <div className="text-2xl font-bold">{downStatisticObj.paymentsTotal.toLocaleString()} so'm</div>
                          <div className="text-xs text-green-600">+0% o'tgan davrga nisbatan</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500">Daromad</div>
                          <div className="text-2xl font-bold">{downStatisticObj.totalIncome.toLocaleString()} so'm</div>
                          <div className="text-xs text-green-600">+0% o'tgan davrga nisbatan</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500">O'rtacha to'lov</div>
                          <div className="text-2xl font-bold">{downStatisticObj.averagePayment.toLocaleString()} so'm</div>
                          <div className="text-xs text-green-600">+0% o'tgan davrga nisbatan</div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses">
                <Card>
                  <CardHeader>
                    <CardTitle>Kurslar statistikasi ({period})</CardTitle>
                    <CardDescription>Platformadagi kurslar soni va o'sish dinamikasi</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 bg-muted/20 rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Kurslar grafigi</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500">Jami kurslar</div>
                          <div className="text-2xl font-bold">{downStatisticObj.totalCourses}</div>
                          <div className="text-xs text-green-600">+0 o'tgan davrga nisbatan</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500">Ro'yxatdan o'tganlar</div>
                          <div className="text-2xl font-bold">{downStatisticObj.enrollments}</div>
                          <div className="text-xs text-green-600">+0% o'tgan davrga nisbatan</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500">Tugatganlar</div>
                          <div className="text-2xl font-bold">{downStatisticObj.completions}</div>
                          <div className="text-xs text-green-600">+0% o'tgan davrga nisbatan</div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AdminLayout>
  );
}