
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { getAiSuggestions, getProductsForAi } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AISearch({
  lang,
  dictionary,
  onSearch,
}: {
  lang: string;
  dictionary: any;
  onSearch: (query: string) => void;
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [productCatalog, setProductCatalog] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery] = useDebounce(query, 500);

  useEffect(() => {
    async function fetchCatalog() {
      const products = await getProductsForAi();
      setProductCatalog(JSON.stringify(products));
    }
    fetchCatalog();
  }, []);

  const handleSuggestion = useCallback(async () => {
    if (debouncedQuery.length > 2 && productCatalog) {
      setIsLoading(true);
      const result = await getAiSuggestions(debouncedQuery, productCatalog);
      setSuggestions(result.searchQueries);
      setIsLoading(false);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, productCatalog]);

  useEffect(() => {
    handleSuggestion();
  }, [handleSuggestion]);
  
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setSuggestions([]);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
           <Input
            type="search"
            placeholder={dictionary.search_placeholder || 'Search...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 w-full"
            />
             {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
        </div>
      </form>
      {suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg">
          <p className="p-2 text-xs font-semibold text-muted-foreground">{dictionary.ai_suggestions}</p>
          <ul className="py-1">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="cursor-pointer px-3 py-2 hover:bg-accent"
                onClick={() => handleSuggestionClick(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
