"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Clock, Flag, Save, AlertTriangle, CheckCircle, HelpCircle, Award } from "lucide-react"
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

export default function PremiumTestPage({ params }: { params: { subject: string; id: string } }) {
  const router = useRouter()
  const { subject, id } = params
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes in seconds
  const [isFinished, setIsFinished] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(true)
  const [showConfirmFinishDialog, setShowConfirmFinishDialog] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [userBalance, setUserBalance] = useState(50000) // Mock balance
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintUsed, setHintUsed] = useState<Record<number, boolean>>({})
  const [paymentAnimation, setPaymentAnimation] = useState(false)
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
    title: `${subjectName} - Premium test`,
    subject: subjectName,
    totalQuestions: 30,
    timeLimit: "60 minut",
    price: 20000,
    rewardPerCorrectAnswer: 1000,
    questions: Array.from({ length: 30 }).map((_, index) => ({
      id: index,
      text: `${index + 1}-savol: ${subjectName} bo'yicha premium savol ${index + 1}`,
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

  // Load user balance from localStorage
  useEffect(() => {
    const storedBalance = localStorage.getItem("userBalance")
    if (storedBalance) {
      setUserBalance(Number(storedBalance))
    }
  }, [])

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
    // Deduct test price from balance
    const newBalance = userBalance - test.price
    setUserBalance(newBalance)
    localStorage.setItem("userBalance", newBalance.toString())

    setShowConfirmDialog(false)
    setShowPaymentSuccess(true)
    setPaymentAnimation(true)

    // Start the test after showing payment success
    setTimeout(() => {
      setShowPaymentSuccess(false)
      setTestStarted(true)
    }, 3000)
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

    // Calculate reward
    const reward = correctAnswers * test.rewardPerCorrectAnswer
    const newBalance = userBalance + reward
    setUserBalance(newBalance)
    localStorage.setItem("userBalance", newBalance.toString())

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
      timeTaken: 3600 - timeLeft,
      date: new Date().toISOString(),
      isPremium: true,
      price: test.price,
      reward: reward,
    }

    localStorage.setItem(`test_result_${id}`, JSON.stringify(results))

    // Trigger confetti if profit is positive
    if (reward > test.price) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    // Navigate to results page
    router.push(`/tests/results/${id}?type=premium&subject=${subject}`)
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

  if (showConfirmDialog) {
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
            <CardTitle className="text-center flex items-center justify-center">
              {test.title}
              <Badge className="ml-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white">Premium</Badge>
            </CardTitle>
            <CardDescription className="text-center">
              {test.subject} | {test.totalQuestions} ta savol | {test.timeLimit}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 bg-amber-50">
              <h3 className="font-medium text-amber-800 mb-2">Test shartlari:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Clock className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                  <span>Test bajarish uchun 60 daqiqa vaqt beriladi</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                  <span>
                    Test narxi: <strong>{test.price.toLocaleString()} so'm</strong>
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>
                    Har bir to'g'ri javob uchun: <strong>+{test.rewardPerCorrectAnswer.toLocaleString()} so'm</strong>
                  </span>
                </li>
                <li className="flex items-start">
                  <HelpCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                  <span>Har bir savol uchun maslahat mavjud</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                  <span>Testni boshlash uchun hisobingizda yetarli mablag' bo'lishi kerak</span>
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Joriy balans:</span>
                <span className="font-bold">{userBalance.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">Test narxi:</span>
                <span className="font-bold text-red-600">-{test.price.toLocaleString()} so'm</span>
              </div>
              <div className="border-t mt-2 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Qolgan balans:</span>
                  <span className="font-bold">{(userBalance - test.price).toLocaleString()} so'm</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push(`/tests/${subject}`)}>
              Bekor qilish
            </Button>
            <Button onClick={handleStartTest} disabled={userBalance < test.price}>
              {userBalance < test.price ? "Mablag' yetarli emas" : "Roziman, testni boshlash"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (showPaymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              To'lov muvaffaqiyatli amalga oshirildi
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>
            <p>
              Hisobingizdan <strong>{test.price.toLocaleString()} so'm</strong> yechib olindi.
            </p>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5 }}
              className="h-2 bg-green-500 rounded-full mt-6"
            />
            <p className="mt-4">Test boshlanmoqda...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Test yuklanmoqda...</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2" />
          </CardContent>
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
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mb-2 mr-2">{test.title}</h1>
            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">Premium</Badge>
          </div>
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
              <CardFooter className="flex flex-col gap-4">
                <div className="bg-amber-50 rounded-lg p-3 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-amber-600 mr-1" />
                      <span className="text-sm font-medium text-amber-800">Har bir to'g'ri javob:</span>
                    </div>
                    <span className="font-bold text-green-600">
                      +{test.rewardPerCorrectAnswer.toLocaleString()} so'm
                    </span>
                  </div>
                </div>
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
              <div className="bg-amber-50 rounded-lg p-3 mt-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                  <span className="text-sm text-amber-800">Eslatma: Faqat to'g'ri javoblar uchun pul olasiz!</span>
                </div>
              </div>
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

