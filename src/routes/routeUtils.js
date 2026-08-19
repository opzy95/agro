// Route constants for consistent navigation
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  CATEGORIES: '/categories',
  SHOP: '/shop',
  CART: '/cart',
  WISHLIST: '/wishlist',
  // Customer Dashboard Routes
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  CUSTOMER_SETTINGS: '/customer/settings',
  CUSTOMER_ORDERS: '/customer/orders',
  CUSTOMER_PAYMENT: '/customer/payment-methods',
  CUSTOMER_SHOP: '/customer/shop',
  CUSTOMER_WISHLIST: '/customer/wishlist',
  CUSTOMER_CART: '/customer/cart',
  // Farmer Dashboard Routes
  FARMER_DASHBOARD: '/farmer/dashboard',
  FARMER_PRODUCTS: '/farmer/products',
  FARMER_ORDERS: '/farmer/orders',
  FARMER_EARNINGS: '/farmer/earnings',
  FARMER_ANALYTICS: '/farmer/analytics',
  FARMER_SETTINGS: '/farmer/settings',
};

// Navigation helper functions
export const navigationHelpers = {
  goHome: () => ROUTES.HOME,
  goLogin: () => ROUTES.LOGIN,
  goRegister: () => ROUTES.REGISTER,
  goForgotPassword: () => ROUTES.FORGOT_PASSWORD,
  goCategories: () => ROUTES.CATEGORIES,
  goShop: () => ROUTES.SHOP,
  goCart: () => ROUTES.CART,
  goWishlist: () => ROUTES.WISHLIST,
};

// Route titles for dynamic page titles
export const routeTitles = {
  [ROUTES.HOME]: 'AgroFresh - Fresh From Trusted Farms',
  [ROUTES.LOGIN]: 'Login - AgroFresh',
  [ROUTES.REGISTER]: 'Sign Up - AgroFresh',
  [ROUTES.FORGOT_PASSWORD]: 'Reset Password - AgroFresh',
  [ROUTES.CATEGORIES]: 'Shop Categories - AgroFresh',
  [ROUTES.SHOP]: 'Shop - AgroFresh',
  [ROUTES.CART]: 'Shopping Cart - AgroFresh',
  [ROUTES.WISHLIST]: 'Wishlist - AgroFresh',
};