import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TestsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-24 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

