"use client"

import { useRef, useState, useEffect } from "react"
import type { ContentAPI } from "@/types/content"
import { ContentCard } from "./content-card"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface ContentCarouselProps {
  title: string
  content: ContentAPI[]
  isLoading?: boolean
  error?: string | null
}

export function ContentCarousel({ title, content, isLoading = false, error = null }: ContentCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320 // 2 cards + gap
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  // Verificar botões de scroll quando o conteúdo muda
  useEffect(() => {
    checkScrollButtons()
  }, [content, isLoading])

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
        <div className="px-4 text-center py-8">
          <p className="text-muted-foreground">Erro ao carregar conteúdos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="h-8 w-8 bg-background/80 hover:bg-background/90 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="h-8 w-8 bg-background/80 hover:bg-background/90 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <ScrollArea 
          className="w-full whitespace-nowrap"
          onScroll={checkScrollButtons}
          ref={scrollRef}
        >
          <div className="flex space-x-4 px-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="min-w-[160px] w-40 space-y-2">
                  <Skeleton className="aspect-[3/4] rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))
            ) : content.length > 0 ? (
              content.map((item) => (
                <ContentCard key={`${item.name}-${item.year}`} content={item} />
              ))
            ) : (
              <div className="w-full text-center py-8">
                <p className="text-muted-foreground">Nenhum conteúdo encontrado</p>
              </div>
            )}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>

        {/* Indicadores de scroll */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  )
}