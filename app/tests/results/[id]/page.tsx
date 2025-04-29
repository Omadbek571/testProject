"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, Download, Home, XCircle } from "lucide-react"

export default function TestResultPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = params.id
  const testType = searchParams.get("type") || "free"
  const subject = searchParams.get("subject") || ""
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load test results from localStorage
    const storedResult = localStorage.getItem(`test_result_${testId}`)
    if (storedResult) {
      setTestResult(JSON.parse(storedResult))
    } else {
      // If no results found, create mock data
      const mockResult = {
        testId: testId,
        subject: subject,
        subjectName: getSubjectName(subject),
        testTitle: `${getSubjectName(subject)} - ${testType === "premium" ? "Premium" : "Bepul"} test`,
        totalQuestions: testType === "premium" ? 30 : 20,
        correctAnswers: testType === "premium" ? 22 : 15,
        selectedAnswers: {},
        questions: Array.from({ length: testType === "premium" ? 30 : 20 }).map((_, index) => ({
          id: index,
          text: `${index + 1}-savol: ${getSubjectName(subject)} bo'yicha savol ${index + 1}`,
          options: [
            { id: "A", text: "Javob A" },
            { id: "B", text: "Javob B" },
            { id: "C", text: "Javob C" },
            { id: "D", text: "Javob D" },
          ],
          correctAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
          userAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
        })),
        timeTaken: 1500,
        date: new Date().toISOString(),
        isPremium: testType === "premium",
        price: testType === "premium" ? 20000 : 0,
        reward: testType === "premium" ? 22000 : 0,
      }

      // Add isCorrect property to questions
      mockResult.questions = mockResult.questions.map((q: any, index: number) => ({
        ...q,
        isCorrect: index < mockResult.correctAnswers,
        userAnswer: index < mockResult.correctAnswers ? q.correctAnswer : q.correctAnswer === "A" ? "B" : "A",
      }))

      setTestResult(mockResult)
    }
    setLoading(false)
  }, [testId, subject, testType])

  const getSubjectName = (subjectId: string) => {
    const subjectNames: Record<string, string> = {
      matematika: "Matematika",
      fizika: "Fizika",
      kimyo: "Kimyo",
      biologiya: "Biologiya",
      "ingliz-tili": "Ingliz tili",
      "ona-tili": "Ona tili",
      tarix: "Tarix",
      geografiya: "Geografiya",
    }
    return subjectNames[subjectId] || subjectId
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (loading || !testResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Natijalar yuklanmoqda...</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const percentage = (testResult.correctAnswers / testResult.totalQuestions) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => router.push(`/tests/${subject}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Testlarga qaytish
          </Button>
          <Button variant="outline" onClick={() => router.push("/profile")}>
            <Home className="mr-2 h-4 w-4" />
            Profilga qaytish
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{testResult.testTitle} natijasi</CardTitle>
                <CardDescription>
                  {testResult.subjectName} | {new Date(testResult.date).toLocaleDateString("uz-UZ")}
                </CardDescription>
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Natijani yuklab olish
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Umumiy ball</span>
                    <span className="text-sm font-medium">
                      {testResult.correctAnswers}/{testResult.totalQuestions}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-500">To'g'ri javoblar</div>
                    <div className="text-2xl font-bold text-green-700">{testResult.correctAnswers}</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-500">Noto'g'ri javoblar</div>
                    <div className="text-2xl font-bold text-red-700">
                      {testResult.totalQuestions - testResult.correctAnswers}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm text-gray-500">Sarflangan vaqt</div>
                  <div className="text-2xl font-bold text-blue-700">{formatTime(testResult.timeTaken)}</div>
                </div>

                <div className="bg-amber-50 rounded-lg p-3">
                  <div className="text-sm text-gray-500">Natija</div>
                  <div className="text-2xl font-bold text-amber-700">
                    {percentage >= 80
                      ? "A'lo"
                      : percentage >= 60
                        ? "Yaxshi"
                        : percentage >= 40
                          ? "Qoniqarli"
                          : "Qoniqarsiz"}
                  </div>
                </div>
              </div>
            </div>

            {testResult.isPremium && (
              <div className="border rounded-lg p-4 bg-green-50 mb-6">
                <h3 className="font-medium text-green-800 mb-2">Moliyaviy natija:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-500">Test narxi</div>
                    <div className="text-xl font-bold text-red-600">-{testResult.price.toLocaleString()} so'm</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-500">To'g'ri javoblar uchun</div>
                    <div className="text-xl font-bold text-green-600">+{testResult.reward.toLocaleString()} so'm</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-500">Jami foyda</div>
                    <div className="text-xl font-bold text-blue-600">
                      {(testResult.reward - testResult.price).toLocaleString()} so'm
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Savollar tahlili</h3>

              <div className="space-y-6">
                {testResult.questions.map((question: any) => (
                  <div
                    key={question.id}
                    className={`border rounded-lg p-4 ${
                      question.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`mt-1 mr-3 ${question.isCorrect ? "text-green-600" : "text-red-600"}`}>
                        {question.isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium mb-2">{question.text}</div>

                        <div className="space-y-2">
                          {question.options.map((option: any) => (
                            <div
                              key={option.id}
                              className={`flex items-center p-2 rounded-md ${
                                option.id === question.correctAnswer
                                  ? "bg-green-100 border border-green-200"
                                  : option.id === question.userAnswer && !question.isCorrect
                                    ? "bg-red-100 border border-red-200"
                                    : ""
                              }`}
                            >
                              <div className="w-6 text-sm font-medium">{option.id}.</div>
                              <div className="flex-1">{option.text}</div>
                              <div>
                                {option.id === question.correctAnswer && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    To'g'ri javob
                                  </Badge>
                                )}
                                {option.id === question.userAnswer && option.id !== question.correctAnswer && (
                                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    Sizning javobingiz
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => router.push(`/tests/${subject}`)}>
                Testlarga qaytish
              </Button>
              <Button onClick={() => router.push(`/tests/${subject}`)}>Yangi test boshlash</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

