import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Cake, Gift } from "lucide-react"
import { DatesInfo, BaseComponentProps } from "./types"

interface ImportantDatesProps extends BaseComponentProps {
  dates: DatesInfo
}

export function ImportantDates({ dates, theme }: ImportantDatesProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified"

    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  if (theme === "minimal") {
    return (
      <div>
        <h2 className="mb-3 text-xl font-semibold">Important Dates</h2>
        <div className="space-y-3">
          {dates.birthday && (
            <div className="flex items-center gap-3">
              <Cake className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Birthday</p>
                <p className="text-sm text-muted-foreground">{formatDate(dates.birthday)}</p>
              </div>
            </div>
          )}

          {dates.workAnniversary && (
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Work Anniversary</p>
                <p className="text-sm text-muted-foreground">{formatDate(dates.workAnniversary)}</p>
              </div>
            </div>
          )}

          {dates.weddingAnniversary && (
            <div className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Wedding Anniversary</p>
                <p className="text-sm text-muted-foreground">{formatDate(dates.weddingAnniversary)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (theme === "modern") {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
          <CardTitle className="text-xl">Important Dates</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {dates.birthday && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Cake className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Birthday</p>
                  <p className="text-sm text-muted-foreground">{formatDate(dates.birthday)}</p>
                </div>
              </div>
            )}

            {dates.workAnniversary && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">Work Anniversary</p>
                  <p className="text-sm text-muted-foreground">{formatDate(dates.workAnniversary)}</p>
                </div>
              </div>
            )}

            {dates.weddingAnniversary && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <Gift className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Wedding Anniversary</p>
                  <p className="text-sm text-muted-foreground">{formatDate(dates.weddingAnniversary)}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (theme === "bold") {
    return (
      <Card className="border-2 border-indigo-200">
        <CardHeader>
          <CardTitle>Important Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {dates.birthday && (
              <div className="rounded-lg bg-blue-50 p-3">
                <div className="flex items-center gap-3">
                  <Cake className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Birthday</p>
                    <p className="text-sm text-muted-foreground">{formatDate(dates.birthday)}</p>
                  </div>
                </div>
              </div>
            )}

            {dates.workAnniversary && (
              <div className="rounded-lg bg-indigo-50 p-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="font-medium">Work Anniversary</p>
                    <p className="text-sm text-muted-foreground">{formatDate(dates.workAnniversary)}</p>
                  </div>
                </div>
              </div>
            )}

            {dates.weddingAnniversary && (
              <div className="rounded-lg bg-purple-50 p-3">
                <div className="flex items-center gap-3">
                  <Gift className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Wedding Anniversary</p>
                    <p className="text-sm text-muted-foreground">{formatDate(dates.weddingAnniversary)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default "classic" theme
  return (
    <Card>
      <CardHeader>
        <CardTitle>Important Dates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dates.birthday && (
            <div className="flex items-center gap-2">
              <Cake className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Birthday</p>
                <p className="text-sm text-muted-foreground">{formatDate(dates.birthday)}</p>
              </div>
            </div>
          )}

          {dates.workAnniversary && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Work Anniversary</p>
                <p className="text-sm text-muted-foreground">{formatDate(dates.workAnniversary)}</p>
              </div>
            </div>
          )}

          {dates.weddingAnniversary && (
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Wedding Anniversary</p>
                <p className="text-sm text-muted-foreground">{formatDate(dates.weddingAnniversary)}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

