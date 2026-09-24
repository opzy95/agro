import { getFarmerOrders } from './orderService';
import { getMyProducts } from './productService';
import { getMyWallet } from './userService';

const unwrapList = (response, key) => {
  const value = response?.[key] || response?.data?.[key] || response?.data || response || [];
  return Array.isArray(value) ? value : [];
};

const getAmount = (order) => Number(order.totalAmount ?? order.total ?? order.grandTotal ?? 0);
const getStatus = (order) => String(order.status || order.orderStatus || '').toLowerCase().replace(/[_-]/g, ' ');

export const getFarmerDashboardData = async () => {
  const [ordersResponse, productsResponse] = await Promise.all([getFarmerOrders(), getMyProducts()]);
  const orders = unwrapList(ordersResponse, 'orders');
  const products = unwrapList(productsResponse, 'products');
  const activeOrders = orders.filter((order) => ['pending', 'processing', 'shipped'].includes(getStatus(order)));
  const revenue = orders
    .filter((order) => !['cancelled', 'canceled'].includes(getStatus(order)))
    .reduce((total, order) => total + getAmount(order), 0);

  const productSales = new Map();
  orders.forEach((order) => (order.items || []).forEach((item) => {
    const product = item.product || {};
    const id = product._id || product.id || item.productId || item.name;
    const current = productSales.get(id) || { id, name: item.name || product.name || 'Product', sales: 0, revenue: 0 };
    current.sales += Number(item.quantity || 0);
    current.revenue += Number(item.subtotal ?? item.price ?? product.price ?? 0) * Number(item.quantity || 1);
    productSales.set(id, current);
  }));

  return {
    orders,
    products,
    stats: { revenue, orders: orders.length, activeProducts: products.filter((product) => ['active', 'published'].includes(String(product.status || '').toLowerCase())).length, pendingOrders: orders.filter((order) => getStatus(order) === 'pending').length },
    topProducts: Array.from(productSales.values()).sort((a, b) => b.sales - a.sales).slice(0, 4)
  };
};

export const getFarmerEarningsData = async () => {
  const [ordersResponse, walletResponse] = await Promise.all([getFarmerOrders(), getMyWallet()]);
  const orders = unwrapList(ordersResponse, 'orders');
  const wallet = walletResponse?.wallet || walletResponse?.data?.wallet || walletResponse?.data || walletResponse || {};
  const completedOrders = orders.filter((order) => !['cancelled', 'canceled'].includes(getStatus(order)));
  const totalRevenue = completedOrders.reduce((total, order) => total + getAmount(order), 0);
  return { orders, wallet, totalRevenue };
};

export const getFarmerAnalyticsData = async () => {
  const data = await getFarmerDashboardData();
  const customers = new Map();
  const products = new Map();
  data.orders.forEach((order) => {
    const customer = order.customer || order.user || order.buyer || {};
    const customerId = customer._id || customer.id || customer.email || customer.name || customer;
    const customerName = typeof customer === 'string' ? customer : customer.name || customer.fullName || `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Customer';
    const currentCustomer = customers.get(customerId) || { name: customerName, orders: 0, spent: 0 };
    currentCustomer.orders += 1;
    currentCustomer.spent += getAmount(order);
    customers.set(customerId, currentCustomer);
    (order.items || []).forEach((item) => {
      const product = item.product || {};
      const id = product._id || product.id || item.productId || item.name;
      const currentProduct = products.get(id) || { name: item.name || product.name || 'Product', orders: 0, revenue: 0 };
      currentProduct.orders += Number(item.quantity || 0);
      currentProduct.revenue += Number(item.subtotal ?? item.price ?? product.price ?? 0) * Number(item.quantity || 1);
      products.set(id, currentProduct);
    });
  });
  return { ...data, topCustomers: Array.from(customers.values()).sort((a, b) => b.spent - a.spent).slice(0, 5), topProducts: Array.from(products.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5) };
};

export default { getFarmerDashboardData, getFarmerEarningsData, getFarmerAnalyticsData };
