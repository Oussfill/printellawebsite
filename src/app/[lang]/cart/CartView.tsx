
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import type { Locale } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export default function CartView({ lang, dictionary }: { lang: Locale, dictionary: any }) {
  const { cartItems, updateQuantity, removeFromCart, cartCount, totalPrice } = useCart();

  if (cartCount === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-6 text-3xl font-bold font-headline">{dictionary.your_cart}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{dictionary.empty_cart}</p>
        <Button asChild size="lg" className="mt-8">
          <Link href={`/${lang}/products`}>{dictionary.continue_shopping}</Link>
        </Button>
      </div>
    );
  }
  
  const direction = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8" dir={direction}>
      <h1 className="mb-8 text-center font-headline text-4xl font-bold">{dictionary.your_cart}</h1>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <ul className="divide-y">
                {cartItems.map(({ product, quantity }) => {
                  const productName = product.name;
                  const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : 'https://placehold.co/120x120.png';
                  
                  return (
                    <li key={product._id} className="flex flex-col items-center gap-4 p-4 sm:flex-row">
                      <Image
                        src={imageUrl}
                        alt={productName}
                        width={120}
                        height={120}
                        className="h-32 w-32 rounded-lg object-cover"
                        data-ai-hint="custom print product"
                      />
                      <div className="flex-1 text-center sm:text-left">
                        <h2 className="font-headline text-xl font-semibold">
                          <Link href={`/${lang}/products/${product._id}`} className="hover:text-primary">
                            {productName}
                          </Link>
                        </h2>
                        <p className="mt-1 text-lg font-bold text-green-600">{formatPrice(product.price, lang)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => updateQuantity(product._id, quantity - 1)} disabled={quantity <= 1}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={quantity}
                          onChange={(e) => updateQuantity(product._id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button variant="outline" size="icon" onClick={() => updateQuantity(product._id, quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="w-24 text-center font-body text-lg font-semibold">{formatPrice(product.price * quantity, lang)}</p>
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(product._id)}>
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{dictionary.order_summary}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>{dictionary.subtotal}</span>
                  <span className="font-semibold">{formatPrice(totalPrice, lang)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>{dictionary.total}</span>
                  <span>{formatPrice(totalPrice, lang)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full">
                <Link href={`/${lang}/checkout`}>{dictionary.checkout}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
