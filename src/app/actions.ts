
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { suggestSearchQueries } from '@/ai/flows/suggested-search-queries';
import type { CartItem, Product } from '@/lib/types';

interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export async function placeOrder(
  shippingDetails: ShippingDetails,
  cartItems: CartItem[],
  totalPrice: number,
  lang: string
) {
  try {
    const orderItems = cartItems.map(item => ({
      productID: item.product._id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      variant: '' // Schema has variant, but it's not in the cart item.
    }));
    
    const guestInfo = {
      name: shippingDetails.fullName,
      email: shippingDetails.email,
      phone: shippingDetails.phone,
    };

    const response = await fetch('https://printrella-backend.onrender.com/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guestInfo,
        items: orderItems,
        totalPrice: totalPrice,
        shippingAddress: {
            phone: shippingDetails.phone,
            street: shippingDetails.street,
            city: shippingDetails.city,
            state: shippingDetails.state,
            postalCode: shippingDetails.postalCode,
            country: shippingDetails.country,
        },
        paymentMethod: "COD", // Hardcoded as COD
        orderTotal: {
            subTotal: totalPrice,
            discount: 0, // Assuming no discount for now
            total: totalPrice
        },
        // userID, couponCode, and trackingUrl are optional and omitted for guest checkout
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to place order:', errorData);
      throw new Error(errorData.message || 'Failed to place order');
    }

    const orderData = await response.json();
    console.log('Order placed successfully:', orderData);
    
  } catch (error) {
    console.error('Error placing order:', error);
    if (error instanceof Error) {
        throw new Error(error.message || 'An unexpected error occurred.');
    }
    throw new Error('An unexpected error occurred.');
  }

  revalidatePath(`/${lang}/products`);
  redirect(`/${lang}/order-success`);
}

export async function getAiSuggestions(userInput: string, productCatalog: string) {
  if (!userInput) {
    return { searchQueries: [] };
  }
  try {
    const result = await suggestSearchQueries({ userInput, productCatalog });
    return result;
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return { searchQueries: [] };
  }
}

export async function getProductsForAi() {
    try {
        const res = await fetch(`https://printrella-backend.onrender.com/products?limit=500`, { next: { revalidate: 3600 } });
        if (!res.ok) {
            return [];
        }
        const data = await res.json();
        const products = data.data || [];
        return products.map((p: Product) => ({ name: p.name, category: p.proCategoryId.name }));
    } catch (error) {
        console.error("Error fetching products for AI:", error);
        return [];
    }
}
