import React, { createContext, useContext, useReducer, useEffect } from 'react';

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

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('harvestHub_wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        dispatch({ type: WISHLIST_ACTIONS.LOAD_WISHLIST, payload: parsedWishlist });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever wishlist state changes
  useEffect(() => {
    localStorage.setItem('harvestHub_wishlist', JSON.stringify(wishlistState));
  }, [wishlistState]);

  // Wishlist action functions
  const addToWishlist = (product) => {
    dispatch({ type: WISHLIST_ACTIONS.ADD_TO_WISHLIST, payload: product });
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST, payload: productId });
  };

  const clearWishlist = () => {
    dispatch({ type: WISHLIST_ACTIONS.CLEAR_WISHLIST });
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