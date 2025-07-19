"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock } from 'lucide-react'
import type { ProfileAPI } from '@/types/profile'

interface ProfilePasswordDialogProps {
  profile: ProfileAPI | null
  open: boolean
  onClose: () => void
  onAuthenticate: (password: string) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export function ProfilePasswordDialog({ 
  profile, 
  open, 
  onClose, 
  onAuthenticate, 
  isLoading = false,
  error 
}: ProfilePasswordDialogProps) {
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.trim()) {
      await onAuthenticate(password)
      setPassword('')
    }
  }

  const handleClose = () => {
    setPassword('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <DialogTitle>Perfil Protegido</DialogTitle>
          <DialogDescription>
            Digite a senha para acessar o perfil "{profile?.nome}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Senha do Perfil</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="flex-1"
            >
              {isLoading ? 'Verificando...' : 'Entrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}