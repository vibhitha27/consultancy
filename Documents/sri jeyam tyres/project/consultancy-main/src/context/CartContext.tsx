import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  vehicleType: string;
  vehicleModel: string;
}

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  addToCart: (item: Omit<CartItem, '_id'>) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, token } = useAuth();

  // Calculate cart totals with null checks
  const totalItems = cartItems?.reduce((total, item) => total + (item?.quantity || 0), 0) || 0;
  const totalPrice = cartItems?.reduce((total, item) => total + ((item?.price || 0) * (item?.quantity || 0)), 0) || 0;

  // Fetch cart on auth change
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, token]);

  const fetchCart = async () => {
    if (!isAuthenticated || !token) return;
    
    try {
      setLoading(true);
      const { data } = await api.get('/api/cart');
      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Could not load your cart');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: Omit<CartItem, '_id'>) => {
    if (!isAuthenticated || !token) {
      toast.error('Please log in to add items to your cart');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/api/cart', item);
      if (data.cartItem) {
        setCartItems(prevItems => {
          const existingItemIndex = prevItems.findIndex(i => i.productId === data.cartItem.productId);
          if (existingItemIndex >= 0) {
            const newItems = [...prevItems];
            newItems[existingItemIndex] = data.cartItem;
            return newItems;
          }
          return [...prevItems, data.cartItem];
        });
        toast.success(data.message || 'Item added to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Could not add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated || !token) return;

    try {
      setLoading(true);
      await api.delete(`/api/cart/${productId}`);
      setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Could not remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated || !token) return;

    try {
      setLoading(true);
      const { data } = await api.put(`/api/cart/${productId}`, { quantity });
      if (data.cartItem) {
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.productId === productId ? data.cartItem : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Could not update quantity');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || !token) return;

    try {
      setLoading(true);
      await api.delete('/api/cart');
      setCartItems([]);
      toast.success('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Could not clear cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalPrice,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};