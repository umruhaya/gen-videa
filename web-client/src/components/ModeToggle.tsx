// Import necessary React functionalities and specific icons for the UI
import * as React from "react"
import { Moon, Sun } from "lucide-react"

// Import custom UI components to build the mode toggle interface
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define the ModeToggle function component
export default function ModeToggle() {
    // State hook to manage the theme ('theme-light', 'dark', or 'system')
    const [theme, setThemeState] = React.useState<
        "theme-light" | "dark" | "system"
    >("theme-light")

    // Effect hook to set the theme state based on the current class on <html> element
    // Runs once on component mount
    React.useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark")
        setThemeState(isDarkMode ? "dark" : "theme-light")
    }, [])

    // Effect hook to apply the theme class to the <html> element based on the state
    // Runs every time the theme state changes
    React.useEffect(() => {
        const isDark =
            theme === "dark" ||
            (theme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        document.documentElement.classList[isDark ? "add" : "remove"]("dark")
    }, [theme])

    // Render a dropdown menu for theme selection with Sun and Moon icons indicating light/dark mode
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" data-testid="mode-toggle-btn">
                    {/* Sun icon visible in dark mode and Moon icon visible in light mode */}
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    {/* Screen reader only text for accessibility */}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {/* Dropdown items for selecting light, dark, or system theme */}
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
