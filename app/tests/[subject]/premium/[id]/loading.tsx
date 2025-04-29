import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PremiumTestLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>

        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4">
            <Card className="mb-6">
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-2 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Skeleton className="h-6 w-full" />

                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-14 w-full rounded-md" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-1/4">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 30 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-10 rounded-md" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

