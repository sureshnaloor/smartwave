import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BaseComponentProps } from "./types"

interface AboutMeProps extends BaseComponentProps {
  about: string
}

export function AboutMe({ about, theme }: AboutMeProps) {
  if (theme === "minimal") {
    return (
      <div>
        <h2 className="mb-3 text-xl font-semibold">About Me</h2>
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: about }} />
      </div>
    )
  }

  if (theme === "modern") {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
          <CardTitle className="text-xl">About Me</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: about }} />
        </CardContent>
      </Card>
    )
  }

  if (theme === "bold") {
    return (
      <Card className="border-2 border-indigo-200">
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-indigo max-w-none" dangerouslySetInnerHTML={{ __html: about }} />
        </CardContent>
      </Card>
    )
  }

  // Default "classic" theme
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Me</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: about }} />
      </CardContent>
    </Card>
  )
}

