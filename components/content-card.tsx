"use client"

import { type ContentAPI, useAppStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Check, Star } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface ContentCardProps {
  content: ContentAPI
}

export function ContentCard({ content }: ContentCardProps) {
  const { myList, addToMyList, removeFromMyList } = useAppStore()
  const isInMyList = myList.some((item) => item.id === `${content.name}-${content.year}`)
  const router = useRouter()

  const handleToggleMyList = (e: React.MouseEvent) => {
    e.stopPropagation()
    const contentForStore = {
      id: `${content.name}-${content.year}`,
      title: content.name,
      image: content.poster,
      type: content.type === 'movie' ? 'movie' as const : 'series' as const,
      category: content.category,
      description: content.name
    }

    if (isInMyList) {
      removeFromMyList(contentForStore.id)
    } else {
      addToMyList(contentForStore)
    }
  }

  const handleClick = () => {
    // Navegar para a página de detalhes com o nome e tipo como parâmetros
    const params = new URLSearchParams({
      name: content.name,
      type: content.type,
      ...(content.year && { year: content.year.toString() })
    })
    router.push(`/content/details?${params.toString()}`)
  }

  return (
    <div
      className="relative group min-w-[160px] w-full cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
        <Image
          src={content.poster || "/placeholder.svg"}
          alt={content.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />

        {content.year && (
          <Badge
            className="absolute top-2 left-2 text-xs font-bold bg-blue-600 hover:bg-blue-700"
          >
            {content.year}
          </Badge>
        )}

        {content.type === 'series' && (
          <Badge
            className="absolute top-2 right-2 text-xs font-bold bg-purple-600 hover:bg-purple-700"
          >
            SÉRIE
          </Badge>
        )}

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={handleToggleMyList} 
            className="gap-2"
          >
            {isInMyList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isInMyList ? "Na Lista" : "Adicionar"}
          </Button>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        <h3 className="text-sm font-medium text-foreground line-clamp-2">{content.name}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{content.category}</span>
          {content.subcategory && (
            <>
              <span>•</span>
              <span>{content.subcategory}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}