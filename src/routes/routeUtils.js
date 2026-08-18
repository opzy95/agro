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