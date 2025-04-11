"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Cloud, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-xl">GetWeather</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/saved">
              <Button
                variant={pathname === "/saved" ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-1"
              >
                <Star className="h-4 w-4" />
                <span>Saved</span>
              </Button>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
