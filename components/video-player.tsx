"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  SkipBack,
  SkipForward,
  RotateCcw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthToken } from "@/hooks/use-auth-token"
import { useAppStore } from "@/lib/store"

interface VideoPlayerProps {
  streamUrl: string
  title: string
  onClose?: () => void
  onError?: (error: string) => void
}

export function VideoPlayer({ streamUrl, title, onClose, onError }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { getToken } = useAuthToken()
  const { user } = useAppStore()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isIntro, setIsIntro] = useState(true)
  const [introEnded, setIntroEnded] = useState(false)
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  // Função para obter URL do proxy
  const getProxyUrl = (url: string) => {
    const profileId = user?.currentProfile?.id || 'default'
    console.log('👤 Profile ID:', profileId)
    
    const proxyUrl = `http://localhost:3000/api/v1/stream/proxy?url=${encodeURIComponent(url)}&profile-id=${profileId}`
    console.log('🔗 Proxy URL:', proxyUrl)
    return proxyUrl
  }

  // Função para verificar se precisa de proxy
  const checkStreamAccess = async (url: string) => {
    try {
      console.log('🔍 Verificando acesso ao stream:', url)
      const token = getToken()
      console.log('🔑 Token disponível:', !!token)
      console.log('🔑 Token (primeiros 20 chars):', token ? token.substring(0, 20) + '...' : 'N/A')
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Frontend-Protocol': window.location.protocol
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      console.log('📋 Headers enviados:', headers)
      
      const response = await fetch(`http://localhost:3000/api/v1/stream/direct?url=${encodeURIComponent(url)}`, {
        method: 'GET',
        headers
      })
      
      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (response.ok) {
        const data = await response.json()
        console.log('📦 Response data:', data)
        
        if (data.success) {
          const finalUrl = data.data.useProxy ? data.data.proxyUrl : data.data.directUrl
          console.log('✅ URL final:', finalUrl)
          return finalUrl
        }
      } else {
        const errorText = await response.text()
        console.log('❌ Error response:', errorText)
      }
      
      console.log('🔄 Usando proxy como fallback')
      return getProxyUrl(url)
    } catch (error) {
      console.error('❌ Erro ao verificar acesso ao stream:', error)
      return getProxyUrl(url)
    }
  }

  // Carregar vídeo
  const loadVideo = async () => {
    if (!videoRef.current) return

    try {
      setIsLoading(true)
      setError(null)

      // Primeiro carrega a intro
      videoRef.current.src = "/base.mp4"
      setIsIntro(true)
      
      await videoRef.current.load()
      
      // Quando a intro terminar, carrega o stream principal
      const handleIntroEnded = async () => {
        if (isIntro) {
          setIsIntro(false)
          setIntroEnded(true)
          
          try {
            const finalUrl = await checkStreamAccess(streamUrl)
            console.log('🎬 Carregando vídeo com URL:', finalUrl)
            
            // Se for uma URL do proxy, usar fetch para carregar com headers
            if (finalUrl.includes('/stream/proxy')) {
              const token = getToken()
              console.log('🔐 Carregando vídeo via fetch com autorização')
              
              const response = await fetch(finalUrl, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Range': 'bytes=0-'
                }
              })
              
              if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
              }
              
              const blob = await response.blob()
              const videoUrl = URL.createObjectURL(blob)
              videoRef.current!.src = videoUrl
            } else {
              videoRef.current!.src = finalUrl
            }
            
            await videoRef.current!.load()
            videoRef.current!.play()
          } catch (error) {
            console.error('❌ Erro ao carregar stream principal:', error)
            setError('Erro ao carregar o stream principal')
            onError?.('Erro ao carregar o stream principal')
          }
        }
      }

      videoRef.current.addEventListener('ended', handleIntroEnded, { once: true })
      
    } catch (error) {
      setError('Erro ao carregar o vídeo')
      onError?.('Erro ao carregar o vídeo')
    } finally {
      setIsLoading(false)
    }
  }

  // Controles de reprodução
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  // Event listeners
  useEffect(() => {
    loadVideo()

    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => setDuration(video.duration)
    const handleError = () => {
      setError('Erro ao reproduzir o vídeo')
      onError?.('Erro ao reproduzir o vídeo')
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('error', handleError)
    }
  }, [streamUrl])

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white text-lg">{error}</p>
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50"
      onClick={showControlsTemporarily}
      onMouseMove={showControlsTemporarily}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto" />
            <p className="text-white text-lg">
              {isIntro ? 'Carregando intro...' : 'Carregando stream...'}
            </p>
          </div>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        autoPlay
        muted={isIntro} // Intro sempre muted
        onLoadedData={() => setIsLoading(false)}
      />

      {/* Controls Overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <h1 className="text-white text-lg font-semibold truncate">{title}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            ✕
          </Button>
        </div>

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="icon"
            onClick={togglePlay}
            className="w-16 h-16 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex items-center justify-between text-white text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => skipTime(-10)}
                className="text-white hover:bg-white/20"
              >
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => skipTime(10)}
                className="text-white hover:bg-white/20"
              >
                <SkipForward className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Indicator */}
      {isIntro && !isLoading && (
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          Intro
        </div>
      )}
    </div>
  )
} 