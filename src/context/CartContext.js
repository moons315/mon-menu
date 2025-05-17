import React, { createContext, useState } from 'react';
import { orders } from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const quantityToAdd = product.qty || 1;
    setCart(prev => {
      const existing = prev.find(p => p._id === product._id);
      if (existing) {
        return prev.map(p =>
          p._id === product._id ? { ...p, qty: p.qty + quantityToAdd } : p
        );
      }
      return [...prev, { ...product, qty: quantityToAdd }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p._id !== id));
  };

  const updateQuantity = (id, qty) => {
    const newQty = parseInt(qty, 10);
    if (isNaN(newQty) || newQty <= 0) return;
    setCart(prev => prev.map(p =>
      p._id === id ? { ...p, qty: newQty } : p
    ));
  };

  const checkout = async ({ address, phone, notes, payment, delivery }) => {
    const items = cart.map(p => ({
      product: p._id,
      quantity: p.qty
    }));
    try {
      await orders.create({ items, address, phone, notes, payment, delivery });
      console.log('Pedido enviado correctamente');
      setCart([]);
    } catch (err) {
      console.error('Error al enviar pedido:', err);
      throw err; 
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};
