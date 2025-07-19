"use client"

import { useAppStore } from "@/lib/store"
import { Navbar } from "@/components/navbar"
import { ContentCard } from "@/components/content-card"

export default function MyListPage() {
  const { myList } = useAppStore()

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Minha Lista</h1>
          <p className="text-muted-foreground">
            {myList.length} {myList.length === 1 ? "item" : "itens"} salvos
          </p>
        </div>

        {myList.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {myList.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="text-6xl">📺</div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Sua lista está vazia</h3>
              <p className="text-muted-foreground">Adicione filmes e séries à sua lista para assistir depois</p>
            </div>
          </div>
        )}
      </div>

      <Navbar />
    </div>
  )
}
