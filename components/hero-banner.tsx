"use client"

import type { ContentAPI } from "@/types/content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Plus, Info } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface HeroBannerProps {
  content: ContentAPI
}

export function HeroBanner({ content }: HeroBannerProps) {
  const router = useRouter()

  const handleClick = () => {
    const params = new URLSearchParams({
      name: content.name,
      type: content.type,
      ...(content.year && { year: content.year.toString() })
    })
    router.push(`/content/details?${params.toString()}`)
  }

  const handleWatch = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implementar lógica de reprodução
    console.log('Watch content:', content.streamUrl)
  }

  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden rounded-lg cursor-pointer group"
      onClick={handleClick}
    >
      <Image 
        src={content.poster || "/placeholder.svg"} 
        alt={content.name} 
        fill 
        className="object-cover" 
        priority 
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
        <div className="space-y-2">
          {content.year && (
            <Badge
              className="text-sm font-bold bg-blue-600 hover:bg-blue-700"
            >
              {content.year}
            </Badge>
          )}

          <h1 className="text-2xl md:text-4xl font-bold text-white">{content.name}</h1>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              Incluído no Aurora
            </span>
            <span>•</span>
            <span>{content.category}</span>
            {content.subcategory && (
              <>
                <span>•</span>
                <span>{content.subcategory}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button size="lg" className="gap-2" onClick={handleWatch}>
            <Play className="h-5 w-5 fill-current" />
            Assistir
          </Button>

          <Button size="lg" variant="secondary" className="gap-2">
            <Plus className="h-5 w-5" />
            Minha Lista
          </Button>

          <Button size="lg" variant="ghost" className="gap-2 text-white hover:text-white">
            <Info className="h-5 w-5" />
            Mais Info
          </Button>
        </div>
      </div>
    </div>
  )
}