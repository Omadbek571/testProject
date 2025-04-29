"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Clock, Flag, Save, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

export default function FreeTestPage({ params }: { params: { subject: string; id: string } }) {
  const router = useRouter()
  const { subject, id } = params
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes in seconds
  const [isFinished, setIsFinished] = useState(false)
  const [showStartDialog, setShowStartDialog] = useState(true)
  const [showConfirmFinishDialog, setShowConfirmFinishDialog] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintUsed, setHintUsed] = useState<Record<number, boolean>>({})
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Fan nomi
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

  const subjectName = subjectNames[subject] || subject

  // Fan rangi
  const subjectColors: Record<string, string> = {
    matematika: "bg-blue-100 text-blue-700",
    fizika: "bg-purple-100 text-purple-700",
    kimyo: "bg-green-100 text-green-700",
    biologiya: "bg-emerald-100 text-emerald-700",
    "ingliz-tili": "bg-red-100 text-red-700",
    "ona-tili": "bg-amber-100 text-amber-700",
    tarix: "bg-indigo-100 text-indigo-700",
    geografiya: "bg-cyan-100 text-cyan-700",
  }

  const subjectColor = subjectColors[subject] || "bg-gray-100 text-gray-700"

  // Mock test data
  const test = {
    id: id,
    title: `${subjectName} - Bepul test`,
    subject: subjectName,
    totalQuestions: 20,
    timeLimit: "30 minut",
    questions: Array.from({ length: 20 }).map((_, index) => ({
      id: index,
      text: `${index + 1}-savol: ${subjectName} bo'yicha savol ${index + 1}`,
      options: [
        { id: "A", text: "Javob A" },
        { id: "B", text: "Javob B" },
        { id: "C", text: "Javob C" },
        { id: "D", text: "Javob D" },
      ],
      correctAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
      hint: "Bu savolni yechish uchun maslahat: diqqat bilan o'qing va barcha variantlarni tahlil qiling.",
    })),
  }

  // Timer
  useEffect(() => {
    if (!testStarted || isFinished) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          handleFinishTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [testStarted, isFinished])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleStartTest = () => {
    setShowStartDialog(false)
    setTestStarted(true)
  }

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: value,
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < test.totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowHint(false)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowHint(false)
    }
  }

  const handleShowHint = () => {
    setShowHint(true)
    setHintUsed({
      ...hintUsed,
      [currentQuestion]: true,
    })
  }

  const handleFinishTest = () => {
    setIsFinished(true)
    if (timerRef.current) clearInterval(timerRef.current)

    // Calculate results
    let correctAnswers = 0
    Object.entries(selectedAnswers).forEach(([questionIndex, answer]) => {
      if (test.questions[Number(questionIndex)].correctAnswer === answer) {
        correctAnswers++
      }
    })

    // Save results to localStorage for the results page
    const results = {
      testId: id,
      subject: subject,
      subjectName: subjectName,
      testTitle: test.title,
      totalQuestions: test.totalQuestions,
      correctAnswers: correctAnswers,
      selectedAnswers: selectedAnswers,
      questions: test.questions,
      timeTaken: 1800 - timeLeft,
      date: new Date().toISOString(),
    }

    localStorage.setItem(`test_result_${id}`, JSON.stringify(results))

    // Trigger confetti if score is good
    if (correctAnswers / test.totalQuestions >= 0.7) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    // Navigate to results page
    router.push(`/tests/results/${id}?type=free&subject=${subject}`)
  }

  const progress = ((currentQuestion + 1) / test.totalQuestions) * 100
  const currentQuestionData = test.questions[currentQuestion]
  const answeredQuestionsCount = Object.keys(selectedAnswers).length

  // Animatsiya variantlari
  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  }

  if (showStartDialog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div
              className={`w-12 h-12 rounded-full ${subjectColor} flex items-center justify-center mx-auto mb-4 text-xl`}
            >
              {subject === "matematika"
                ? "📐"
                : subject === "fizika"
                  ? "⚛️"
                  : subject === "kimyo"
                    ? "🧪"
                    : subject === "biologiya"
                      ? "🧬"
                      : subject === "ingliz-tili"
                        ? "🔤"
                        : subject === "ona-tili"
                          ? "📝"
                          : subject === "tarix"
                            ? "🏛️"
                            : subject === "geografiya"
                              ? "🌍"
                              : "📚"}
            </div>
            <CardTitle className="text-center">{test.title}</CardTitle>
            <CardDescription className="text-center">
              {test.subject} | {test.totalQuestions} ta savol | {test.timeLimit}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="font-medium text-blue-800 mb-2">Test haqida ma'lumot:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Clock className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                  <span>Test bajarish uchun {test.timeLimit} vaqt beriladi</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Jami {test.totalQuestions} ta savol</span>
                </li>
                <li className="flex items-start">
                  <HelpCircle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                  <span>Har bir savol uchun maslahat mavjud</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                  <span>Vaqt tugaganda test avtomatik yakunlanadi</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push(`/tests/${subject}`)}>
              Bekor qilish
            </Button>
            <Button onClick={handleStartTest}>Testni boshlash</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => setShowConfirmFinishDialog(true)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Testdan chiqish
          </Button>
          <div className="flex items-center">
            <Clock className={`mr-2 h-5 w-5 ${timeLeft < 300 ? "text-red-500 animate-pulse" : "text-amber-500"}`} />
            <span className={`font-medium ${timeLeft < 300 ? "text-red-500" : ""}`}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{test.title}</h1>
          <p className="text-gray-600">
            {test.subject} | {test.totalQuestions} ta savol | {test.timeLimit}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.2 }}
              >
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>
                      Savol {currentQuestion + 1} / {test.totalQuestions}
                    </CardTitle>
                    <CardDescription>
                      <Progress value={progress} className="h-2 mt-2" />
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-lg font-medium">{currentQuestionData.text}</div>

                      <RadioGroup value={selectedAnswers[currentQuestion] || ""} onValueChange={handleAnswerSelect}>
                        {currentQuestionData.options.map((option) => (
                          <motion.div key={option.id} whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                            <div
                              className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 ${
                                selectedAnswers[currentQuestion] === option.id ? "border-blue-500 bg-blue-50" : ""
                              }`}
                            >
                              <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                              <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                                <span className="font-medium mr-2">{option.id}.</span> {option.text}
                              </Label>
                            </div>
                          </motion.div>
                        ))}
                      </RadioGroup>

                      {showHint && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4"
                        >
                          <div className="flex items-start">
                            <HelpCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                            <div>
                              <div className="font-medium text-amber-800 mb-1">Maslahat:</div>
                              <div className="text-amber-700">{currentQuestionData.hint}</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Oldingi
                      </Button>
                      {!showHint && !hintUsed[currentQuestion] && (
                        <Button variant="outline" onClick={handleShowHint}>
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Maslahat
                        </Button>
                      )}
                    </div>

                    {currentQuestion < test.totalQuestions - 1 ? (
                      <Button onClick={handleNextQuestion}>
                        Keyingi
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button onClick={() => setShowConfirmFinishDialog(true)}>
                        Testni tugatish
                        <Flag className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="w-full md:w-1/4">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Savollar</CardTitle>
                <CardDescription>
                  {answeredQuestionsCount} / {test.totalQuestions} javob berilgan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: test.totalQuestions }).map((_, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswers[index] ? "default" : "outline"}
                      className={`h-10 w-10 p-0 ${
                        currentQuestion === index ? "ring-2 ring-blue-500" : ""
                      } ${hintUsed[index] ? "border-amber-500" : ""}`}
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setShowConfirmFinishDialog(true)}>
                  <Save className="mr-2 h-4 w-4" />
                  Testni tugatish
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Testni tugatish dialog */}
        <Dialog open={showConfirmFinishDialog} onOpenChange={setShowConfirmFinishDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Testni tugatishni istaysizmi?</DialogTitle>
              <DialogDescription>
                {answeredQuestionsCount < test.totalQuestions
                  ? `Siz hali ${test.totalQuestions - answeredQuestionsCount} ta savolga javob bermagansiz.`
                  : "Barcha savollarga javob berdingiz."}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-500">
                Testni tugatgandan so'ng, natijalaringizni ko'rishingiz mumkin bo'ladi.
              </p>
            </div>
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="outline" onClick={() => setShowConfirmFinishDialog(false)}>
                Testga qaytish
              </Button>
              <Button onClick={handleFinishTest}>Testni tugatish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

