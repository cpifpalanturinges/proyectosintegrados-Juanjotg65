'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  subject: string;
  status: string;
  messages: ChatMessage[];
  unreadCount: number;
}

export default function ChatPage() {
  const router = useRouter();
  const { isAuthenticated, user, ws, sendWSMessage, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadConversations();

    // Listen for incoming WebSocket messages
    const handleWSMessage = (event: Event) => {
      const customEvent = event as CustomEvent;
      const data = customEvent.detail;
      
      if (data.type === 'ReceiveMessage') {
        const newMessage: ChatMessage = {
          id: data.id || Date.now().toString(),
          senderId: data.senderId,
          senderName: data.senderName || 'Unknown',
          content: data.content || '',
          sentAt: data.sentAt || new Date().toISOString(),
          isRead: false
        };
        
        // Only add message if it belongs to active conversation
        if (activeConversation && data.conversationId === activeConversation.id) {
          setMessages(prev => [...prev, newMessage]);
        }
        
        // Reload conversations to update unread counts
        loadConversations();
      } else if (data.type === 'ConversationCreated') {
        loadConversations();
      }
    };

    window.addEventListener('ws-message', handleWSMessage);

    return () => {
      window.removeEventListener('ws-message', handleWSMessage);
    };
  }, [isAuthenticated, authLoading, activeConversation]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5021/api/chat/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversationMessages = async (conversationId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5021/api/chat/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const conv = await response.json();
      setActiveConversation(conv);
      setMessages(conv.messages || []);
      
      // Join the conversation via WebSocket
      if (ws && ws.readyState === WebSocket.OPEN) {
        sendWSMessage({
          type: 'JoinConversation',
          conversationId: conversationId
        });
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !activeConversation) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5021/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          conversationId: activeConversation.id,
          content: message.trim() 
        })
      });

      if (response.ok) {
        setMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const createNewConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5021/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: subject.trim(),
          initialMessage: message.trim()
        })
      });

      const data = await response.json();
      
      setShowNewChat(false);
      setSubject('');
      setMessage('');
      
      await loadConversations();
      
      // Open the new conversation
      if (data?.id) {
        await loadConversationMessages(data.id);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">{t('chat.title') || 'Chat'}</h2>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${ws && ws.readyState === WebSocket.OPEN ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-sm text-white">{ws && ws.readyState === WebSocket.OPEN ? 'Conectado' : 'Desconectado'}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewChat(true)}
                  className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
                >
                  + Nueva Conversación
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-gray-900">No hay conversaciones</p>
                    <p className="text-sm mt-2 text-gray-600">Inicia una nueva conversación</p>
                  </div>
                ) : (
                  conversations.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => loadConversationMessages(conv.id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition ${
                        activeConversation?.id === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">{conv.subject}</h3>
                        {conv.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Estado: <span className="font-medium text-gray-900">{conv.status}</span>
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {showNewChat ? (
                <div className="flex-1 flex flex-col p-6">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Nueva Conversación</h2>
                  <form onSubmit={createNewConversation} className="flex-1 flex flex-col">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Asunto
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="Escribe el asunto..."
                        required
                      />
                    </div>
                    <div className="flex-1 mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Mensaje
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full h-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                        placeholder="Escribe tu mensaje..."
                        required
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        Crear Conversación
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewChat(false);
                          setSubject('');
                          setMessage('');
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              ) : activeConversation ? (
                <>
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">{activeConversation.subject}</h2>
                    <p className="text-sm text-gray-700">Estado: <span className="font-medium text-gray-900">{activeConversation.status}</span></p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4" id="messages-container">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-3 rounded-lg ${
                            msg.senderId === user?.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm font-semibold mb-1">{msg.senderName}</p>
                          <p className={msg.senderId === user?.id ? 'text-white' : 'text-gray-900'}>{msg.content}</p>
                          <p className="text-xs mt-1 opacity-75">
                            {new Date(msg.sentAt).toLocaleString('es-ES', { 
                              day: '2-digit',
                              month: '2-digit', 
                              year: 'numeric',
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={sendMessage} className="flex space-x-4">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        placeholder="Escribe un mensaje..."
                        disabled={!ws || ws.readyState !== WebSocket.OPEN}
                      />
                      <button
                        type="submit"
                        disabled={!ws || ws.readyState !== WebSocket.OPEN || !message.trim()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Enviar
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="w-24 h-24 mx-auto mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="text-xl text-gray-900">Selecciona una conversación</p>
                    <p className="text-sm mt-2 text-gray-600">o crea una nueva para comenzar</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
