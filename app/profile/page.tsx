"use client"

import { useAppStore } from "@/lib/store"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Settings, Bell, Download, HelpCircle, LogOut, Moon, Sun, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, theme, toggleTheme, setUser } = useAppStore()
  const router = useRouter()

  const handleLogout = () => {
    setUser(null)
    router.push("/")
  }

  if (!user?.currentProfile) {
    return null
  }

  const menuItems = [
    { icon: User, label: "Gerenciar Perfis", href: "/profiles" },
    { icon: Settings, label: "Configurações da Conta", href: "#" },
    { icon: Bell, label: "Notificações", href: "#" },
    { icon: Download, label: "Configurações de Download", href: "#" },
    { icon: HelpCircle, label: "Ajuda e Suporte", href: "#" },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted">
                <Image
                  src={user.currentProfile.avatar || "/placeholder.svg"}
                  alt={user.currentProfile.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-foreground">{user.currentProfile.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aparência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Sun className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-foreground">Tema Escuro</p>
                  <p className="text-sm text-muted-foreground">{theme === "dark" ? "Ativado" : "Desativado"}</p>
                </div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={item.label}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-auto p-4 rounded-none"
                    onClick={() => item.href !== "#" && router.push(item.href)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  {index < menuItems.length - 1 && <Separator />}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-0">
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-4 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sair da Conta
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>Aurora Streaming v1.0.0</p>
          <p>© 2024 Aurora. Todos os direitos reservados.</p>
        </div>
      </div>

      <Navbar />
    </div>
  )
}
