// Mock API functions - replace with real API calls
export const api = {
  // Inventory
  getInventory: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    return [
      { id: 1, name: "Margherita Pizza", quantity: 50, unit: "pcs", category: "Food" },
      { id: 2, name: "Caesar Salad", quantity: 30, unit: "kg", category: "Food" },
      { id: 3, name: "Coca Cola", quantity: 100, unit: "bottles", category: "Beverage" },
    ];
  },

  addInventoryItem: async (item: any) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ...item, id: Date.now() };
  },

  updateInventoryItem: async (id: number, item: any) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { ...item, id };
  },

  deleteInventoryItem: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  // Items/Menu
  getMenuItems: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { id: 1, name: "Margherita Pizza", price: 12.99, category: "Pizza", available: true },
      { id: 2, name: "Caesar Salad", price: 8.99, category: "Salads", available: true },
      { id: 3, name: "Grilled Chicken", price: 15.99, category: "Main Course", available: false },
    ];
  },

  addMenuItem: async (item: any) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ...item, id: Date.now() };
  },

  updateMenuItem: async (id: number, item: any) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { ...item, id };
  },

  deleteMenuItem: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  // Orders
  getOrders: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { id: 1, customer: "John Doe", status: "pending", total: 21.98, items: 2 },
      { id: 2, customer: "Jane Smith", status: "completed", total: 15.99, items: 1 },
      { id: 3, customer: "Bob Johnson", status: "preparing", total: 35.97, items: 3 },
    ];
  },

  createOrder: async (order: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...order, id: Date.now(), status: "pending" };
  },

  updateOrderStatus: async (id: number, status: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { id, status };
  },

  // Payments
  getPayments: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { id: 1, amount: 21.98, method: "Credit Card", status: "completed", date: "2023-10-15" },
      { id: 2, amount: 15.99, method: "Cash", status: "completed", date: "2023-10-15" },
      { id: 3, amount: 35.97, method: "Digital Wallet", status: "pending", date: "2023-10-15" },
    ];
  },

  processPayment: async (payment: any) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return { ...payment, id: Date.now(), status: "completed" };
  },

  // QR Codes
  getQRCodes: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      { id: 1, type: "table", identifier: "Table 1", url: "/menu?table=1" },
      { id: 2, type: "menu", identifier: "Main Menu", url: "/menu" },
      { id: 3, type: "custom", identifier: "Special Offer", url: "/offers/special" },
    ];
  },

  generateQR: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...data, id: Date.now(), qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." };
  },

  // Customers
  getCustomers: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { id: 1, name: "John Doe", email: "john@example.com", phone: "+1234567890", loyaltyPoints: 150 },
      { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1234567891", loyaltyPoints: 200 },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "+1234567892", loyaltyPoints: 75 },
    ];
  },

  addCustomer: async (customer: any) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ...customer, id: Date.now() };
  },

  // Suppliers
  getSuppliers: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { id: 1, name: "Fresh Foods Inc.", contact: "supplier1@example.com", rating: 4.5 },
      { id: 2, name: "Beverage Co.", contact: "supplier2@example.com", rating: 4.2 },
      { id: 3, name: "Dairy Products Ltd.", contact: "supplier3@example.com", rating: 4.8 },
    ];
  },

  // Dashboard stats
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return {
      totalRevenue: 15420.50,
      totalOrders: 127,
      activeOrders: 8,
      lowStockItems: 3,
      topSellingItems: [
        { name: "Margherita Pizza", sales: 45 },
        { name: "Caesar Salad", sales: 32 },
        { name: "Coca Cola", sales: 28 },
      ],
    };
  },
};
