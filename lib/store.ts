import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  email: string
  profiles: Profile[]
  currentProfile?: Profile
}

interface Profile {
  id: string
  name: string
  avatar: string
}

export interface Content {
  id: string
  title: string
  image: string
  type: "movie" | "series" | "sport" | "live"
  category: string
  badge?: string
  description?: string
}

interface AppState {
  user: User | null
  theme: "dark" | "light"
  myList: Content[]
  downloads: Content[]
  setUser: (user: User | null) => void
  setCurrentProfile: (profile: Profile) => void
  toggleTheme: () => void
  addToMyList: (content: Content) => void
  removeFromMyList: (contentId: string) => void
  addToDownloads: (content: Content) => void
  removeFromDownloads: (contentId: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      theme: "dark",
      myList: [],
      downloads: [],
      setUser: (user) => set({ user }),
      setCurrentProfile: (profile) =>
        set((state) => ({
          user: state.user ? { ...state.user, currentProfile: profile } : null,
        })),
      toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
      addToMyList: (content) =>
        set((state) => ({
          myList: [...state.myList.filter((item) => item.id !== content.id), content],
        })),
      removeFromMyList: (contentId) =>
        set((state) => ({
          myList: state.myList.filter((item) => item.id !== contentId),
        })),
      addToDownloads: (content) =>
        set((state) => ({
          downloads: [...state.downloads.filter((item) => item.id !== content.id), content],
        })),
      removeFromDownloads: (contentId) =>
        set((state) => ({
          downloads: state.downloads.filter((item) => item.id !== contentId),
        })),
    }),
    {
      name: "aurora-storage",
    },
  ),
)
