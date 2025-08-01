
import { Suspense } from 'react';
import { getDictionary } from '@/lib/dictionaries';
import { Category } from '@/lib/types';
import ProductFilters from '@/components/product/ProductFilters';
import ProductGrid from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch('https://printrella-backend.onrender.com/categories', { next: { revalidate: 3600 } });
    if (!res.ok) {
        console.error("Failed to fetch categories, status:", res.status);
        return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

function FiltersSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
    )
}

function ProductsPageContent({ lang, dictionary, categories }: { lang: string, dictionary: any, categories: Category[]}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="hidden md:col-span-1 md:block">
          <Suspense fallback={<FiltersSkeleton />}>
            <ProductFilters categories={categories} dictionary={dictionary} lang={lang} />
          </Suspense>
        </aside>

        <main className="md:col-span-3">
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <h1 className="font-headline text-4xl font-bold">{dictionary.products}</h1>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4" />
                    <span className="mx-2">{dictionary.filters}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side={lang === 'ar' ? 'right' : 'left'}>
                   <Suspense fallback={<FiltersSkeleton />}>
                    <ProductFilters categories={categories} dictionary={dictionary} lang={lang} />
                   </Suspense>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <ProductGrid 
              lang={lang} 
              dictionary={dictionary} 
          />
        </main>
      </div>
    </div>
  );
}

export default async function ProductsPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = await getDictionary(lang);
  const categories = await getCategories();

  return <ProductsPageContent lang={lang} dictionary={dictionary} categories={categories} />
}
