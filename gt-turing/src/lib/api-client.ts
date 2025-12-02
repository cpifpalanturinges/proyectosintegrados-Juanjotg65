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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5021';

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

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle different HTTP status codes
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'An error occurred',
          details: `HTTP ${response.status}: ${response.statusText}`
        }));

        // Create a more detailed error message
        const errorMessage = errorData.message || errorData.title || 'An error occurred';
        const errorDetails = errorData.details || errorData.errors || '';
        
        const fullError = errorDetails ? `${errorMessage}: ${JSON.stringify(errorDetails)}` : errorMessage;

        // Handle specific error codes
        switch (response.status) {
          case 401:
            // Unauthorized - throw error but don't automatically redirect
            // Let the AuthContext handle the redirect
            throw new Error('401_UNAUTHORIZED');
          
          case 403:
            throw new Error('No tienes permisos para realizar esta acción.');
          
          case 404:
            throw new Error('Recurso no encontrado.');
          
          case 409:
            throw new Error(fullError || 'Conflicto con los datos existentes.');
          
          case 422:
            throw new Error(fullError || 'Datos de validación incorrectos.');
          
          case 500:
            throw new Error('Error del servidor. Por favor, intenta más tarde.');
          
          default:
            throw new Error(fullError || `HTTP error! status: ${response.status}`);
        }
      }

      // Try to parse JSON response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }

      // For non-JSON responses (like 204 No Content)
      return {} as T;
      
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de conexión. Verifica tu conexión a internet.');
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  // Generic HTTP methods
  async get<T = any>(endpoint: string): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, { method: 'GET' });
    return { data };
  }

  async post<T = any>(endpoint: string, body?: any): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data };
  }

  async put<T = any>(endpoint: string, body?: any): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data };
  }

  async delete<T = any>(endpoint: string): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, { method: 'DELETE' });
    return { data };
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

  async getConnectedUsers(): Promise<string[]> {
    return this.request<string[]>('/users/connected');
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

  async updateUserRole(id: string, role: string): Promise<User> {
    return this.request<User>(`/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async toggleBlockUser(id: string, isBlocked: boolean): Promise<User> {
    return this.request<User>(`/users/${id}/block`, {
      method: 'PUT',
      body: JSON.stringify({ isBlocked }),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Upload endpoints
  async uploadImage(file: File, fileName?: string): Promise<{ imageUrl: string; fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (fileName) {
      formData.append('fileName', fileName);
    }

    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}/upload/image`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Error uploading image',
        }));
        throw new Error(errorData.message || 'Error uploading image');
      }

      return response.json();
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    return this.request<void>(`/upload/image?imageUrl=${encodeURIComponent(imageUrl)}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
