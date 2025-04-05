import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LanguageState {
  currentLang: string
  setLanguage: (lang: string) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLang: 'en',
      setLanguage: (lang) => {
        set({ currentLang: lang })
        document.cookie = `language-storage=${JSON.stringify({ state: { currentLang: lang } })}; path=/`
      },
    }),
    {
      name: 'language-storage',
    }
  )
)