"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Paintbrush } from "lucide-react"
import { ThemeType } from "./types"

interface ThemeSwitcherProps {
  currentTheme: ThemeType
  setTheme: (theme: ThemeType) => void
}

export function ThemeSwitcher({ currentTheme, setTheme }: ThemeSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Paintbrush className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Layout Style</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => setTheme("classic")}
            className={currentTheme === "classic" ? "bg-accent" : ""}
          >
            Classic
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("modern")} className={currentTheme === "modern" ? "bg-accent" : ""}>
            Modern
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("minimal")}
            className={currentTheme === "minimal" ? "bg-accent" : ""}
          >
            Minimal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("bold")} className={currentTheme === "bold" ? "bg-accent" : ""}>
            Bold
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

