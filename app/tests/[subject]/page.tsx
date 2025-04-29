import Link from "next/link"
import { ArrowLeft, BookOpen, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for tests
const tests = {
  matematika: [
    { id: 1, title: "Algebra asoslari", questions: 20, time: 30, isPremium: false },
    { id: 2, title: "Geometriya", questions: 15, time: 25, isPremium: false },
    { id: 3, title: "Trigonometriya", questions: 25, time: 40, isPremium: true },
    { id: 4, title: "Matematik analiz", questions: 30, time: 45, isPremium: true },
  ],
  fizika: [
    { id: 1, title: "Mexanika", questions: 20, time: 30, isPremium: false },
    { id: 2, title: "Elektr va magnetizm", questions: 25, time: 35, isPremium: true },
    { id: 3, title: "Optika", questions: 15, time: 25, isPremium: false },
    { id: 4, title: "Kvant fizikasi", questions: 20, time: 30, isPremium: true },
  ],
  kimyo: [
    { id: 1, title: "Organik kimyo", questions: 20, time: 30, isPremium: false },
    { id: 2, title: "Anorganik kimyo", questions: 25, time: 35, isPremium: true },
    { id: 3, title: "Analitik kimyo", questions: 15, time: 25, isPremium: false },
  ],
  biologiya: [
    { id: 1, title: "Botanika", questions: 20, time: 30, isPremium: false },
    { id: 2, title: "Zoologiya", questions: 25, time: 35, isPremium: true },
    { id: 3, title: "Odam anatomiyasi", questions: 15, time: 25, isPremium: false },
  ],
  tarix: [
    { id: 1, title: "O'zbekiston tarixi", questions: 20, time: 30, isPremium: false },
    { id: 2, title: "Jahon tarixi", questions: 25, time: 35, isPremium: true },
  ],
  geografiya: [
    { id: 1, title: "Fizik geografiya", questions: 20, time: 30, isPremium: false },
    { id: 2, title: "Iqtisodiy geografiya", questions: 25, time: 35, isPremium: true },
  ],
  "ingliz-tili": [
    { id: 1, title: "Grammar", questions: 20, time: 30, isPremium: false },
    { id: 2, title: "Vocabulary", questions: 25, time: 35, isPremium: true },
    { id: 3, title: "Reading", questions: 15, time: 25, isPremium: false },
  ],
}

// Subject name mapping
const subjectNames = {
  matematika: "Matematika",
  fizika: "Fizika",
  kimyo: "Kimyo",
  biologiya: "Biologiya",
  tarix: "Tarix",
  geografiya: "Geografiya",
  "ingliz-tili": "Ingliz tili",
}

export default function SubjectTests({ params }: { params: { subject: string } }) {
  const subject = params.subject
  const subjectName = subjectNames[subject as keyof typeof subjectNames] || subject
  const subjectTests = tests[subject as keyof typeof tests] || []

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tests">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{subjectName} testlari</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjectTests.map((test) => (
          <Card key={test.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{test.title}</CardTitle>
                {test.isPremium ? (
                  <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                    <Lock className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">
                    Bepul
                  </Badge>
                )}
              </div>
              <CardDescription>
                {test.questions} ta savol • {test.time} daqiqa
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                Bu test orqali {subjectName.toLowerCase()} fanidan bilimlaringizni sinab ko'ring.
              </p>
            </CardContent>
            <CardFooter>
              {test.isPremium ? (
                <Button asChild className="w-full">
                  <Link href={`/tests/${subject}/premium/${test.id}`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Testni boshlash
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/tests/${subject}/free/${test.id}`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Testni boshlash
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

