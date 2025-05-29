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

interface FavoritesStore {
    items: Product[]
    addItem: (data: Product) => void
    removeItem: (id: string) => void
}

export const useFavorites = create<FavoritesStore>()(
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
        }),
        {
            name: "favorites-storage",
        },
    ),
)
