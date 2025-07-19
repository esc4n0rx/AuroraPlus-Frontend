"use client"

import { useState } from "react"
import { mockContent } from "@/lib/data"
import { Navbar } from "@/components/navbar"
import { ContentCard } from "@/components/content-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const filteredContent = mockContent.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === "all" || item.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  const filters = [
    { value: "all", label: "Todos" },
    { value: "movie", label: "Filmes" },
    { value: "series", label: "Séries" },
    { value: "sport", label: "Esportes" },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Buscar</h1>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar filmes, séries, esportes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={selectedFilter === filter.value ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedFilter(filter.value)}
                className={cn(
                  "whitespace-nowrap",
                  selectedFilter === filter.value
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                )}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {searchQuery ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Resultados para "{searchQuery}" ({filteredContent.length})
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredContent.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>

            {filteredContent.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum resultado encontrado</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Populares</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockContent.slice(0, 8).map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Navbar />
    </div>
  )
}
