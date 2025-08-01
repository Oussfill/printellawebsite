
'use client';

import { CartProvider } from "@/context/CartProvider";
import Header from "@/components/layout/Header";
import { Toaster } from "@/components/ui/toaster";
import type { Locale } from "@/lib/types";

export default function Providers({
    children,
    lang,
    dictionary
}: {
    children: React.ReactNode;
    lang: Locale;
    dictionary: any;
}) {
    return (
        <CartProvider>
            <div className="relative flex min-h-dvh flex-col">
                <Header lang={lang} dictionary={dictionary} />
                <main className="flex-1">{children}</main>
            </div>
            <Toaster />
        </CartProvider>
    )
}
