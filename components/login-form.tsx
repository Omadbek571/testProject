"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff, Info } from "lucide-react"
import axios from "axios"
import Link from "next/link" // react-router-dom o'rniga next/link dan foydalanish

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("shohjaxon2006@gmail.com")
  const [password, setPassword] = useState("20062006")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // inputlardagi malumotlar keldi
    const userData = {
      email: email,
      password: password,
    }

    axios
      .post("https://testonline.pythonanywhere.com/api/auth/login/", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(43,res);

        if (res.status === 200) {
          if (res.data.user.role === "admin") {
            // Admin uchun
            const userr = {
              email: email,
              password: password,
              role: "superadmin",
            }
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("user", JSON.stringify(userr))
            router.push("/admin/dashboard")
          }
          if (res.data.user.role === "student") {
            // Student uchun - role applicant bo'lib saqlansin
            const userr = {
              email: email,
              password: password,
              role: "applicant", // Changed from "superadmin" to "applicant"
            }
            localStorage.setItem("token", res.data.access)
            localStorage.setItem("user", JSON.stringify(userr))
            router.push("/profile")
          }
        }
      })
      .catch((err) => {
        console.log(err);
        
        setError("Login yoki parol notogri")
      })
      .finally(() => {
        setLoading(false)
      })
  }
  function handleRegisterPage() {
    router.push("/register")
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Tizimga kirish</CardTitle>
        <CardDescription>Bilimdon Abituriyent platformasiga kirish uchun ma'lumotlaringizni kiriting</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Kirish</TabsTrigger>
            <TabsTrigger value="demo">Demo ma'lumotlar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Email</Label>
                  <Input
                    id="email"
                    placeholder="Loginni kiriting"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Parol</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Parolni kiriting"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span className="sr-only">{showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}</span>
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Kirish..." : "Kirish"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="demo">
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>Quyidagi demo ma'lumotlar orqali tizimga kirishingiz mumkin</AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">SuperAdmin sifatida kirish</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Login:</div>
                    <div>shohjaxon2006@gmail.com </div>
                    <div className="font-medium">Parol:</div>
                    <div>20062006</div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Abituriyent sifatida kirish</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Login:</div>
                    <div>user2@gmail.com</div>
                    <div className="font-medium">Parol:</div>
                    <div>user2006</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-gray-500">
          Ro'yxatdan o'tmaganmisiz?{" "}
          <Link href="/register" onClick={handleRegisterPage} className="text-primary font-medium">
            Ro'yxatdan o'tish
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

