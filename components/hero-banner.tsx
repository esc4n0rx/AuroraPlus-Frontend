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
      ...(content.year && { year: content.year.toString() })
    })
    router.push(`/content/${content.name}?${params.toString()}`)
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

      {/* Content Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
        <div className="space-y-2">
          {content.year && (
            <Badge className="text-sm font-bold bg-blue-600 hover:bg-blue-700">
              {content.year}
            </Badge>
          )}

          <h2 className="text-2xl md:text-4xl font-bold text-white">{content.name}</h2>

          <p className="text-gray-200 max-w-2xl text-sm md:text-base">
            {content.name} é uma {content.type === 'series' ? 'série' : 'produção'} da categoria {content.category}.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button size="lg" className="gap-2" onClick={handleWatch}>
            <Play className="h-5 w-5 fill-current" />
            {content.type === 'series' ? 'Assistir Série' : 'Reproduzir'}
          </Button>

          <Button size="lg" variant="secondary" className="gap-2">
            <Plus className="h-5 w-5" />
            Minha Lista
          </Button>
        </div>
      </div>
    </div>
  )
}