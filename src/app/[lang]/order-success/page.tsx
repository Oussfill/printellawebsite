
import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import type { Locale } from '@/lib/types';

export default async function OrderSuccessPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto h-24 w-24 text-green-500" />
      <h1 className="mt-6 font-headline text-4xl font-bold">
        {dictionary.order_placed_successfully}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {dictionary.thank_you_for_order}
      </p>
      <Button asChild size="lg" className="mt-10">
        <Link href={`/${lang}/`}>{dictionary.back_to_home}</Link>
      </Button>
    </div>
  );
}
