"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useProfiles } from "@/hooks/use-profiles"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProfilePasswordDialog } from "@/components/profile-password-dialog"
import { ProfileFormDialog } from "@/components/profile-form-dialog"
import { Plus, Settings, Trash2 } from "lucide-react"
import Image from "next/image"
import type { ProfileAPI, CreateProfileRequest, UpdateProfileRequest } from "@/types/profile"

export default function ProfilesPage() {
  const { user, setCurrentProfile } = useAppStore()
  const router = useRouter()
  const { 
    profiles, 
    isLoading, 
    error, 
    createProfile, 
    updateProfile, 
    deleteProfile, 
    authenticateProfile,
    clearError 
  } = useProfiles()

  const [selectedProfile, setSelectedProfile] = useState<ProfileAPI | null>(null)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [profileFormOpen, setProfileFormOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<ProfileAPI | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/auth")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleSelectProfile = async (profile: ProfileAPI) => {
    if (profile.hasPassword) {
      setSelectedProfile(profile)
      setPasswordDialogOpen(true)
    } else {
      setCurrentProfile({
        id: profile.id,
        name: profile.nome,
        avatar: profile.avatarUrl,
        type: profile.tipo
      })
      router.push("/home")
    }
  }

  const handleProfileAuth = async (password: string) => {
    if (!selectedProfile) return

    try {
      setAuthError(null)
      await authenticateProfile(selectedProfile.id, password)
      setCurrentProfile({
        id: selectedProfile.id,
        name: selectedProfile.nome,
        avatar: selectedProfile.avatarUrl,
        type: selectedProfile.tipo
      })
      setPasswordDialogOpen(false)
      setSelectedProfile(null)
      router.push("/home")
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Erro na autenticação')
    }
  }

  const handleCreateProfile = () => {
    setEditingProfile(null)
    setProfileFormOpen(true)
  }

  const handleEditProfile = (profile: ProfileAPI) => {
    setEditingProfile(profile)
    setProfileFormOpen(true)
  }

  const handleProfileSubmit = async (data: CreateProfileRequest | UpdateProfileRequest) => {
    try {
      if (editingProfile) {
        await updateProfile(editingProfile.id, data as UpdateProfileRequest)
      } else {
        await createProfile(data as CreateProfileRequest)
      }
      setProfileFormOpen(false)
      setEditingProfile(null)
    } catch (error) {
      // Error is handled by the hook
      throw error
    }
  }

  const handleDeleteProfile = async (profile: ProfileAPI) => {
    if (confirm(`Tem certeza que deseja remover o perfil "${profile.nome}"?`)) {
      try {
        await deleteProfile(profile.id)
      } catch (error) {
        // Error is handled by the hook
      }
    }
  }

  const canAddProfile = profiles.length < 5

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Quem está assistindo?</h1>
          <p className="text-muted-foreground">Selecione um perfil para continuar</p>
        </div>

        {error && (
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertDescription>{error}</AlertDescription>
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
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {profiles.map((profile) => (
              <Card
                key={profile.id}
                className="cursor-pointer hover:scale-105 transition-transform border-2 hover:border-primary group"
              >
                <CardContent className="p-6 text-center space-y-4 relative">
                  <div 
                    className="relative w-20 h-20 mx-auto rounded-full overflow-hidden bg-muted"
                    onClick={() => handleSelectProfile(profile)}
                  >
                    <Image 
                      src={profile.avatarUrl || "/placeholder.svg"} 
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
                  
                  <div onClick={() => handleSelectProfile(profile)}>
                    <h3 className="font-medium text-foreground">{profile.nome}</h3>
                    {profile.tipo === 'kids' && (
                      <span className="text-xs text-muted-foreground">Kids</span>
                    )}
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 bg-white/90 hover:bg-white text-black"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditProfile(profile)
                      }}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 bg-white/90 hover:bg-red-100 text-red-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteProfile(profile)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
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

        {!canAddProfile && (
          <p className="text-sm text-muted-foreground">
            Limite máximo de 5 perfis atingido
          </p>
        )}

        <ProfilePasswordDialog
          profile={selectedProfile}
          open={passwordDialogOpen}
          onClose={() => {
            setPasswordDialogOpen(false)
            setSelectedProfile(null)
            setAuthError(null)
          }}
          onAuthenticate={handleProfileAuth}
          isLoading={isLoading}
          error={authError}
        />

        <ProfileFormDialog
          profile={editingProfile}
          open={profileFormOpen}
          onClose={() => {
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