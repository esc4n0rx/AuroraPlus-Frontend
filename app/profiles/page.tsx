"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useProfiles } from "@/hooks/use-profiles"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProfileFormDialog } from "@/components/profile-form-dialog"
import { Plus, RefreshCw } from "lucide-react"
import Image from "next/image"
import { fixAvatarUrl } from "@/lib/utils"
import type { ProfileAPI, CreateProfileRequest, UpdateProfileRequest } from "@/types/profile"

export default function ProfilesPage() {
  const { user, setCurrentProfile, apiToken } = useAppStore()
  const router = useRouter()
  const { 
    profiles, 
    isLoading, 
    error, 
    createProfile, 
    updateProfile, 
    deleteProfile, 
    loadProfiles,
    clearError 
  } = useProfiles()

  const [profileFormOpen, setProfileFormOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<ProfileAPI | null>(null)

  console.log('=== PROFILES PAGE DEBUG ===')
  console.log('User:', user)
  console.log('API Token:', apiToken)
  console.log('Profiles from hook:', profiles)
  console.log('Is loading:', isLoading)
  console.log('Error:', error)

  useEffect(() => {
    console.log('Profiles page mounted')
    if (!user || !apiToken) {
      console.log('No user or token, redirecting to auth')
      router.push("/auth")
    } else {
      console.log('User and token available, loading profiles...')
    }
  }, [user, apiToken, router])

  if (!user || !apiToken) {
    console.log('Rendering null - no user or token')
    return null
  }

  const handleSelectProfile = (profile: ProfileAPI) => {
    console.log('Profile selected:', profile)
    setCurrentProfile({
      id: profile.id,
      name: profile.nome,
      avatar: profile.avatarUrl,
      type: profile.tipo
    })
    router.push("/home")
  }

  const handleCreateProfile = () => {
    console.log('Opening create profile dialog')
    setEditingProfile(null)
    setProfileFormOpen(true)
  }

  const handleEditProfile = (profile: ProfileAPI) => {
    console.log('Opening edit profile dialog for:', profile)
    setEditingProfile(profile)
    setProfileFormOpen(true)
  }

  const handleProfileSubmit = async (data: CreateProfileRequest | UpdateProfileRequest) => {
    console.log('Profile form submitted:', data)
    try {
      if (editingProfile) {
        console.log('Updating profile:', editingProfile.id)
        await updateProfile(editingProfile.id, data as UpdateProfileRequest)
      } else {
        console.log('Creating new profile')
        await createProfile(data as CreateProfileRequest)
      }
      setProfileFormOpen(false)
      setEditingProfile(null)
    } catch (error) {
      console.error('Error in profile submit:', error)
      // Error is handled by the hook
      throw error
    }
  }

  const handleRefresh = () => {
    console.log('Refreshing profiles')
    clearError()
    loadProfiles()
  }

  const canAddProfile = profiles.length < 5

  console.log('Rendering profiles page with', profiles.length, 'profiles')

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Quem está assistindo?</h1>
          <p className="text-muted-foreground">Selecione um perfil para continuar</p>
        </div>

        {error && (
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="ml-2"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-muted" />
                  <div className="h-4 bg-muted rounded mx-auto w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : profiles.length === 0 && !error ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Nenhum perfil encontrado</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Recarregar
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {profiles.map((profile) => (
              <Card
                key={profile.id}
                className="cursor-pointer hover:scale-105 transition-transform border-2 hover:border-primary group"
                onClick={() => handleSelectProfile(profile)}
              >
                <CardContent className="p-6 text-center space-y-4 relative">
                  <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden bg-muted">
                    <Image 
                      src={fixAvatarUrl(profile.avatarUrl) || "/placeholder.svg"} 
                      alt={profile.nome} 
                      fill 
                      className="object-cover" 
                    />
                    {profile.hasPassword && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                          <span className="text-xs">🔒</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-foreground">{profile.nome}</h3>
                    {profile.tipo === 'kids' && (
                      <span className="text-xs text-muted-foreground">Kids</span>
                    )}
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 bg-white/90 hover:bg-white text-black"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditProfile(profile)
                      }}
                    >
                      <span className="text-xs">✏️</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {canAddProfile && (
              <Card 
                className="cursor-pointer hover:scale-105 transition-transform border-2 border-dashed hover:border-primary"
                onClick={handleCreateProfile}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-muted-foreground">Adicionar Perfil</h3>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!canAddProfile && profiles.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Limite máximo de 5 perfis atingido
          </p>
        )}

        <ProfileFormDialog
          profile={editingProfile}
          open={profileFormOpen}
          onClose={() => {
            console.log('Closing profile form dialog')
            setProfileFormOpen(false)
            setEditingProfile(null)
            clearError()
          }}
          onSubmit={handleProfileSubmit}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  )
}
