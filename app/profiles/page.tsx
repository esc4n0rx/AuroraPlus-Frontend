"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Image from "next/image"

export default function ProfilesPage() {
  const { user, setCurrentProfile } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleSelectProfile = (profile: any) => {
    setCurrentProfile(profile)
    router.push("/home")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Quem está assistindo?</h1>
          <p className="text-muted-foreground">Selecione um perfil para continuar</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          {user.profiles.map((profile) => (
            <Card
              key={profile.id}
              className="cursor-pointer hover:scale-105 transition-transform border-2 hover:border-primary"
              onClick={() => handleSelectProfile(profile)}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden bg-muted">
                  <Image src={profile.avatar || "/placeholder.svg"} alt={profile.name} fill className="object-cover" />
                </div>
                <h3 className="font-medium text-foreground">{profile.name}</h3>
              </CardContent>
            </Card>
          ))}

          <Card className="cursor-pointer hover:scale-105 transition-transform border-2 border-dashed hover:border-primary">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-muted-foreground">Adicionar Perfil</h3>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
