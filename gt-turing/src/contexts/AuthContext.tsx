'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  ws: WebSocket | null;
  sendWSMessage: (message: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket connection management
  const connectWebSocket = (userId: string, token: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      const wsUrl = `ws://localhost:5021/ws/chat?userId=${userId}&token=${encodeURIComponent(token)}`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('✅ WebSocket connected');
        setWs(socket);
        wsRef.current = socket;
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', data);
          // Dispatch custom event for chat page to listen
          window.dispatchEvent(new CustomEvent('ws-message', { detail: data }));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

      socket.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setWs(null);
        wsRef.current = null;
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setWs(null);
    }
  };

  const sendWSMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  };

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          apiClient.setToken(token); // Ensure token is set
          const currentUser = await apiClient.getCurrentUser();
          setUser(currentUser);
          // Connect WebSocket after successful auth
          if (currentUser.id) {
            connectWebSocket(currentUser.id, token);
          }
        } catch (error) {
          console.log('Token inválido o sesión expirada, limpiando localStorage...');
          // Si hay cualquier error al obtener el usuario, limpiar sesión
          localStorage.removeItem('token');
          apiClient.setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();

    // Cleanup WebSocket on unmount
    return () => {
      disconnectWebSocket();
    };
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response: AuthResponse = await apiClient.login(data);
      setUser(response.user);
      // Connect WebSocket after login
      const token = localStorage.getItem('token');
      if (token && response.user.id) {
        connectWebSocket(response.user.id, token);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response: AuthResponse = await apiClient.register(data);
      setUser(response.user);
      // Connect WebSocket after registration
      const token = localStorage.getItem('token');
      if (token && response.user.id) {
        connectWebSocket(response.user.id, token);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    disconnectWebSocket();
    apiClient.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin',
    isUser: user?.role === 'User' || user?.role === 'Admin',
    ws,
    sendWSMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
