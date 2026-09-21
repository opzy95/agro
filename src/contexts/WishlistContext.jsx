import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as wishlistService from '../services/wishlistService';

// Wishlist Action Types
const WISHLIST_ACTIONS = {
  ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
  REMOVE_FROM_WISHLIST: 'REMOVE_FROM_WISHLIST',
  CLEAR_WISHLIST: 'CLEAR_WISHLIST',
  LOAD_WISHLIST: 'LOAD_WISHLIST'
};

// Initial wishlist state
const initialWishlistState = {
  items: [],
  totalItems: 0
};

const normalizeWishlistProduct = (product = {}) => {
  const imageList = (product.images || [])
    .map(image => typeof image === 'string' ? image : image?.url)
    .filter(Boolean);
  const image = product.image || imageList[0] || '';
  const farmer = product.farmer;

  return {
    ...product,
    id: product._id || product.id,
    name: product.name || product.productName || 'Unnamed product',
    price: Number(product.price || 0),
    unit: product.unit || 'unit',
    image,
    images: imageList.length ? imageList : [image],
    seller: product.seller || farmer?.farmName || farmer?.businessName || 'Local Farmer',
    verified: Boolean(farmer?.verificationStatus === 'verified' || farmer?.isVerified),
    badges: product.isOrganic ? ['organic'] : [],
    rating: Number(product.rating || 0)
  };
};

// Wishlist reducer function
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case WISHLIST_ACTIONS.ADD_TO_WISHLIST: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // Item already in wishlist
        return state;
      }

      const newItem = action.payload;
      
      return {
        ...state,
        items: [...state.items, newItem],
        totalItems: state.totalItems + 1
      };
    }

    case WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST: {
      const itemExists = state.items.some(item => item.id === action.payload);
      if (!itemExists) return state;

      const updatedItems = state.items.filter(item => item.id !== action.payload);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems - 1
      };
    }

    case WISHLIST_ACTIONS.CLEAR_WISHLIST:
      return initialWishlistState;

    case WISHLIST_ACTIONS.LOAD_WISHLIST:
      return action.payload || initialWishlistState;

    default:
      return state;
  }
};

// Create Wishlist Context
const WishlistContext = createContext();

// Wishlist Provider component
export const WishlistProvider = ({ children }) => {
  const [wishlistState, dispatch] = useReducer(wishlistReducer, initialWishlistState);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const response = await wishlistService.getWishlist();
        const products = response?.wishlist?.products || response?.products || [];
        const items = products.map(normalizeWishlistProduct);
        dispatch({
          type: WISHLIST_ACTIONS.LOAD_WISHLIST,
          payload: { items, totalItems: items.length }
        });
      } catch (error) {
        console.error('Error loading wishlist from backend:', error);
      }
    };

    loadWishlist();
  }, []);

  const addToWishlist = async (product) => {
    try {
      const response = await wishlistService.addToWishlist(product.id);
      const products = response?.wishlist?.products || [];
      const savedProduct = products.find(item => String(item.id) === String(product.id));
      dispatch({ type: WISHLIST_ACTIONS.ADD_TO_WISHLIST, payload: normalizeWishlistProduct(savedProduct || product) });
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      dispatch({ type: WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST, payload: productId });
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
    }
  };

  const clearWishlist = async () => {
    try {
      await wishlistService.clearWishlist();
      dispatch({ type: WISHLIST_ACTIONS.CLEAR_WISHLIST });
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistState.items.some(item => item.id === productId);
  };

  const value = {
    ...wishlistState,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;