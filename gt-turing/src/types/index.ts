// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'Visitor' | 'User' | 'Admin';
  isBlocked: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  expiration: string;
  user: User;
}

// Car types
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  power: number;
  type: 'Racing' | 'Drift' | 'Hybrid';
  pricePerDay: number;
  status: 'Available' | 'Rented' | 'Maintenance';
  imageUrl?: string;
  description?: string;
  createdAt: string;
}

export interface CarFilter {
  type?: string;
  status?: string;
  minPower?: number;
  maxPower?: number;
  maxPrice?: number;
  brand?: string;
  pageNumber?: number;
  pageSize?: number;
}

// Circuit types
export interface Circuit {
  id: string;
  name: string;
  location: string;
  province: string;
  lengthMeters: number;
  widthMeters: number;
  surfaceType: 'Asphalt' | 'Concrete' | 'Mixed';
  elevationChange?: number;
  numberOfCorners?: number;
  isAvailable: boolean;
  imageUrl?: string;
  description?: string;
  createdAt: string;
}

export interface CircuitFilter {
  province?: string;
  surfaceType?: string;
  minLength?: number;
  maxLength?: number;
  isAvailable?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

// Reservation types
export interface Reservation {
  id: string;
  userId: string;
  carId: string;
  circuitId: string;
  startDate: string;
  endDate: string;
  pickupTime: string;
  returnTime: string;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  createdAt: string;
  user?: User;
  car?: Car;
  circuit?: Circuit;
}

export interface CreateReservationRequest {
  carId: string;
  circuitId: string;
  startDate: string;
  endDate: string;
  pickupTime: string;
  returnTime: string;
}

// Chat types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  attachmentUrl?: string;
  sentAt: string;
  sender?: User;
}

export interface Conversation {
  id: string;
  userId: string;
  adminId?: string;
  subject: string;
  status: 'Open' | 'InProgress' | 'Closed';
  createdAt: string;
  updatedAt: string;
  user?: User;
  admin?: User;
  messages?: Message[];
  unreadCount: number;
}

export interface CreateConversationRequest {
  subject: string;
  initialMessage: string;
}

export interface CreateMessageRequest {
  conversationId: string;
  content: string;
  attachmentUrl?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
