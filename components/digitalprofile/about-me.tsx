import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BaseComponentProps } from "./types"

interface AboutMeProps extends BaseComponentProps {
  about: string
}

export function AboutMe({ about, theme }: AboutMeProps) {
  if (theme === "glassmorphism") {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About Me</h2>
        <div className="prose prose-sm max-w-none prose-slate text-gray-600" dangerouslySetInnerHTML={{ __html: about }} />
      </div>
    )
  }

  if (theme === "minimal") {
    return (
      <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:bg-white/80 dark:hover:bg-slate-900/80 hover:shadow-xl hover:-translate-y-1">
        <h2 className="mb-4 text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          About Me
        </h2>
        <div className="prose prose-sm max-w-none dark:prose-invert prose-slate" dangerouslySetInnerHTML={{ __html: about }} />
      </div>
    )
  }

  if (theme === "modern") {
    return (
      <Card className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 pb-3 relative z-10 border-b border-slate-200 dark:border-slate-700">
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            About Me
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 relative z-10">
          <div className="prose prose-blue max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: about }} />
        </CardContent>
      </Card>
    )
  }

  if (theme === "bold") {
    return (
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-indigo-50 dark:from-slate-900 dark:to-indigo-950 border-2 border-indigo-200 dark:border-indigo-800 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            About Me
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="prose prose-indigo max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: about }} />
        </CardContent>
      </Card>
    )
  }

  // Default "classic" theme
  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          About Me
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="prose prose-sm max-w-none dark:prose-invert prose-slate" dangerouslySetInnerHTML={{ __html: about }} />
      </CardContent>
    </Card>
  )
}
