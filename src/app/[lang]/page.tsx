import Link from 'next/link';
import Image from 'next/image';
import { getDictionary } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { Product, Category } from '@/lib/types';
import { ProductCard } from '@/components/product/ProductCard';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`https://printrella-backend.onrender.com/products?limit=8&page=1`, { next: { revalidate: 3600 } });
    if (!res.ok) {
        console.error("Failed to fetch featured products, status:", res.status);
        return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

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

function FeaturedProducts({ lang, dictionary, products }: { lang: string; dictionary: any, products: Product[] }) {
  if (products.length === 0) {
    return <p className="text-center text-muted-foreground">Could not load featured products.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map(product => (
        <ProductCard key={product._id} product={product} lang={lang} dictionary={dictionary} />
      ))}
    </div>
  );
}

function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
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

function CategoriesSection({ lang, dictionary, categories }: { lang: string, dictionary: any, categories: Category[] }) {
    if (categories.length === 0) {
        return null;
    }

    return (
        <section className="py-8 bg-secondary">
            <div className="container">
                <h2 className="mb-6 text-center font-headline text-3xl font-bold md:text-4xl">
                    {dictionary.categories}
                </h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {categories.map(category => (
                        <Link key={category._id} href={`/${lang}/products?category=${category._id}`} className="group text-center">
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-background shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                {category.image !== 'no_url' ? (
                                    <Image
                                        src={`https://printrella-backend.onrender.com/${category.image}`}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        data-ai-hint="printing category"
                                    />
                                ) : (
                                   <div className="flex items-center justify-center w-full h-full p-2">
                                        <h3 className="font-headline text-lg font-semibold text-muted-foreground">
                                            {category.name}
                                        </h3>
                                   </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <h3 className="font-headline text-lg font-semibold text-white p-2 text-center">
                                        {category.name}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}


function HomePageContent({ lang, dictionary, featuredProducts, categories }: { lang: string, dictionary: any, featuredProducts: Product[], categories: Category[] }) {
  return (
    <div className="flex flex-col">
      <section className="relative w-full bg-primary/20 py-20 md:py-32">
        <div className="absolute inset-0">
          <Image
            src="https://t4.ftcdn.net/jpg/10/13/82/55/240_F_1013825572_SYT88juzJQhO7rVXjlGrJ1PN6ejMDhTD.jpg"
            alt="Hero background"
            fill
            quality={100}
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="container relative z-10 flex flex-col items-center justify-center text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {dictionary.hero_title}
          </h1>
          <p className="mt-4 max-w-2xl font-body text-lg  text-white/90 md:text-xl">
            {dictionary.hero_subtitle}
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus:scale-105 focus:ring-2 focus:ring-primary/50 active:scale-100">
            <Link href={`/${lang}/products`}>
              {dictionary.shop_now}
              <ArrowRight className={`h-5 w-5 ${lang === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Link>
          </Button>
        </div>
      </section>

      <CategoriesSection lang={lang} dictionary={dictionary} categories={categories} />

      <section className="py-12 md:py-24 bg-background">
        <div className="container">
          <h2 className="mb-8 text-center font-headline text-3xl font-bold md:text-4xl">
            {dictionary.featured_products}
          </h2>
          <Suspense fallback={<FeaturedProductsSkeleton />}>
            <FeaturedProducts lang={lang} dictionary={dictionary} products={featuredProducts} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}


export default async function HomePage({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = await getDictionary(lang);
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();

  return <HomePageContent lang={lang} dictionary={dictionary} featuredProducts={featuredProducts} categories={categories} />;
}
