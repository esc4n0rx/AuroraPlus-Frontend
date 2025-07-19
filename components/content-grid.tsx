"use client"

import { ContentCard } from "./content-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { ContentAPI } from "@/types/content"

interface ContentGridProps {
  contents: ContentAPI[]
  isLoading?: boolean
  error?: string | null
  emptyMessage?: string
  className?: string
}

export function ContentGrid({ 
  contents, 
  isLoading = false, 
  error = null, 
  emptyMessage = "Nenhum conteúdo encontrado",
  className = ""
}: ContentGridProps) {
  if (error) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-6xl">⚠️</div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Erro ao carregar conteúdos</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[3/4] rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-6xl">📺</div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Nenhum conteúdo encontrado</h3>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
      {contents.map((content) => (
        <ContentCard key={`${content.name}-${content.year}`} content={content} />
      ))}
    </div>
  )
}