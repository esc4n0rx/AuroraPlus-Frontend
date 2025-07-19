"use client"

import type { Content } from "@/lib/store"
import { ContentCard } from "./content-card"
import { ChevronRight } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface ContentCarouselProps {
  title: string
  content: Content[]
}

export function ContentCarousel({ title, content }: ContentCarouselProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 px-4">
          {content.map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}
