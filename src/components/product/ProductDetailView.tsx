
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartProvider';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from '@/lib/utils';
import type { Locale } from '@/lib/types';

export default function ProductDetailView({
  product,
  lang,
  dictionary,
}: {
  product: Product;
  lang: Locale;
  dictionary: any;
}) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const productName = product.name;
  const productDescription = product.description;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const direction = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12" dir={direction}>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((img, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden border-0 shadow-lg">
                    <CardContent className="flex aspect-square items-center justify-center p-0">
                      <Image
                        src={img.url}
                        alt={`${productName} - image ${index + 1}`}
                        width={600}
                        height={600}
                        className="h-full w-full object-contain"
                        data-ai-hint="custom print product"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="font-headline text-4xl font-bold leading-tight">{productName}</h1>
          <p className="mt-4 text-3xl font-bold text-green-600">{formatPrice(product.price, lang)}</p>
          <div 
            className="prose prose-lg mt-6 max-w-none text-muted-foreground" 
            dangerouslySetInnerHTML={{ __html: productDescription }} 
          />

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-md border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-lg font-bold">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" onClick={handleAddToCart}>
              <ShoppingCart className={`h-5 w-5 ${lang === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {dictionary.add_to_cart}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
