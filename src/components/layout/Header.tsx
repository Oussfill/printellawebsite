
'use client'

import Link from 'next/link'
import { ShoppingCart, Menu } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/context/CartProvider'
import LanguageSwitcher from './LanguageSwitcher'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { HeaderSearch } from '../product/HeaderSearch'
import type { Locale } from '@/lib/types'
import Image from 'next/image';

function Logo() {
  return (
    <Image
    src="/images/2.svg"
    alt="Printella Logo"
    width={80}
    height={30}
    priority
  />
  );
}

interface HeaderProps {
  lang: Locale;
  dictionary: any;
}

export default function Header({ lang, dictionary }: HeaderProps) {
  const { cartCount } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        <div className="hidden md:flex">
          <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              href={`/${lang}`}
              className="flex items-center gap-2 font-headline text-lg font-semibold md:text-base"
            >
              <Logo />
               <span>
                <span className="text-primary">Printella</span>
              </span>
            </Link>
            <Link
              href={`/${lang}/`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {dictionary.home}
            </Link>
            <Link
              href={`/${lang}/products`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {dictionary.products}
            </Link>
          </nav>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side={lang === 'ar' ? 'right' : 'left'}>
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href={`/${lang}`}
                className="flex items-center gap-2 text-lg font-semibold font-headline"
              >
                <Logo />
                <span>
                  <span className="text-primary">prin</span>
                  <span className="text-foreground">tella</span>
                </span>
              </Link>
              <Link href={`/${lang}/`} className="text-muted-foreground hover:text-foreground">
                {dictionary.home}
              </Link>
              <Link
                href={`/${lang}/products`}
                className="text-muted-foreground hover:text-foreground"
              >
                {dictionary.products}
              </Link>
               <div className="md:hidden">
                 <HeaderSearch lang={lang} dictionary={dictionary} />
               </div>
            </nav>
          </SheetContent>
        </Sheet>
        
        <div className="hidden md:flex flex-1">
          <HeaderSearch lang={lang} dictionary={dictionary} />
        </div>

        <div className="flex items-center justify-end gap-2">
          <LanguageSwitcher lang={lang} />
          <Link href={`/${lang}/cart`}>
            <Button variant="ghost" size="icon" className="relative" aria-label={dictionary.cart}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge variant="default" className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs text-primary-foreground">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
