"use client"

import { type Content, useAppStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Check } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface ContentCardProps {
  content: Content
}

export function ContentCard({ content }: ContentCardProps) {
  const { myList, addToMyList, removeFromMyList } = useAppStore()
  const isInMyList = myList.some((item) => item.id === content.id)
  const router = useRouter()

  const handleToggleMyList = () => {
    if (isInMyList) {
      removeFromMyList(content.id)
    } else {
      addToMyList(content)
    }
  }

  return (
    <div
      className="relative group min-w-[160px] w-40 cursor-pointer"
      onClick={() => router.push(`/content/${content.id}`)}
    >
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
        <Image
          src={content.image || "/placeholder.svg"}
          alt={content.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />

        {content.badge && (
          <Badge
            className={`absolute top-2 left-2 text-xs font-bold ${
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

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="sm" variant="secondary" onClick={handleToggleMyList} className="gap-2">
            {isInMyList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isInMyList ? "Na Lista" : "Adicionar"}
          </Button>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        <h3 className="text-sm font-medium text-foreground line-clamp-2">{content.title}</h3>
        {content.description && <p className="text-xs text-muted-foreground line-clamp-1">{content.description}</p>}
      </div>
    </div>
  )
}
