'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
}

interface OnlineUser {
  id: string;
  name: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [message, setMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = () => {
    try {
      const token = localStorage.getItem('token');
      const wsUrl = `wss://localhost:7105/ws?token=${token}`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket Connected');
        setConnected(true);
        setReconnecting(false);
        reconnectAttemptsRef.current = 0;
        
        // Enviar mensaje de entrada
        ws.send(JSON.stringify({
          type: 'join',
          user: user?.firstName || 'Usuario',
          timestamp: new Date().toISOString()
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'message':
              setMessages(prev => [...prev, {
                id: data.id || Date.now().toString(),
                user: data.user,
                message: data.message,
                timestamp: data.timestamp
              }]);
              break;
              
            case 'userList':
              setOnlineUsers(data.users || []);
              break;
              
            case 'userJoined':
              setOnlineUsers(prev => [...prev, data.user]);
              setMessages(prev => [...prev, {
                id: Date.now().toString(),
                user: 'Sistema',
                message: `${data.user.name} se ha unido al chat`,
                timestamp: new Date().toISOString()
              }]);
              break;
              
            case 'userLeft':
              setOnlineUsers(prev => prev.filter(u => u.id !== data.userId));
              setMessages(prev => [...prev, {
                id: Date.now().toString(),
                user: 'Sistema',
                message: `${data.userName} ha salido del chat`,
                timestamp: new Date().toISOString()
              }]);
              break;
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        setConnected(false);
        wsRef.current = null;
        
        // Intentar reconectar con backoff exponencial
        if (reconnectAttemptsRef.current < 5) {
          setReconnecting(true);
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          reconnectAttemptsRef.current++;
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnecting... Attempt ${reconnectAttemptsRef.current}`);
            connectWebSocket();
          }, delay);
        }
      };
    } catch (error) {
      console.error('Error connecting WebSocket:', error);
    }
  };

  const sendMessage = () => {
    if (!message.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    wsRef.current.send(JSON.stringify({
      type: 'message',
      user: user?.firstName || 'Usuario',
      message: message.trim(),
      timestamp: new Date().toISOString()
    }));

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              {t('chat.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('chat.subtitle')}
            </p>
            
            {/* Connection Status */}
            <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm shadow-sm">
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : reconnecting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {connected ? t('chat.connected') : reconnecting ? t('chat.reconnecting') : t('chat.disconnected')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Online Users Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  {t('chat.onlineUsers')} ({onlineUsers.length})
                </h2>
                <div className="space-y-2">
                  {onlineUsers.length > 0 ? (
                    onlineUsers.map((u) => (
                      <div key={u.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-700">{u.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">{t('chat.noUsers')}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-purple-100">
                {/* Messages Container */}
                <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-purple-50/30">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.user === user?.firstName ? 'justify-end' : 'justify-start'} animate-slide-in`}
                      >
                        <div className={`max-w-[70%] ${msg.user === 'Sistema' ? 'w-full text-center' : ''}`}>
                          {msg.user === 'Sistema' ? (
                            <div className="text-sm text-gray-500 italic bg-gray-100/50 px-4 py-2 rounded-full inline-block">
                              {msg.message}
                            </div>
                          ) : (
                            <div className={`rounded-2xl p-4 shadow-md ${
                              msg.user === user?.firstName
                                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className={`font-bold text-sm ${msg.user === user?.firstName ? 'text-purple-100' : 'text-purple-600'}`}>
                                  {msg.user}
                                </span>
                                <span className={`text-xs ${msg.user === user?.firstName ? 'text-purple-200' : 'text-gray-500'}`}>
                                  {formatTime(msg.timestamp)}
                                </span>
                              </div>
                              <p className="break-words">{msg.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400 text-lg">{t('chat.noMessages')}</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('chat.placeholder')}
                      disabled={!connected}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-300"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!connected || !message.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {t('chat.send')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
