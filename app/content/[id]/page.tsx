"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useContent } from "@/hooks/use-content"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Play, Plus, Check, Download, Share, ArrowLeft, Star, Clock, Calendar } from "lucide-react"
import Image from "next/image"
import { ContentCarousel } from "@/components/content-carousel"
import type { ContentWithTMDB, ContentAPI } from "@/types/content"

export default function ContentDetailsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getContentByName, getSimilarContents, isLoading, error } = useContent()
  const [content, setContent] = useState<ContentWithTMDB | null>(null)
  const [similarContents, setSimilarContents] = useState<ContentAPI[]>([])
  
  const name = searchParams.get('name')
  const type = searchParams.get('type') as 'movie' | 'series'
  const year = searchParams.get('year')

  useEffect(() => {
    const loadContent = async () => {
      if (!name || !type) {
        router.push('/home')
        return
      }

      try {
        console.log('Loading content details for:', name, type, year)
        const contentData = await getContentByName(name, type, year ? parseInt(year) : undefined)
        setContent(contentData)

        // Carregar conteúdos similares
        if (contentData.category) {
          try {
            const similar = await getSimilarContents(contentData.name, contentData.category, 10)
            setSimilarContents(similar)
          } catch (error) {
            console.error('Error loading similar contents:', error)
          }
        }
      } catch (error) {
        console.error('Error loading content:', error)
      }
    }

    loadContent()
  }, [name, type, year, getContentByName, getSimilarContents, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Conteúdo não encontrado</h2>
          <p className="text-muted-foreground">{error || 'O conteúdo solicitado não foi encontrado'}</p>
          <Button onClick={() => router.back()}>Voltar</Button>
        </div>
      </div>
    )
  }

  const tmdbData = content.tmdbData
  const displayTitle = tmdbData?.title || content.name
  const displayOverview = tmdbData?.overview || `${content.name} é uma ${content.type === 'series' ? 'série' : 'produção'} da categoria ${content.category}.`
  const displayRating = tmdbData?.rating || 0
  const displayYear = tmdbData?.releaseDate ? new Date(tmdbData.releaseDate).getFullYear() : content.year
  const displayRuntime = tmdbData?.runtime ? `${tmdbData.runtime} min` : content.type === 'series' ? 'Série' : '120 min'
  const displayGenres = tmdbData?.genres?.map(g => g.name).join(', ') || content.category
  const displayPoster = tmdbData?.poster || content.poster
  const displayBackdrop = tmdbData?.backdrop || content.poster

  const handleWatch = () => {
    // TODO: Implementar lógica de reprodução
    console.log('Watch content:', content.streamUrl)
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
        <Image 
          src={displayBackdrop || "/placeholder.svg"} 
          alt={displayTitle} 
          fill 
          className="object-cover" 
          priority 
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Content Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
          <div className="space-y-3">
            {content.year && (
              <Badge className="text-sm font-bold bg-blue-600 hover:bg-blue-700">
                {displayYear}
              </Badge>
            )}

            <h1 className="text-3xl md:text-5xl font-bold text-white">{displayTitle}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-300">
              {displayRating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{displayRating.toFixed(1)}</span>
                </div>
              )}
              {displayYear && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{displayYear}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{displayRuntime}</span>
              </div>
            </div>

            <p className="text-gray-200 max-w-2xl text-lg">{displayOverview}</p>
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

            <Button
              size="lg"
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <Download className="h-5 w-5" />
              Download
            </Button>

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
                <p className="text-muted-foreground">{displayGenres}</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Categoria</h3>
                <p className="text-muted-foreground">{content.category}</p>
              </div>

              {content.subcategory && (
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Subcategoria</h3>
                  <p className="text-muted-foreground">{content.subcategory}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {tmdbData?.voteCount && (
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Votos</h3>
                  <p className="text-muted-foreground">{tmdbData.voteCount.toLocaleString()}</p>
                </div>
              )}

              {displayYear && (
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Ano</h3>
                  <p className="text-muted-foreground">{displayYear}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-foreground mb-1">Tipo</h3>
                <p className="text-muted-foreground">{content.type === 'movie' ? 'Filme' : 'Série'}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Production Companies */}
        {tmdbData?.productionCompanies && tmdbData.productionCompanies.length > 0 && (
          <>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Produção</h2>
              <div className="flex flex-wrap gap-4">
                {tmdbData.productionCompanies.map((company) => (
                  <div key={company.id} className="text-sm text-muted-foreground">
                    {company.name}
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Similar Content */}
        {similarContents.length > 0 && (
          <div className="space-y-4">
            <ContentCarousel
              title="Conteúdo Relacionado"
              content={similarContents}
            />
          </div>
        )}
      </div>
    </div>
  )
}