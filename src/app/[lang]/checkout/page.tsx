
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/types';
import CheckoutView from './CheckoutView';

export default async function CheckoutPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang);

    return <CheckoutView lang={lang} dictionary={dictionary} />;
}
