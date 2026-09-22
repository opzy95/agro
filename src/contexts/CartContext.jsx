import React, { createContext, useContext, useEffect, useState } from 'react';
import * as cartService from '../services/cartService';
import { getProductById } from '../services/productService';

const initialCartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

const unwrapCart = (response) => response?.cart || response?.data?.cart || response?.data || response;
const isObjectId = (value) => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);

const getSellerName = (value) => {
  if (!value || isObjectId(value)) return '';
  if (typeof value === 'string') return value;
  return value.farmName || value.businessName || [value.firstName, value.lastName].filter(Boolean).join(' ');
};

const normalizeCart = (cart, sellerLookup = {}) => {
  const cartData = unwrapCart(cart);
  const items = (cartData?.items || []).map((item) => {
    const product = item.product || {};
    const farmer = item.farmer || product.farmer;
    const productId = String(product._id || product.id || item.product?._id || item.product?.id || item.product);
    const farmerName = getSellerName(farmer);

    return {
      ...product,
      id: productId,
      name: item.name || product.name,
      price: Number(item.price ?? product.price ?? 0),
      image: product.image || product.images?.[0],
      badges: product.badges || [],
      seller: getSellerName(item.seller) || getSellerName(product.seller) || farmerName || sellerLookup[productId] || '',
      quantity: item.quantity,
      subtotal: Number(item.subtotal ?? 0)
    };
  });

  return {
    items,
    totalItems: items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: Number(cartData?.totalAmount ?? cartData?.total ?? items.reduce((total, item) => total + item.subtotal, 0))
  };
};

const hydrateSellerNames = async (cartState, sellerLookup, rememberSeller) => {
  const missingSellerItems = cartState.items.filter((item) => !item.seller && item.id);
  if (missingSellerItems.length === 0) return cartState;

  const resolvedSellers = await Promise.all(missingSellerItems.map(async (item) => {
    try {
      const response = await getProductById(item.id);
      const product = response?.product || response?.data?.product || response?.data || response;
      const farmer = product?.farmer;
      const seller = getSellerName(product?.seller) || getSellerName(farmer);
      return seller ? { id: item.id, seller } : null;
    } catch {
      return null;
    }
  }));

  const sellerMap = resolvedSellers.filter(Boolean).reduce((map, entry) => {
    map[entry.id] = entry.seller;
    return map;
  }, { ...sellerLookup });

  resolvedSellers.filter(Boolean).forEach(({ id, seller }) => rememberSeller(id, seller));

  return {
    ...cartState,
    items: cartState.items.map((item) => ({
      ...item,
      seller: item.seller || sellerMap[item.id] || ''
    }))
  };
};

// Create Cart Context
const CartContext = createContext();

// Cart Provider component
export const CartProvider = ({ children }) => {
  const [cartState, setCartState] = useState(initialCartState);
  const [cartError, setCartError] = useState('');

  const getSellerLookup = () => {
    try {
      return JSON.parse(localStorage.getItem('harvestHub_sellers') || '{}');
    } catch {
      return {};
    }
  };

  const rememberSeller = (productOrId, sellerValue) => {
    const productId = typeof productOrId === 'object' ? String(productOrId.id) : String(productOrId);
    const seller = sellerValue || getSellerName(productOrId.seller);
    if (!seller) return;

    const sellers = { ...getSellerLookup(), [productId]: seller };
    localStorage.setItem('harvestHub_sellers', JSON.stringify(sellers));
  };

  useEffect(() => {
    if (!localStorage.getItem('authToken') && !sessionStorage.getItem('authToken')) return;
    cartService.getCart()
      .then((cart) => {
        const sellerLookup = getSellerLookup();
        const normalizedCart = normalizeCart(cart, sellerLookup);
        return hydrateSellerNames(normalizedCart, sellerLookup, rememberSeller);
      })
      .then(setCartState)
      .catch((error) => setCartError(error.message));
  }, []);

  const syncCart = async (request) => {
    setCartError('');
    try {
      const cart = await request();
      const sellerLookup = getSellerLookup();
      const normalizedCart = normalizeCart(cart, sellerLookup);
      setCartState(await hydrateSellerNames(normalizedCart, sellerLookup, rememberSeller));
    } catch (error) {
      setCartError(error.message);
      throw error;
    }
  };

  const addToCart = (product) => {
    rememberSeller(product);
    return syncCart(() => cartService.addToCart(product.id, 1));
  };

  const removeFromCart = (productId) => {
    return syncCart(() => cartService.removeFromCart(productId));
  };

  const updateQuantity = (productId, quantity) => {
    return syncCart(() => cartService.updateCartItem(productId, quantity));
  };

  const clearCart = () => {
    return syncCart(() => cartService.clearCart());
  };

  const getItemQuantity = (productId) => {
    const item = cartState.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId) => {
    return cartState.items.some(item => item.id === productId);
  };

  const value = {
    ...cartState,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartError,
    getItemQuantity,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;