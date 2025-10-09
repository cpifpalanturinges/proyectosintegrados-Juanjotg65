import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Car,
  CarFilter,
  Circuit,
  CircuitFilter,
  Reservation,
  CreateReservationRequest,
  Conversation,
  CreateConversationRequest,
  Message,
  CreateMessageRequest,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7000/api';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.token);
    return response;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.token);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
    });
    this.setToken(response.token);
    return response;
  }

  logout() {
    this.setToken(null);
  }

  // Cars endpoints
  async getCars(filters?: CarFilter): Promise<Car[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return this.request<Car[]>(`/cars?${params.toString()}`);
  }

  async getCar(id: string): Promise<Car> {
    return this.request<Car>(`/cars/${id}`);
  }

  async createCar(data: Partial<Car>): Promise<Car> {
    return this.request<Car>('/cars', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCar(id: string, data: Partial<Car>): Promise<Car> {
    return this.request<Car>(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCar(id: string): Promise<void> {
    return this.request<void>(`/cars/${id}`, {
      method: 'DELETE',
    });
  }

  // Circuits endpoints
  async getCircuits(filters?: CircuitFilter): Promise<Circuit[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return this.request<Circuit[]>(`/circuits?${params.toString()}`);
  }

  async getCircuit(id: string): Promise<Circuit> {
    return this.request<Circuit>(`/circuits/${id}`);
  }

  async createCircuit(data: Partial<Circuit>): Promise<Circuit> {
    return this.request<Circuit>('/circuits', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCircuit(id: string, data: Partial<Circuit>): Promise<Circuit> {
    return this.request<Circuit>(`/circuits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCircuit(id: string): Promise<void> {
    return this.request<void>(`/circuits/${id}`, {
      method: 'DELETE',
    });
  }

  // Reservations endpoints
  async getReservations(filters?: any): Promise<Reservation[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return this.request<Reservation[]>(`/reservations?${params.toString()}`);
  }

  async getReservation(id: string): Promise<Reservation> {
    return this.request<Reservation>(`/reservations/${id}`);
  }

  async createReservation(data: CreateReservationRequest): Promise<Reservation> {
    return this.request<Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReservation(id: string, data: Partial<Reservation>): Promise<Reservation> {
    return this.request<Reservation>(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelReservation(id: string): Promise<void> {
    return this.request<void>(`/reservations/${id}`, {
      method: 'DELETE',
    });
  }

  // Chat endpoints
  async getConversations(pageNumber = 1, pageSize = 20): Promise<Conversation[]> {
    return this.request<Conversation[]>(`/chat/conversations?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  async getConversation(id: string): Promise<Conversation> {
    return this.request<Conversation>(`/chat/conversations/${id}`);
  }

  async createConversation(data: CreateConversationRequest): Promise<Conversation> {
    return this.request<Conversation>('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMessages(conversationId: string, pageNumber = 1, pageSize = 50): Promise<Message[]> {
    return this.request<Message[]>(`/chat/messages?conversationId=${conversationId}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  async sendMessage(data: CreateMessageRequest): Promise<Message> {
    return this.request<Message>('/chat/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async markMessageAsRead(id: string): Promise<void> {
    return this.request<void>(`/chat/messages/${id}/read`, {
      method: 'PATCH',
    });
  }

  // Users endpoints (Admin only)
  async getUsers(pageNumber = 1, pageSize = 20): Promise<User[]> {
    return this.request<User[]>(`/users?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  async getUser(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
