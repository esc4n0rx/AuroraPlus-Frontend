"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { mockContent } from "@/lib/data"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Play, Plus, Check, Download, Share, ArrowLeft, Star, Clock, Calendar } from "lucide-react"
import Image from "next/image"
import type { Content } from "@/lib/store"

export default function ContentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { myList, addToMyList, removeFromMyList, downloads, addToDownloads } = useAppStore()
  const [content, setContent] = useState<Content | null>(null)

  useEffect(() => {
    const foundContent = mockContent.find((item) => item.id === params.id)
    setContent(foundContent || null)
  }, [params.id])

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Conteúdo não encontrado</h2>
          <Button onClick={() => router.back()}>Voltar</Button>
        </div>
      </div>
    )
  }

  const isInMyList = myList.some((item) => item.id === content.id)
  const isDownloaded = downloads.some((item) => item.id === content.id)

  const handleToggleMyList = () => {
    if (isInMyList) {
      removeFromMyList(content.id)
    } else {
      addToMyList(content)
    }
  }

  const handleDownload = () => {
    if (!isDownloaded) {
      addToDownloads(content)
    }
  }

  // Mock additional data for details page
  const mockDetails = {
    year: "2024",
    duration: content.type === "series" ? "8 episódios" : "2h 15min",
    rating: "4.5",
    genre:
      content.type === "sport"
        ? "Esportes"
        : content.category.includes("romântico")
          ? "Romance, Drama"
          : "Ação, Aventura",
    director: "João Silva",
    cast: ["Ana Costa", "Pedro Santos", "Maria Oliveira"],
    synopsis:
      content.description ||
      `${content.title} é uma ${content.type === "series" ? "série" : content.type === "sport" ? "transmissão esportiva" : "produção"} emocionante que cativa o público com sua narrativa envolvente e personagens marcantes. Uma experiência única que combina entretenimento de alta qualidade com momentos inesquecíveis.`,
    episodes:
      content.type === "series"
        ? [
            { number: 1, title: "Piloto", duration: "45min" },
            { number: 2, title: "O Começo", duration: "42min" },
            { number: 3, title: "Revelações", duration: "48min" },
          ]
        : null,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="bg-black/50 hover:bg-black/70 text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Hero Section with Backdrop */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image src={content.image || "/placeholder.svg"} alt={content.title} fill className="object-cover" priority />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Content Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
          <div className="space-y-3">
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

            <h1 className="text-3xl md:text-5xl font-bold text-white">{content.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{mockDetails.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{mockDetails.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{mockDetails.duration}</span>
              </div>
            </div>

            <p className="text-gray-200 max-w-2xl text-lg">{mockDetails.synopsis}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button size="lg" className="gap-2">
              <Play className="h-5 w-5 fill-current" />
              {content.type === "sport" ? "Assistir ao Vivo" : "Reproduzir"}
            </Button>

            <Button size="lg" variant="secondary" className="gap-2" onClick={handleToggleMyList}>
              {isInMyList ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {isInMyList ? "Na Lista" : "Minha Lista"}
            </Button>

            {content.type !== "sport" && (
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-transparent"
                onClick={handleDownload}
                disabled={isDownloaded}
              >
                <Download className="h-5 w-5" />
                {isDownloaded ? "Baixado" : "Download"}
              </Button>
            )}

            <Button size="lg" variant="ghost" className="gap-2 text-white hover:text-white">
              <Share className="h-5 w-5" />
              Compartilhar
            </Button>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Detalhes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Gênero</h3>
                <p className="text-muted-foreground">{mockDetails.genre}</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Direção</h3>
                <p className="text-muted-foreground">{mockDetails.director}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Elenco</h3>
                <p className="text-muted-foreground">{mockDetails.cast.join(", ")}</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Ano</h3>
                <p className="text-muted-foreground">{mockDetails.year}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Episodes Section (for series) */}
        {content.type === "series" && mockDetails.episodes && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Episódios</h2>

            <div className="space-y-3">
              {mockDetails.episodes.map((episode) => (
                <div
                  key={episode.number}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer"
                >
                  <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                    <Play className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">
                      {episode.number}. {episode.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{episode.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Conteúdo Relacionado</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockContent
              .filter((item) => item.id !== content.id && item.category === content.category)
              .slice(0, 4)
              .map((item) => (
                <div key={item.id} className="cursor-pointer group" onClick={() => router.push(`/content/${item.id}`)}>
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />

                    {item.badge && <Badge className="absolute top-2 left-2 text-xs">{item.badge}</Badge>}
                  </div>

                  <h4 className="mt-2 font-medium text-foreground line-clamp-2">{item.title}</h4>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
