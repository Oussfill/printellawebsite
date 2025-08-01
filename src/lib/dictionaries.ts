
const dictionaries: Record<string, () => Promise<any>> = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  ar: () => import('@/dictionaries/ar.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
    if (locale in dictionaries) {
        return dictionaries[locale]();
    }
    // Fallback to English if locale not found
    return dictionaries.en();
}
