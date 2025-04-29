import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SubjectTestsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Skeleton className="h-10 w-24 mr-4" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        <Tabs defaultValue="free">
          <TabsList className="mb-6">
            <TabsTrigger value="free">Bepul testlar</TabsTrigger>
            <TabsTrigger value="premium">Premium testlar</TabsTrigger>
          </TabsList>

          <TabsContent value="free">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <div className="flex justify-between mb-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

