
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/context/CartProvider'
import { formatPrice } from '@/lib/utils'

type ProductCardProps = {
  product: Product;
  lang: string;
  dictionary: any;
}

export function ProductCard({ product, lang, dictionary }: ProductCardProps) {
  const { addToCart } = useCart()
  const productName = product.name;
  
  const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : 'https://placehold.co/400x400.png';

  const handleAddToCart = () => {
    addToCart(product, 1);
  }

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden rounded-lg border-0 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-lg">
      <CardHeader className="p-0 border-b">
        <Link href={`/${lang}/products/${product._id}`} className="block overflow-hidden">
          <div className="aspect-square w-full">
             <Image
              src={imageUrl}
              alt={productName}
              width={400}
              height={400}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              data-ai-hint="custom print product"
            />
          </div>
        </Link>
      </CardHeader>
      <div className='flex flex-col flex-grow bg-card'>
        <CardContent className="flex-grow p-4">
          <Link href={`/${lang}/products/${product._id}`} className="block">
              <CardTitle className="font-headline text-lg leading-tight hover:text-primary">
                {productName}
              </CardTitle>
          </Link>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <p className="font-body text-xl font-bold text-green-600">
            {formatPrice(product.price, lang)}
          </p>
          <Button size="icon" variant="outline" onClick={handleAddToCart} aria-label={dictionary.add_to_cart}>
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}
