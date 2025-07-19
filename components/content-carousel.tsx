"use client"

import type { ContentAPI } from "@/types/content"
import { ContentCard } from "./content-card"
import { ChevronRight } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

interface ContentCarouselProps {
  title: string
  content: ContentAPI[]
  isLoading?: boolean
  error?: string | null
}

export function ContentCarousel({ title, content, isLoading = false, error = null }: ContentCarouselProps) {
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
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
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
    </div>
  )
}