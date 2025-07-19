"use client"

import { useAppStore } from "@/lib/store"
import { Navbar } from "@/components/navbar"
import { ContentCard } from "@/components/content-card"
import { Button } from "@/components/ui/button"
import { Download, Wifi } from "lucide-react"

export default function DownloadsPage() {
  const { downloads } = useAppStore()

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Downloads</h1>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-foreground">Wi-Fi conectado</span>
            </div>
            <p className="text-sm text-muted-foreground">Downloads automáticos habilitados quando conectado ao Wi-Fi</p>
          </div>
        </div>

        {downloads.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Conteúdo baixado ({downloads.length})</h2>
              <Button variant="outline" size="sm">
                Gerenciar
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {downloads.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="text-6xl">⬇️</div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Nenhum download</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Baixe filmes e séries para assistir offline, mesmo sem conexão com a internet
              </p>
            </div>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Explorar conteúdo
            </Button>
          </div>
        )}
      </div>

      <Navbar />
    </div>
  )
}
