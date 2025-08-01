
import { Suspense } from 'react';
import { getDictionary } from '@/lib/dictionaries';
import { Product } from '@/lib/types';
import { notFound } from 'next/navigation';
import ProductDetailView from '@/components/product/ProductDetailView';
import { Skeleton } from '@/components/ui/skeleton';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`https://printrella-backend.onrender.com/products/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      if (res.status === 404) return null;
      console.error("Failed to fetch product, status:", res.status);
      return null;
    }
    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string, lang: string } }) {
  const product = await getProduct(params.id);
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }
  return {
    title: product.name,
    description: product.description,
  };
}

function ProductDetailSkeleton() {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <div className="mt-4 grid grid-cols-4 gap-4">
                        <Skeleton className="aspect-square w-full rounded-lg" />
                        <Skeleton className="aspect-square w-full rounded-lg" />
                        <Skeleton className="aspect-square w-full rounded-lg" />
                        <Skeleton className="aspect-square w-full rounded-lg" />
                    </div>
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-32" />
                        <Skeleton className="h-12 w-48" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default async function ProductDetailPage({ params }: { params: { id: string; lang: string } }) {
  const { id, lang } = params;
  const product = await getProduct(id);
  const dictionary = await getDictionary(lang);

  if (!product) {
    notFound();
  }

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailView product={product} lang={lang} dictionary={dictionary} />
    </Suspense>
  );
}
