
'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const PRODUCTS_PER_PAGE = 9;

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductGrid({
  lang,
  dictionary,
}: {
  lang: string;
  dictionary: any;
}) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentPage = Number(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search')?.toLowerCase();
  const categoryId = searchParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`https://printrella-backend.onrender.com/products`, { cache: 'no-store' });
        if (!res.ok) {
          console.error("Failed to fetch products, status:", res.status);
          setAllProducts([]);
          return;
        }
        const data = await res.json();
        setAllProducts(data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = !categoryId || categoryId === 'all' || product.proCategoryId?._id === categoryId;
    const matchesSearch = !searchQuery || product.name.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  if (isLoading) {
    return <ProductGridSkeleton />;
  }
  
  if (paginatedProducts.length === 0) {
     return <p className="text-center text-muted-foreground">{dictionary.no_products_found}</p>
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedProducts.map((product) => (
          <ProductCard key={product._id} product={product} lang={lang} dictionary={dictionary} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} aria-disabled={currentPage <= 1} className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                    <PaginationLink onClick={() => handlePageChange(i + 1)} isActive={currentPage === i + 1} className="cursor-pointer">{i + 1}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(currentPage + 1)} aria-disabled={currentPage >= totalPages} className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}/>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
