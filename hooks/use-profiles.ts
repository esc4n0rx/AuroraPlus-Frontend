import { useState, useCallback, useEffect } from 'react';
import { profilesAPI } from '@/lib/api/profiles';
import { useAppStore } from '@/lib/store';
import type { ProfileAPI, CreateProfileRequest, UpdateProfileRequest, Avatar } from '@/types/profile';

export function useProfiles() {
  const [profiles, setProfiles] = useState<ProfileAPI[]>([]);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUserProfiles } = useAppStore();

  const loadProfiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedProfiles = await profilesAPI.getProfiles();
      setProfiles(fetchedProfiles);
      setUserProfiles(fetchedProfiles.map(p => ({
        id: p.id,
        name: p.nome,
        avatar: p.avatarUrl,
        type: p.tipo
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfis');
    } finally {
      setIsLoading(false);
    }
  }, [setUserProfiles]);

  const createProfile = useCallback(async (profileData: CreateProfileRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newProfile = await profilesAPI.createProfile(profileData);
      setProfiles(prev => [...prev, newProfile].sort((a, b) => a.ordem - b.ordem));
      return newProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar perfil');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (id: string, profileData: UpdateProfileRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await profilesAPI.updateProfile(id, profileData);
      setProfiles(prev => prev.map(p => p.id === id ? updatedProfile : p).sort((a, b) => a.ordem - b.ordem));
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProfile = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await profilesAPI.deleteProfile(id);
      setProfiles(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover perfil');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const authenticateProfile = useCallback(async (id: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const authenticatedProfile = await profilesAPI.authenticateProfile(id, password);
      return authenticatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Senha incorreta');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAvatars = useCallback(async (page: number = 1, limit: number = 20) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const avatarsResponse = await profilesAPI.getAvatars(page, limit);
      if (page === 1) {
        setAvatars(avatarsResponse.avatars);
      } else {
        setAvatars(prev => [...prev, ...avatarsResponse.avatars]);
      }
      return avatarsResponse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar avatares');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  return {
    profiles,
    avatars,
    isLoading,
    error,
    loadProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
    authenticateProfile,
    loadAvatars,
    clearError: () => setError(null)
  };
}