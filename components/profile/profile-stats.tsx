import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, BookOpen, CheckCircle, Clock, Target, TrendingUp } from "lucide-react"

export function ProfileStats() {
  // Mock user statistics
  const stats = {
    totalTests: 42,
    completedTests: 38,
    averageScore: 87,
    totalHours: 68,
    currentStreak: 7,
    longestStreak: 14,
    level: 8,
    levelProgress: 75,
    nextLevelPoints: 250,
    currentPoints: 187,
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Target className="mr-2 h-5 w-5 text-blue-500" />
            O'qish statistikasi
          </CardTitle>
          <CardDescription>Sizning o'qish ko'rsatkichlaringiz</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-500">Jami testlar</div>
                <div className="text-2xl font-bold text-blue-700">{stats.totalTests}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-500">Tugatilgan</div>
                <div className="text-2xl font-bold text-green-700">{stats.completedTests}</div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <div className="text-sm text-gray-500">O'rtacha ball</div>
              <div className="text-2xl font-bold text-amber-700">{stats.averageScore}%</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-500">Jami soatlar</div>
                <div className="text-2xl font-bold text-purple-700">{stats.totalHours}</div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-500">Streak</div>
                <div className="text-2xl font-bold text-indigo-700">{stats.currentStreak} kun</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Award className="mr-2 h-5 w-5 text-yellow-500" />
            Daraja va yutuqlar
          </CardTitle>
          <CardDescription>Sizning darajangiz va yutuqlaringiz</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-gray-500">Joriy daraja</div>
              <div className="text-2xl font-bold">{stats.level}-daraja</div>
              <div className="mt-2">
                <Progress value={stats.levelProgress} className="h-2" />
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {stats.currentPoints}/{stats.nextLevelPoints} ball ({stats.levelProgress}%)
              </div>
            </div>

            <div className="border rounded-lg p-3">
              <div className="text-sm font-medium mb-2">So'nggi yutuqlar</div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">5 ta test ketma-ket</div>
                    <div className="text-xs text-gray-500">2 kun oldin</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">90% dan yuqori ball</div>
                    <div className="text-xs text-gray-500">5 kun oldin</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">1 haftalik streak</div>
                    <div className="text-xs text-gray-500">Bugun</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-indigo-500" />
            Fanlar bo'yicha progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Matematika</span>
                <span className="text-sm text-gray-500">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Fizika</span>
                <span className="text-sm text-gray-500">72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Ingliz tili</span>
                <span className="text-sm text-gray-500">93%</span>
              </div>
              <Progress value={93} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Ona tili</span>
                <span className="text-sm text-gray-500">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Tarix</span>
                <span className="text-sm text-gray-500">65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

