export const orders = [
  {
    id: '#HH1005',
    customer: 'John Ade',
    customerEmail: 'john.ade@example.com',
    farmers: ['Green Valley Farm', 'Sunrise Farms'],
    items: [
      { name: 'Fresh Tomatoes', quantity: 5, farmer: 'Green Valley Farm', amount: 42500 },
      { name: 'Sweet Maize', quantity: 3, farmer: 'Sunrise Farms', amount: 18000 }
    ],
    date: '28 Aug 2026',
    total: 60500,
    status: 'Processing'
  },
  {
    id: '#HH1004',
    customer: 'Mary James',
    customerEmail: 'mary.james@example.com',
    farmers: ['Premium Producer'],
    items: [
      { name: 'Yam', quantity: 10, farmer: 'Premium Producer', amount: 35000 }
    ],
    date: '26 Aug 2026',
    total: 35000,
    status: 'Completed'
  },
  {
    id: '#HH1003',
    customer: 'John Ade',
    customerEmail: 'john.ade@example.com',
    farmers: ['Green Valley Farm'],
    items: [
      { name: 'Rice', quantity: 3, farmer: 'Green Valley Farm', amount: 78000 }
    ],
    date: '24 Aug 2026',
    total: 78000,
    status: 'Completed'
  },
  {
    id: '#HH1002',
    customer: 'Fatima Yusuf',
    customerEmail: 'fatima.yusuf@example.com',
    farmers: ['Oakridge Farms'],
    items: [
      { name: 'Organic Vegetables Box', quantity: 4, farmer: 'Oakridge Farms', amount: 28000 }
    ],
    date: '22 Aug 2026',
    total: 28000,
    status: 'Pending'
  },
  {
    id: '#HH1001',
    customer: 'David Cole',
    customerEmail: 'david.cole@example.com',
    farmers: ['Sunrise Farms', 'Oakridge Farms'],
    items: [
      { name: 'Plantain', quantity: 2, farmer: 'Sunrise Farms', amount: 16000 },
      { name: 'Fresh Garden Produce', quantity: 1, farmer: 'Oakridge Farms', amount: 12000 }
    ],
    date: '20 Aug 2026',
    total: 28000,
    status: 'Cancelled'
  },
  {
    id: '#HH0998',
    customer: 'Mary James',
    customerEmail: 'mary.james@example.com',
    farmers: ['Green Valley Farm'],
    items: [
      { name: 'Premium Tomatoes', quantity: 6, farmer: 'Green Valley Farm', amount: 30000 }
    ],
    date: '18 Aug 2026',
    total: 30000,
    status: 'Completed'
  }
];
