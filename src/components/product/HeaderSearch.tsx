
'use client'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import type { Locale } from '@/lib/types'

export function HeaderSearch({ lang, dictionary }: { lang: Locale, dictionary: any }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('search') || '')

  useEffect(() => {
    
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newPath = `/${lang}/products?search=${encodeURIComponent(query)}`;
    router.push(newPath)
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-sm ml-auto">
      <Input
        type="search"
        name="search"
        placeholder={dictionary.search_placeholder || "Search products..."}
        className="pl-10 text-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
    </form>
  )
}
