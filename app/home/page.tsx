"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { mockContent } from "@/lib/data"
import { Navbar } from "@/components/navbar"
import { HeroBanner } from "@/components/hero-banner"
import { ContentCarousel } from "@/components/content-carousel"
import { Button } from "@/components/ui/button"
import { Cast, VolumeX, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const categories = ["Filmes", "Séries", "Esportes", "TV ao vivo"]

export default function HomePage() {
  const { user } = useAppStore()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("Filmes")

  useEffect(() => {
    if (!user?.currentProfile) {
      router.push("/")
    }
  }, [user, router])

  if (!user?.currentProfile) {
    return null
  }

  const featuredContent = mockContent.find((item) => item.badge === "AO VIVO") || mockContent[0]

  const contentByCategory = {
    "Esportes ao vivo": mockContent.filter((item) => item.category === "Esportes ao vivo"),
    "Filmes românticos": mockContent.filter((item) => item.category === "Filmes românticos"),
    "Originais e exclusivos": mockContent.filter((item) => item.category === "Originais e exclusivos"),
    "Filmes recomendados": mockContent.filter((item) => item.category === "Filmes recomendados"),
    "Séries populares": mockContent.filter((item) => item.category === "Séries populares"),
    "Filmes para toda a família": mockContent.filter((item) => item.category === "Filmes para toda a família"),
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Aurora
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost">
            <Cast className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost">
            <VolumeX className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Category Filters */}
      <div className="px-4 py-2">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "whitespace-nowrap",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                )}
              >
                {category}
                {selectedCategory === category && <span className="ml-2">×</span>}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Hero Banner */}
      <div className="px-4 py-4">
        <HeroBanner content={featuredContent} />
      </div>

      {/* Content Carousels */}
      <div className="space-y-8">
        {Object.entries(contentByCategory).map(
          ([title, content]) => content.length > 0 && <ContentCarousel key={title} title={title} content={content} />,
        )}
      </div>

      <Navbar />
    </div>
  )
}
