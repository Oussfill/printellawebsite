
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, Product } from '@/lib/types'

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('printrella_cart')
      if (storedCart) {
        setCartItems(JSON.parse(storedCart))
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error)
      setCartItems([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('printrella_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product: Product, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product._id === product._id)
      if (existingItem) {
        return prevItems.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prevItems, { product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product._id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.product._id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)
  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
