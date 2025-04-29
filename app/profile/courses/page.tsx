"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, Search } from "lucide-react"

// Mock data for enrolled courses
const enrolledCourses = [
  {
    id: 1,
    title: "Matematika asoslari",
    description: "Algebra, geometriya va trigonometriya asoslari",
    instructor: "Aziz Karimov",
    progress: 25,
    lastAccessed: "2023-10-20",
    completedLessons: 2,
    totalLessons: 10,
    image: "/placeholder.svg?height=200&width=300",
    category: "matematika",
  },
  {
    id: 2,
    title: "Fizika kursi",
    description: "Mexanika, elektr va magnit maydonlari",
    instructor: "Dilshod Toshmatov",
    progress: 60,
    lastAccessed: "2023-10-18",
    completedLessons: 6,
    totalLessons: 10,
    image: "/placeholder.svg?height=200&width=300",
    category: "fizika",
  },
  {
    id: 3,
    title: "Ingliz tili grammatikasi",
    description: "Ingliz tili grammatikasi va so'zlashuv",
    instructor: "Nilufar Sobirova",
    progress: 80,
    lastAccessed: "2023-10-15",
    completedLessons: 8,
    totalLessons: 10,
    image: "/placeholder.svg?height=200&width=300",
    category: "tillar",
  },
]

// Mock data for completed courses
const completedCourses = [
  {
    id: 4,
    title: "Biologiya kursi",
    description: "Tirik organizmlar va ularning tuzilishi",
    instructor: "Gulnora Karimova",
    completedDate: "2023-09-15",
    certificate: true,
    image: "/placeholder.svg?height=200&width=300",
    category: "biologiya",
  },
  {
    id: 5,
    title: "Tarix kursi",
    description: "Jahon va O'zbekiston tarixi",
    instructor: "Bobur Alimov",
    completedDate: "2023-08-20",
    certificate: true,
    image: "/placeholder.svg?height=200&width=300",
    category: "tarix",
  },
]

export default function ProfileCoursesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter courses based on search query
  const filteredEnrolledCourses = enrolledCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredCompletedCourses = completedCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mening kurslarim</h1>
          <p className="text-muted-foreground mt-1">O'qiyotgan va yakunlagan kurslaringiz</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Kurslarni qidirish..."
              className="w-full md:w-[300px] pl-8 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => router.push("/courses")}>Yangi kurslar</Button>
        </div>
      </div>

      <Tabs defaultValue="enrolled" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="enrolled">O'qiyotgan kurslar</TabsTrigger>
          <TabsTrigger value="completed">Yakunlangan kurslar</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled">
          {filteredEnrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEnrolledCourses.map((course) => (
                <EnrolledCourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Kurslar topilmadi</h2>
              <p className="text-muted-foreground mb-6">
                Siz hali birorta kursga yozilmagansiz yoki qidiruv bo'yicha kurslar topilmadi
              </p>
              <Button onClick={() => router.push("/courses")}>Kurslarni ko'rish</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {filteredCompletedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompletedCourses.map((course) => (
                <CompletedCourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Yakunlangan kurslar yo'q</h2>
              <p className="text-muted-foreground mb-6">
                Siz hali birorta kursni yakunlamagansiz yoki qidiruv bo'yicha kurslar topilmadi
              </p>
              <Button onClick={() => router.push("/courses")}>Kurslarni ko'rish</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EnrolledCourseCard({ course }) {
  const router = useRouter()

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <Badge variant="outline">{course.category}</Badge>
          <Badge variant="secondary">O'qilmoqda</Badge>
        </div>
        <CardTitle className="text-xl mt-2">
          <Link href={`/courses/${course.id}`} className="hover:underline">
            {course.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-sm text-muted-foreground mb-3">O'qituvchi: {course.instructor}</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {course.completedLessons} / {course.totalLessons} darslar yakunlangan
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5 inline-block mr-1" />
          Oxirgi kirish: {course.lastAccessed}
        </div>
        <Button onClick={() => router.push(`/courses/${course.id}/lessons/${course.completedLessons + 1}`)}>
          Davom ettirish
        </Button>
      </CardFooter>
    </Card>
  )
}

function CompletedCourseCard({ course }) {
  const router = useRouter()

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <Badge variant="outline">{course.category}</Badge>
          <Badge variant="success">Yakunlangan</Badge>
        </div>
        <CardTitle className="text-xl mt-2">
          <Link href={`/courses/${course.id}`} className="hover:underline">
            {course.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-sm text-muted-foreground mb-3">O'qituvchi: {course.instructor}</div>
        <div className="text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-muted-foreground">Yakunlangan sana:</span>
            <span>{course.completedDate}</span>
          </div>
          {course.certificate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sertifikat:</span>
              <span className="text-green-600">Mavjud</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push(`/courses/${course.id}`)}>
          Kursni ko'rish
        </Button>
        {course.certificate && <Button onClick={() => router.push(`/certificates/${course.id}`)}>Sertifikat</Button>}
      </CardFooter>
    </Card>
  )
}

