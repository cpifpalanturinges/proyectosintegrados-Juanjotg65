'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiClient } from '@/lib/api-client';
import { Reservation } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadReservations();
  }, [isAuthenticated]);

  const loadReservations = async () => {
    try {
      const data = await apiClient.getReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeReservations = reservations.filter(r => r.status === 'Confirmed' || r.status === 'Pending');
  const completedReservations = reservations.filter(r => r.status === 'Completed');
  const totalSpent = reservations.filter(r => r.status === 'Completed').reduce((sum, r) => sum + r.totalPrice, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                <span className="text-3xl">👋</span>
              </div>
              <div>
                <h1 className="text-5xl font-bold">¡Bienvenido, {user?.firstName}!</h1>
                <p className="text-xl text-blue-100 mt-2">
                  {isAdmin ? '👑 Panel de Administración' : '🏎️ Tu panel de control personalizado'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 animate-fade-in group">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">Reservas Activas</div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {activeReservations.length}
            </div>
            <div className="text-xs text-gray-500 mt-2">En curso o pendientes</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 animate-fade-in group" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">Completadas</div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              {completedReservations.length}
            </div>
            <div className="text-xs text-gray-500 mt-2">Experiencias realizadas</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 animate-fade-in group" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">Total Reservas</div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              {reservations.length}
            </div>
            <div className="text-xs text-gray-500 mt-2">Historial completo</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 animate-fade-in group" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">Total Gastado</div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              {totalSpent}€
            </div>
            <div className="text-xs text-gray-500 mt-2">En experiencias</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/cars"
            className="group bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-fade-in"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">Coches</div>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="text-blue-100 text-sm">Explora nuestra flota</div>
          </Link>

          <Link
            href="/circuits"
            className="group bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">Circuitos</div>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="text-purple-100 text-sm">Descubre las pistas</div>
          </Link>

          <Link
            href="/reservations/new"
            className="group bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">Reservar</div>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="text-green-100 text-sm">Nueva experiencia</div>
          </Link>

          <Link
            href="/chat"
            className="group bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">Chat</div>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="text-orange-100 text-sm">Soporte en línea</div>
          </Link>
        </div>

        {/* Recent Reservations */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 animate-fade-in-up">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mis Reservas
                </h2>
              </div>
              {reservations.length > 0 && (
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {reservations.length} {reservations.length === 1 ? 'reserva' : 'reservas'}
                </span>
              )}
            </div>
          </div>

          <div className="p-6">
            {reservations.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="text-8xl mb-4 animate-bounce-slow">🏎️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Comienza Tu Aventura!</h3>
                <p className="text-gray-600 mb-6 text-lg">Aún no tienes reservas. Es momento de vivir la experiencia.</p>
                <Link
                  href="/cars"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Explorar Coches</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation, index) => (
                  <div
                    key={reservation.id}
                    className="group border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-3xl">
                          🏎️
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-xl mb-1 group-hover:text-blue-600 transition">
                            {reservation.car?.brand} {reservation.car?.model}
                          </h3>
                          <p className="text-gray-600 flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">{reservation.circuit?.name}</span>
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                          reservation.status === 'Confirmed'
                            ? 'bg-green-100 text-green-700 border-2 border-green-300'
                            : reservation.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                            : reservation.status === 'Cancelled'
                            ? 'bg-red-100 text-red-700 border-2 border-red-300'
                            : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                        }`}
                      >
                        {reservation.status === 'Confirmed' ? '✅ Confirmada' : 
                         reservation.status === 'Pending' ? '⏳ Pendiente' :
                         reservation.status === 'Cancelled' ? '❌ Cancelada' : '✔️ Completada'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-xs text-blue-600 font-semibold mb-1 flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>INICIO</span>
                        </div>
                        <div className="font-bold text-gray-900">
                          {new Date(reservation.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-xs text-purple-600 font-semibold mb-1 flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>FIN</span>
                        </div>
                        <div className="font-bold text-gray-900">
                          {new Date(reservation.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-xs text-green-600 font-semibold mb-1 flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>RECOGIDA</span>
                        </div>
                        <div className="font-bold text-gray-900">{reservation.pickupTime}</div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg">
                        <div className="text-xs text-orange-600 font-semibold mb-1 flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>TOTAL</span>
                        </div>
                        <div className="font-bold text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                          {reservation.totalPrice}€
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
