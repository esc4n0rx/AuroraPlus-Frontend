"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfiles } from '@/hooks/use-profiles'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import type { Avatar } from '@/types/profile'

interface AvatarSelectorProps {
  selectedAvatar?: string
  onAvatarSelect: (avatar: Avatar) => void
  className?: string
}

export function AvatarSelector({ selectedAvatar, onAvatarSelect, className }: AvatarSelectorProps) {
  const { avatars, isLoading, loadAvatars } = useProfiles()
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadAvatars(1, 20).then((response) => {
      setHasMore(response.pagination.hasNext)
    })
  }, [loadAvatars])

  const loadMoreAvatars = async () => {
    const nextPage = page + 1
    try {
      const response = await loadAvatars(nextPage, 20)
      setPage(nextPage)
      setHasMore(response.pagination.hasNext)
    } catch (error) {
      console.error('Erro ao carregar mais avatares:', error)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold text-foreground">Escolha um avatar</h3>
      
      <ScrollArea className="h-80 w-full">
        <div className="grid grid-cols-4 gap-3 p-1">
          {avatars.map((avatar) => (
            <button
              key={avatar.filename}
              onClick={() => onAvatarSelect(avatar)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 transition-colors hover:border-primary",
                selectedAvatar === avatar.filename ? "border-primary ring-2 ring-primary/20" : "border-border"
              )}
            >
              <Image
                src={avatar.url}
                alt="Avatar"
                fill
                className="object-cover"
                sizes="80px"
              />
              {avatar.isDefault && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
              )}
            </button>
          ))}
          
          {isLoading && Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
        
        {hasMore && !isLoading && (
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={loadMoreAvatars}>
              Carregar mais avatares
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}