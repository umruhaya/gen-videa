import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ModeToggle() {
    const [theme, setThemeState] = React.useState<
        "theme-light" | "dark" | "system"
    >("theme-light")

    React.useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark")
        setThemeState(isDarkMode ? "dark" : "theme-light")
    }, [])

    React.useEffect(() => {
        const isDark =
            theme === "dark" ||
            (theme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        document.documentElement.classList[isDark ? "add" : "remove"]("dark")
    }, [theme])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" data-testid="mode-toggle-btn">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem data-testid="mode-toggle-light-btn" onClick={() => setThemeState("theme-light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="mode-toggle-dark-btn" onClick={() => setThemeState("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setThemeState("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
