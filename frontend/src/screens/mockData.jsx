// src/data/mockData.js

const mockBikes = [
  {
    id: 1,
    type: 'Gyroscooter',
    model: 'Gyro Pro X1',
    hourlyRate: 12,
    available: true,
    location: 'Halifax Downtown',
    rating: 4.2,
    totalReviews: 47,
    features: ['Self-balancing', 'LED lights', 'Bluetooth speaker']
  },
  {
    id: 2,
    type: 'eBike',
    model: 'Thunder E-Bike',
    hourlyRate: 8,
    available: true,
    location: 'Dalhousie Campus',
    rating: 4.5,
    totalReviews: 89,
    features: ['Electric motor', '50km range', 'GPS tracking']
  },
  {
    id: 3,
    type: 'Segway',
    model: 'Segway Elite',
    hourlyRate: 15,
    available: false,
    location: 'Waterfront',
    rating: 4.0,
    totalReviews: 32,
    features: ['Self-balancing', 'Long battery life', 'Smartphone app']
  },
  {
    id: 4,
    type: 'eBike',
    model: 'City Cruiser E',
    hourlyRate: 10,
    available: true,
    location: 'Spring Garden',
    rating: 4.7,
    totalReviews: 156,
    features: ['Comfort seat', 'Basket included', 'Phone mount']
  },
  {
    id: 5,
    type: 'Gyroscooter',
    model: 'Urban Glider',
    hourlyRate: 14,
    available: true,
    location: 'Point Pleasant Park',
    rating: 3.8,
    totalReviews: 23,
    features: ['Compact design', 'Quick charge', 'Anti-slip pedals']
  }
];

const mockFeedback = [
  { id: 1, bikeId: 1, rating: 4, comment: "Great for short trips around downtown!", user: "Anonymous" },
  { id: 2, bikeId: 2, rating: 5, comment: "Amazing battery life and smooth ride.", user: "Anonymous" },
  { id: 3, bikeId: 1, rating: 4, comment: "Easy to use, good balance.", user: "Anonymous" }
];

export { mockBikes, mockFeedback };

export const mockBookings = [
  {
    id: 'b1',
    model: 'eBike X200',
    type: 'eBike',
    date: '2025-06-20',
    duration: 2,
    location: 'Dalhousie Campus',
    amount: 16,
  },
  {
    id: 'b2',
    model: 'Segway MiniPro',
    type: 'Segway',
    date: '2025-06-15',
    duration: 1,
    location: 'Waterfront',
    amount: 15,
  },
  {
    id: 'b3',
    model: 'Gyroscooter Alpha',
    type: 'Gyroscooter',
    date: '2025-06-10',
    duration: 1.5,
    location: 'Halifax Downtown',
    amount: 18,
  },
];


export const mockRentals = [
  {
    id: 1,
    model: 'Segway X2',
    pickupLocation: 'Spring Garden',
    startTime: 'Jun 23, 11:00 AM',
    expectedReturn: 'Jun 23, 4:00 PM',
  },
  {
    id: 2,
    model: 'eBike Turbo',
    pickupLocation: 'Waterfront',
    startTime: 'Jun 24, 9:00 AM',
    expectedReturn: 'Jun 24, 1:00 PM',
  },
];

export const mockWallet = {
  balance: 42.50,
  lastRecharge: 20.00,
  lastRideCost: 5.75,
  totalSpent: 88.25,
};

export const mockOverview = {
  totalBookings: 182,
  upcomingRentals: 17,
  totalRevenue: 3560.75,
};
