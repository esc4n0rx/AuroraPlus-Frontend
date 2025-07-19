"use client"

import type { Content } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Plus, Info } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface HeroBannerProps {
  content: Content
}

export function HeroBanner({ content }: HeroBannerProps) {
  const router = useRouter()

  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden rounded-lg cursor-pointer group"
      onClick={() => router.push(`/content/${content.id}`)}
    >
      <Image src={content.image || "/placeholder.svg"} alt={content.title} fill className="object-cover" priority />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
        <div className="space-y-2">
          {content.badge && (
            <Badge
              className={`text-sm font-bold ${
                content.badge === "AO VIVO"
                  ? "bg-red-600 hover:bg-red-700"
                  : content.badge === "TOP 10"
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {content.badge}
            </Badge>
          )}

          <h1 className="text-2xl md:text-4xl font-bold text-white">{content.title}</h1>

          {content.description && <p className="text-sm text-gray-200 max-w-md">{content.description}</p>}

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              Incluído no Aurora
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button size="lg" className="gap-2">
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
