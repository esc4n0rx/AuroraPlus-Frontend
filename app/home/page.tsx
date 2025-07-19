"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useContent } from "@/hooks/use-content"
import { Navbar } from "@/components/navbar"
import { HeroBanner } from "@/components/hero-banner"
import { ContentCarousel } from "@/components/content-carousel"
import { Button } from "@/components/ui/button"
import { Cast, VolumeX, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { ContentAPI } from "@/types/content"

const categories = ["Filmes", "Séries", "Animes", "Novelas"]

// Configuração das categorias de conteúdo
const categoryConfig = {
  "Filmes": {
    hero: "LANÇAMENTOS 2025",
    sections: [
      { title: "4K", category: "4K" },
      { title: "Filmes Românticos", category: "ROMANCE" },
      { title: "Originais e Exclusivos", category: "AÇÃO" },
      { title: "Filmes Recomendados", category: "LANÇAMENTOS 2024" },
      { title: "Filmes para Toda a Família", category: "ANIMAÇÃO E FAMILIA" }
    ]
  },
  "Séries": {
    hero: "NETFLIX",
    sections: [
      { title: "Disney Plus", category: "DISNEY PLUS" },
      { title: "Séries em Alta", category: "ROMANCE" },
      { title: "Prime Video", category: "AMAZON PRIME VIDEO" },
      { title: "Star+", category: "STAR PLUS" },
      { title: "Globoplay", category: "GLOBOPLAY" }
    ]
  },
  "Animes": {
    hero: null,
    sections: []
  },
  "Novelas": {
    hero: null,
    sections: []
  }
 }
 
 export default function HomePage() {
  const { user } = useAppStore()
  const router = useRouter()
  const { searchContents, isLoading, error } = useContent()
  const [selectedCategory, setSelectedCategory] = useState("Filmes")
  const [heroContent, setHeroContent] = useState<ContentAPI | null>(null)
  const [sectionContents, setSectionContents] = useState<Record<string, ContentAPI[]>>({})
  const [sectionLoading, setSectionLoading] = useState<Record<string, boolean>>({})
 
  useEffect(() => {
    if (!user?.currentProfile) {
      router.push("/")
    }
  }, [user, router])
 
  // Carregar conteúdo do hero
  useEffect(() => {
    const loadHeroContent = async () => {
      const config = categoryConfig[selectedCategory as keyof typeof categoryConfig]
      
      if (!config.hero) {
        setHeroContent(null)
        return
      }
 
      try {
        console.log('Loading hero content for category:', config.hero)
        const response = await searchContents({
          category: config.hero,
          type: selectedCategory === "Filmes" ? "movie" : selectedCategory === "Séries" ? "series" : "all",
          limit: 1,
          sortBy: "popularity",
          sortOrder: "desc"
        })
 
        if (response.contents.length > 0) {
          setHeroContent(response.contents[0])
        } else {
          setHeroContent(null)
        }
      } catch (error) {
        console.error('Error loading hero content:', error)
        setHeroContent(null)
      }
    }
 
    loadHeroContent()
  }, [selectedCategory, searchContents])
 
  // Carregar conteúdos das seções
  useEffect(() => {
    const loadSectionContents = async () => {
      const config = categoryConfig[selectedCategory as keyof typeof categoryConfig]
      
      if (config.sections.length === 0) {
        setSectionContents({})
        setSectionLoading({})
        return
      }
 
      // Inicializar loading states
      const loadingStates: Record<string, boolean> = {}
      config.sections.forEach(section => {
        loadingStates[section.title] = true
      })
      setSectionLoading(loadingStates)
 
      // Carregar cada seção
      const contentPromises = config.sections.map(async (section) => {
        try {
          console.log('Loading section content for:', section.title, 'category:', section.category)
          const response = await searchContents({
            category: section.category,
            type: selectedCategory === "Filmes" ? "movie" : selectedCategory === "Séries" ? "series" : "all",
            limit: 20,
            sortBy: "popularity",
            sortOrder: "desc"
          })
 
          return { title: section.title, contents: response.contents }
        } catch (error) {
          console.error(`Error loading section ${section.title}:`, error)
          return { title: section.title, contents: [] }
        }
      })
 
      const results = await Promise.all(contentPromises)
      
      const newSectionContents: Record<string, ContentAPI[]> = {}
      const newLoadingStates: Record<string, boolean> = {}
      
      results.forEach(result => {
        newSectionContents[result.title] = result.contents
        newLoadingStates[result.title] = false
      })
 
      setSectionContents(newSectionContents)
      setSectionLoading(newLoadingStates)
    }
 
    loadSectionContents()
  }, [selectedCategory, searchContents])
 
  if (!user?.currentProfile) {
    return null
  }
 
  const config = categoryConfig[selectedCategory as keyof typeof categoryConfig]
  const isUnderConstruction = selectedCategory === "Animes" || selectedCategory === "Novelas"
 
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
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
 
      {/* Content */}
      {isUnderConstruction ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="text-6xl">🚧</div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Em Construção</h3>
              <p className="text-muted-foreground">
                A seção de {selectedCategory.toLowerCase()} estará disponível em breve
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Banner */}
          {config.hero && (
            <div className="px-4 py-4">
              {heroContent ? (
                <HeroBanner content={heroContent} />
              ) : (
                <div className="aspect-[16/9] w-full rounded-lg bg-muted animate-pulse flex items-center justify-center">
                  <p className="text-muted-foreground">Carregando...</p>
                </div>
              )}
            </div>
          )}
 
          {/* Content Carousels */}
          <div className="space-y-8">
            {config.sections.map((section) => (
              <ContentCarousel
                key={section.title}
                title={section.title}
                content={sectionContents[section.title] || []}
                isLoading={sectionLoading[section.title] || false}
                error={error}
              />
            ))}
          </div>
        </>
      )}
 
      <Navbar />
    </div>
  )
 }