import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Cart Action Types
const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Initial cart state
const initialCartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

// Cart reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // If item exists, increase quantity
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price
        };
      } else {
        // If new item, add to cart
        const newItem = { ...action.payload, quantity: 1 };
        
        return {
          ...state,
          items: [...state.items, newItem],
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price
        };
      }
    }

    case CART_ACTIONS.REMOVE_FROM_CART: {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      if (!itemToRemove) return state;

      const updatedItems = state.items.filter(item => item.id !== action.payload);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity)
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // If quantity is 0 or less, remove item
        return cartReducer(state, { type: CART_ACTIONS.REMOVE_FROM_CART, payload: id });
      }

      const existingItem = state.items.find(item => item.id === id);
      if (!existingItem) return state;

      const quantityDifference = quantity - existingItem.quantity;
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );

      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDifference,
        totalPrice: state.totalPrice + (existingItem.price * quantityDifference)
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return initialCartState;

    case CART_ACTIONS.LOAD_CART:
      return action.payload || initialCartState;

    default:
      return state;
  }
};

// Create Cart Context
const CartContext = createContext();

// Cart Provider component
export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('harvestHub_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cart state changes
  useEffect(() => {
    localStorage.setItem('harvestHub_cart', JSON.stringify(cartState));
  }, [cartState]);

  // Cart action functions
  const addToCart = (product) => {
    dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
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