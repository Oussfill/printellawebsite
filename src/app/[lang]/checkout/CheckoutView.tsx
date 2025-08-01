
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/context/CartProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { placeOrder } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { Locale } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

export default function CheckoutView({ lang, dictionary }: { lang: Locale, dictionary: any }) {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const FormSchema = z.object({
    fullName: z.string().min(2, { message: dictionary.validation_min_2_chars || 'Must be at least 2 characters.' }),
    email: z.string().email({ message: dictionary.validation_invalid_email || 'Invalid email address.' }),
    phone: z.string().min(8, { message: dictionary.validation_min_8_chars || 'Must be at least 8 characters.' }),
    street: z.string().min(5, { message: dictionary.validation_min_5_chars || 'Must be at least 5 characters.' }),
    city: z.string().min(2, { message: dictionary.validation_min_2_chars || 'Must be at least 2 characters.' }),
    state: z.string().min(2, { message: dictionary.validation_min_2_chars || 'Must be at least 2 characters.' }),
    postalCode: z.string().min(4, { message: dictionary.validation_min_4_chars || 'Must be at least 4 characters.' }),
    country: z.string().min(2, { message: dictionary.validation_min_2_chars || 'Must be at least 2 characters.' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: '', email: '', phone: '', street: '', city: '', state: '', postalCode: '', country: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    try {
      // The paymentMethod is now hardcoded in the action
      await placeOrder(data, cartItems, totalPrice, lang);
      clearCart();
      // Redirect is handled by the server action
    } catch (error) {
      toast({
        variant: "destructive",
        title: dictionary.error_title || "Error",
        description: dictionary.error_placing_order || "There was a problem with your request.",
      });
      setIsSubmitting(false);
    }
  }
  
  useEffect(() => {
    if (cartItems.length === 0 && !isSubmitting) {
      router.push(`/${lang}/products`);
    }
  }, [cartItems, lang, router, isSubmitting]);

  if (cartItems.length === 0) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }
  
  const direction = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="bg-muted/20" dir={direction}>
        <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">{dictionary.checkout}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{dictionary.checkout_subtitle || 'Please fill in your details to complete your purchase.'}</p>
        </div>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-2">
            
            <div className="space-y-8">
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">{dictionary.shipping_address}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <FormField control={form.control} name="fullName" render={({ field }) => (
                                <FormItem><FormLabel>{dictionary.full_name}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>{dictionary.email_address}</FormLabel><FormControl><Input {...field} type="email" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>{dictionary.phone_number}</FormLabel><FormControl><Input {...field} type="tel" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="sm:col-span-2">
                            <FormField control={form.control} name="street" render={({ field }) => (
                                <FormItem><FormLabel>{dictionary.street_address}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                         <FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem><FormLabel>{dictionary.city}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="state" render={({ field }) => (
                            <FormItem><FormLabel>{dictionary.state}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="postalCode" render={({ field }) => (
                            <FormItem><FormLabel>{dictionary.zip_code}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="country" render={({ field }) => (
                            <FormItem><FormLabel>{dictionary.country}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </CardContent>
                </Card>

            </div>

            <div>
                <Card className="sticky top-24 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{dictionary.order_summary}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ul className="divide-y">
                        {cartItems.map(item => (
                            <li key={item.product._id} className="flex items-center gap-4 py-4">
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                                <Image
                                    src={item.product.images[0] ? item.product.images[0].url : "https://placehold.co/80x80.png"}
                                    alt={item.product.name}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">{dictionary.quantity}: {item.quantity}</p>
                            </div>
                            <p className="font-medium">{formatPrice(item.product.price * item.quantity, lang)}</p>
                            </li>
                        ))}
                    </ul>
                    
                    <Separator/>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>{dictionary.subtotal}</span>
                            <span className="font-semibold">{formatPrice(totalPrice, lang)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                            <span>{dictionary.total}</span>
                            <span>{formatPrice(totalPrice, lang)}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {dictionary.placing_order || 'Placing Order...'}
                        </>
                    ) : (
                        dictionary.place_order || 'Place Order'
                    )}
                    </Button>
                </CardFooter>
                </Card>
            </div>
            </form>
        </Form>
        </div>
    </div>
  );
}
