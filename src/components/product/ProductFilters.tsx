
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import AISearch from './AISearch';
import { Card, CardContent } from '../ui/card';

export default function ProductFilters({
  categories,
  dictionary,
  lang,
}: {
  categories: Category[];
  dictionary: any;
  lang: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [name, value] of Object.entries(paramsToUpdate)) {
        if (value === null || (typeof value === 'string' && value === '')) {
          params.delete(name);
        } else {
          params.set(name, String(value));
        }
      }
      return params.toString();
    },
    [searchParams]
  );
  
  const handleSearch = (query: string) => {
    router.push(pathname + '?' + createQueryString({ search: query, page: null }));
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const newQuery = createQueryString({ category: categoryId === 'all' ? null : categoryId, page: null });
    router.push(`${pathname}?${newQuery}`);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    router.push(pathname);
  };
  
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
  }, [searchParams]);

  return (
    <Card className="sticky top-24 border-0 bg-transparent shadow-none">
      <CardContent className="p-0 space-y-8">
        <div>
          <h3 className="mb-4 text-xl font-bold font-headline">{dictionary.search || "Search"}</h3>
          <AISearch lang={lang} dictionary={dictionary} onSearch={handleSearch} />
        </div>
        
        <div>
          <h3 className="mb-4 text-xl font-bold font-headline">{dictionary.categories}</h3>
          <RadioGroup value={selectedCategory} onValueChange={handleCategoryChange} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="cat-all" />
              <Label htmlFor="cat-all" className="cursor-pointer">{dictionary.all_categories}</Label>
            </div>
            {categories.map((category) => (
              <div key={category._id} className="flex items-center space-x-2">
                <RadioGroupItem value={category._id} id={`cat-${category._id}`} />
                <Label htmlFor={`cat-${category._id}`} className="cursor-pointer">{category.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Button onClick={clearFilters} variant="outline" className="w-full">{dictionary.clear_filters}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
