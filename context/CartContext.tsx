"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserPreferences } from '@/app/_actions/user-preferences';
import { useSession } from 'next-auth/react';

interface CartContextType {
    itemCount: number;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [itemCount, setItemCount] = useState(0);
    const { status } = useSession();

    const refreshCart = async () => {
        if (status !== 'authenticated') {
            setItemCount(0);
            return;
        }

        try {
            const prefs = await getUserPreferences();
            if (prefs?.cart) {
                // Calculate total quantity across items
                const count = prefs.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
                setItemCount(count);
            } else {
                setItemCount(0);
            }
        } catch (error) {
            console.error("Failed to fetch cart count", error);
        }
    };

    useEffect(() => {
        refreshCart();
    }, [status]);

    return (
        <CartContext.Provider value={{ itemCount, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
