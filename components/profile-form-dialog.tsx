"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AvatarSelector } from './avatar-selector'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ProfileAPI, CreateProfileRequest, UpdateProfileRequest, Avatar } from '@/types/profile'

interface ProfileFormDialogProps {
  profile?: ProfileAPI | null
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateProfileRequest | UpdateProfileRequest) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export function ProfileFormDialog({ 
  profile, 
  open, 
  onClose, 
  onSubmit, 
  isLoading = false,
  error 
}: ProfileFormDialogProps) {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'normal' as 'normal' | 'kids',
    avatar: 'default.png',
    senha: '',
    ordem: 1,
    hasPassword: false
  })
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null)

  const isEditing = !!profile

  useEffect(() => {
    if (profile) {
      setFormData({
        nome: profile.nome,
        tipo: profile.tipo,
        avatar: profile.avatar,
        senha: '',
        ordem: profile.ordem,
        hasPassword: !!profile.hasPassword
      })
    } else {
      setFormData({
        nome: '',
        tipo: 'normal',
        avatar: 'default.png',
        senha: '',
        ordem: 1,
        hasPassword: false
      })
    }
    setSelectedAvatar(null)
  }, [profile, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitData: CreateProfileRequest | UpdateProfileRequest = {
      nome: formData.nome,
      ...(selectedAvatar && { avatar: selectedAvatar.filename }),
      ...(formData.hasPassword && formData.senha && { senha: formData.senha }),
      ...(!formData.hasPassword && isEditing && { senha: null }),
      ordem: formData.ordem
    }

    if (!isEditing) {
      (submitData as CreateProfileRequest).tipo = formData.tipo
    }

    await onSubmit(submitData)
  }

  const handleClose = () => {
    setFormData({
      nome: '',
      tipo: 'normal',
      avatar: 'default.png',
      senha: '',
      ordem: 1,
      hasPassword: false
    })
    setSelectedAvatar(null)
    onClose()
  }

  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Perfil' : 'Criar Novo Perfil'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
              <TabsTrigger value="avatar">Avatar</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Perfil</Label>
                <Input
                  id="nome"
                  placeholder="Digite o nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  disabled={isLoading}
                  maxLength={50}
                  required
                />
              </div>

              {!isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Perfil</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value: 'normal' | 'kids') => 
                      setFormData(prev => ({ ...prev, tipo: value }))
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="kids">Kids</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="ordem">Ordem de Exibição</Label>
                <Input
                  id="ordem"
                  type="number"
                  min={1}
                  max={5}
                  value={formData.ordem}
                  onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 1 }))}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Proteger com Senha</Label>
                  <p className="text-sm text-muted-foreground">
                    Adicione uma senha para proteger este perfil
                  </p>
                </div>
                <Switch
                  checked={formData.hasPassword}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, hasPassword: checked, senha: checked ? prev.senha : '' }))
                  }
                  disabled={isLoading}
                />
              </div>

              {formData.hasPassword && (
                <div className="space-y-2">
                  <Label htmlFor="senha">
                    {isEditing ? 'Nova Senha (deixe vazio para manter atual)' : 'Senha do Perfil'}
                  </Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Digite uma senha (4-20 caracteres)"
                    value={formData.senha}
                    onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                    disabled={isLoading}
                    minLength={4}
                    maxLength={20}
                    required={!isEditing}
                  />
                </div>
              )}

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </TabsContent>

            <TabsContent value="avatar">
              <AvatarSelector
                selectedAvatar={selectedAvatar?.filename || formData.avatar}
                onAvatarSelect={handleAvatarSelect}
              />
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-4">
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
              disabled={isLoading || !formData.nome.trim()}
              className="flex-1"
            >
              {isLoading ? 'Salvando...' : (isEditing ? 'Salvar' : 'Criar Perfil')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}