
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/types';
import CartView from './CartView';

export default async function CartPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);

  return <CartView lang={lang} dictionary={dictionary} />;
}
