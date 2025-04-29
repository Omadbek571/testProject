"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, FileUp, Loader2, Save, X } from "lucide-react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AddMaterialPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [materialData, setMaterialData] = useState({
    title: "",
    description: "",
    subject: "",
    type: "",
    price: "",
    isActive: true,
    files: [],
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setMaterialData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setMaterialData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked) => {
    setMaterialData((prev) => ({ ...prev, isActive: checked }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const fileObjects = files.map((file) => ({
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
    }))

    setMaterialData((prev) => ({
      ...prev,
      files: [...prev.files, ...fileObjects],
    }))
  }

  const removeFile = (id) => {
    setMaterialData((prev) => ({
      ...prev,
      files: prev.files.filter((file) => file.id !== id),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/admin/materials")
    }, 1500)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="outline" className="mr-4" onClick={() => router.push("/admin/materials")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Orqaga
            </Button>
            <div>
              <h2 className="text-2xl font-bold mb-1">Yangi material qo'shish</h2>
              <p className="text-gray-600">Platformaga yangi o'quv materialini qo'shing</p>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saqlanmoqda...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Saqlash
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Material ma'lumotlari</CardTitle>
                <CardDescription>Material haqidagi asosiy ma'lumotlarni kiriting</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="title">Material nomi</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Material nomini kiriting"
                        value={materialData.title}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="description">Tavsif</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Material haqida qisqacha ma'lumot"
                        rows={4}
                        value={materialData.description}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="subject">Fan</Label>
                        <Select
                          value={materialData.subject}
                          onValueChange={(value) => handleSelectChange("subject", value)}
                        >
                          <SelectTrigger id="subject">
                            <SelectValue placeholder="Fanni tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="matematika">Matematika</SelectItem>
                            <SelectItem value="fizika">Fizika</SelectItem>
                            <SelectItem value="kimyo">Kimyo</SelectItem>
                            <SelectItem value="biologiya">Biologiya</SelectItem>
                            <SelectItem value="tarix">Tarix</SelectItem>
                            <SelectItem value="ona_tili">Ona tili</SelectItem>
                            <SelectItem value="ingliz_tili">Ingliz tili</SelectItem>
                            <SelectItem value="boshqa">Boshqa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="type">Material turi</Label>
                        <Select value={materialData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Turni tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kitob">Kitob</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="qollanma">Qo'llanma</SelectItem>
                            <SelectItem value="test_toplami">Test to'plami</SelectItem>
                            <SelectItem value="prezentatsiya">Prezentatsiya</SelectItem>
                            <SelectItem value="boshqa">Boshqa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="price">Narxi (so'm)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          placeholder="0 - bepul material"
                          value={materialData.price}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="isActive" className="mb-2">
                          Status
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Switch id="isActive" checked={materialData.isActive} onCheckedChange={handleSwitchChange} />
                          <Label htmlFor="isActive" className="cursor-pointer">
                            {materialData.isActive ? "Faol" : "Nofaol"}
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Fayllarni yuklash</CardTitle>
                <CardDescription>Material uchun fayllarni yuklang</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <FileUp className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-600">Fayllarni yuklash uchun bosing yoki bu yerga tashlang</p>
                    <p className="text-xs text-gray-500 mb-4">PDF, DOCX, PPTX, MP4, MP3, ZIP (max: 100MB)</p>
                    <Input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
                    <Button variant="outline" onClick={() => document.getElementById("file-upload").click()}>
                      Fayllarni tanlash
                    </Button>
                  </div>

                  {materialData.files.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3">Yuklangan fayllar</h3>
                      <div className="space-y-2">
                        {materialData.files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center">
                              <div className="mr-3 p-2 bg-blue-50 rounded-md">
                                <FileUp className="h-5 w-5 text-blue-500" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Ko'rinishi</CardTitle>
                <CardDescription>Material qanday ko'rinishda bo'ladi</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="desktop" className="mb-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="desktop">Desktop</TabsTrigger>
                    <TabsTrigger value="mobile">Mobile</TabsTrigger>
                  </TabsList>
                  <TabsContent value="desktop" className="mt-4">
                    <div className="border rounded-lg p-4">
                      <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                        <p className="text-sm text-gray-500">Material tasviri</p>
                      </div>
                      <h3 className="font-medium mb-1">{materialData.title || "Material nomi"}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {materialData.description || "Material tavsifi bu yerda ko'rinadi"}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {materialData.subject
                            ? materialData.subject.charAt(0).toUpperCase() + materialData.subject.slice(1)
                            : "Fan"}
                        </span>
                        <span className="font-medium">
                          {materialData.price ? `${materialData.price} so'm` : "Bepul"}
                        </span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="mobile" className="mt-4">
                    <div className="border rounded-lg p-3 max-w-[240px] mx-auto">
                      <div className="aspect-video bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                        <p className="text-xs text-gray-500">Material tasviri</p>
                      </div>
                      <h3 className="font-medium text-sm mb-1">{materialData.title || "Material nomi"}</h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                        {materialData.description || "Material tavsifi"}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {materialData.subject
                            ? materialData.subject.charAt(0).toUpperCase() + materialData.subject.slice(1)
                            : "Fan"}
                        </span>
                        <span className="font-medium">
                          {materialData.price ? `${materialData.price} so'm` : "Bepul"}
                        </span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-4 mt-6">
                  <div>
                    <h3 className="font-medium mb-2">Eslatmalar</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Fayl hajmi 100MB dan oshmasligi kerak</li>
                      <li>• Rasm formati: JPG, PNG</li>
                      <li>• Hujjat formati: PDF, DOCX, PPTX</li>
                      <li>• Video formati: MP4</li>
                      <li>• Audio formati: MP3</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Material statusi</h3>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`h-3 w-3 rounded-full ${materialData.isActive ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <span className="text-sm">
                        {materialData.isActive
                          ? "Faol - foydalanuvchilarga ko'rinadi"
                          : "Nofaol - foydalanuvchilarga ko'rinmaydi"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

