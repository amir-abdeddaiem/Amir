"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
interface Product {
    id: string
    name: string
    price: number
    image: string
    category: string
    description: string
}

interface CartStore {
    items: Product[]
    addItem: (data: Product) => void
    removeItem: (id: string) => void
    clearCart: () => void
}

export const useCart = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            addItem: (data: Product) =>
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === data.id)

                    if (existingItem) {
                        return { items: [...state.items] }
                    }

                    return { items: [...state.items, data] }
                }),
            removeItem: (id: string) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: "cart-storage",
        },
    ),
)
