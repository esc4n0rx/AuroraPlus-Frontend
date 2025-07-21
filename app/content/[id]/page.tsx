"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useContent } from "@/hooks/use-content"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Play, Plus, Download, Share, ArrowLeft, Star, Clock, Calendar, Info } from "lucide-react"
import Image from "next/image"
import { ContentCarousel } from "@/components/content-carousel"
import { VideoPlayer } from "@/components/video-player"
import type { ContentWithTMDB, ContentAPI } from "@/types/content"

export default function ContentDetailsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getContentByName, getSimilarContents, isLoading, error } = useContent()
  const [content, setContent] = useState<ContentWithTMDB | null>(null)
  const [similarContents, setSimilarContents] = useState<ContentAPI[]>([])
  const [showPlayer, setShowPlayer] = useState(false)
  
  const name = searchParams.get('name')
  const year = searchParams.get('year')

  useEffect(() => {
    const loadContent = async () => {
      if (!name) {
        router.push('/home')
        return
      }

      try {
        console.log('Loading content details for:', name, year)
        const contentData = await getContentByName(name, year ? parseInt(year) : undefined)
        setContent(contentData)

        // Carregar conteúdos similares
        if (contentData.category) {
          try {
            const similar = await getSimilarContents(contentData.name, contentData.category)
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
  }, [name, year, getContentByName, getSimilarContents, router])

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
  const displayBackdrop = tmdbData?.backdrop || "/placeholder.svg"

  const handleWatch = () => {
    setShowPlayer(true)
  }

  const handlePlayerClose = () => {
    setShowPlayer(false)
  }

  const handlePlayerError = (error: string) => {
    console.error('Player error:', error)
    setShowPlayer(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Video Player */}
      {showPlayer && content && (
        <VideoPlayer
          streamUrl={content.streamUrl}
          title={displayTitle}
          onClose={handlePlayerClose}
          onError={handlePlayerError}
        />
      )}
      {/* Header com botão voltar */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        {/* Background Image */}
        <Image 
          src={displayBackdrop || "/placeholder.svg"} 
          alt={displayTitle} 
          fill 
          className="object-cover" 
          priority 
          sizes="100vw"
        />

        {/* Overlay Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Content Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              {displayYear && (
                <Badge className="text-xs font-bold bg-blue-600 hover:bg-blue-700">
                  {displayYear}
                </Badge>
              )}
              {content.type === 'series' && (
                <Badge className="text-xs font-bold bg-purple-600 hover:bg-purple-700">
                  SÉRIE
                </Badge>
              )}
              {displayRating > 0 && (
                <Badge className="text-xs font-bold bg-yellow-600 hover:bg-yellow-700">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {displayRating.toFixed(1)}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white mb-3 line-clamp-2">
              {displayTitle}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-300 mb-4 flex-wrap">
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
              {displayGenres && (
                <div className="flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  <span>{displayGenres}</span>
                </div>
              )}
            </div>

            {/* Overview */}
            <p className="text-gray-200 text-sm md:text-base max-w-2xl mb-6 line-clamp-3">
              {displayOverview}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button size="lg" className="gap-2 bg-white text-black hover:bg-gray-100" onClick={handleWatch}>
                <Play className="h-5 w-5 fill-current" />
                {content.type === 'series' ? 'Assistir Série' : 'Reproduzir'}
              </Button>

              <Button size="lg" variant="secondary" className="gap-2 bg-gray-800/80 hover:bg-gray-800 text-white">
                <Plus className="h-5 w-5" />
                Minha Lista
              </Button>

              <Button size="lg" variant="ghost" className="gap-2 text-white hover:text-white hover:bg-white/10">
                <Download className="h-5 w-5" />
                Download
              </Button>

              <Button size="lg" variant="ghost" className="gap-2 text-white hover:text-white hover:bg-white/10">
                <Share className="h-5 w-5" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Details */}
      <div className="relative z-10 bg-background">
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Poster e Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Poster */}
            <div className="md:col-span-1">
            </div>

            {/* Info Details */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-foreground mb-4">Detalhes</h2>
              
              {/* Info Grid Compacto */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Gênero</span>
                  <span className="text-sm font-medium text-foreground">{displayGenres || 'Não informado'}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Categoria</span>
                  <span className="text-sm font-medium text-foreground">{content.category}</span>
                </div>

                {content.subcategory && (
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Subcategoria</span>
                    <span className="text-sm font-medium text-foreground">{content.subcategory}</span>
                  </div>
                )}

                {displayYear && (
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Ano</span>
                    <span className="text-sm font-medium text-foreground">{displayYear}</span>
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Tipo</span>
                  <span className="text-sm font-medium text-foreground">{content.type === 'movie' ? 'Filme' : 'Série'}</span>
                </div>

                {tmdbData?.voteCount && (
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Votos</span>
                    <span className="text-sm font-medium text-foreground">{tmdbData.voteCount.toLocaleString()}</span>
                  </div>
                )}

                {tmdbData?.popularity && (
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Popularidade</span>
                    <span className="text-sm font-medium text-foreground">{tmdbData.popularity.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Production Companies */}
              {tmdbData?.productionCompanies && tmdbData.productionCompanies.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">Produção</span>
                  <div className="flex flex-wrap gap-2">
                    {tmdbData.productionCompanies.map((company) => (
                      <Badge key={company.id} variant="outline" className="text-xs">
                        {company.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Similar Content */}
          {similarContents.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">Conteúdo Relacionado</h2>
              <ContentCarousel
                title=""
                content={similarContents}
                isLoading={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}