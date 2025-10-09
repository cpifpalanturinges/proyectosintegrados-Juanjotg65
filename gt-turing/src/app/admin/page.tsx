'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiClient } from '@/lib/api-client';
import { Car, Circuit, User, Reservation } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'cars' | 'circuits' | 'users' | 'reservations'>('cars');
  const [cars, setCars] = useState<Car[]>([]);
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, isAdmin, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'cars') {
        const data = await apiClient.getCars();
        setCars(data);
      } else if (activeTab === 'circuits') {
        const data = await apiClient.getCircuits();
        setCircuits(data);
      } else if (activeTab === 'reservations') {
        const data = await apiClient.getReservations();
        setReservations(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este coche?')) return;
    try {
      await apiClient.deleteCar(id);
      await loadData();
    } catch (error) {
      alert('Error al eliminar el coche');
    }
  };

  const handleDeleteCircuit = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este circuito?')) return;
    try {
      await apiClient.deleteCircuit(id);
      await loadData();
    } catch (error) {
      alert('Error al eliminar el circuito');
    }
  };

  const tabs = [
    { id: 'cars' as const, name: 'Coches', icon: '🏎️', color: 'blue' },
    { id: 'circuits' as const, name: 'Circuitos', icon: '🏁', color: 'orange' },
    { id: 'users' as const, name: 'Usuarios', icon: '👥', color: 'purple' },
    { id: 'reservations' as const, name: 'Reservas', icon: '📋', color: 'green' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                <span className="text-3xl">👑</span>
              </div>
              <div>
                <h1 className="text-5xl font-bold">Panel de Administración</h1>
                <p className="text-xl text-pink-100 mt-2">
                  Gestión completa del sistema GT-TURING
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Dashboard */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">Total Coches</div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏎️</span>
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {cars.length}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">Total Circuitos</div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏁</span>
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              {circuits.length}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">Total Usuarios</div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              {users.length}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">Total Reservas</div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl">📋</span>
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              {reservations.length}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 mb-8 overflow-hidden animate-fade-in-up">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[150px] px-6 py-4 font-semibold text-sm transition-all duration-300 relative ${
                  activeTab === tab.id
                    ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.name}</span>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <>
                {/* Cars Tab */}
                {activeTab === 'cars' && (
                  <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Gestión de Coches</h2>
                      <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Añadir Coche</span>
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-200">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Coche</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Potencia</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Precio/Día</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {cars.map((car) => (
                            <tr key={car.id} className="hover:bg-blue-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="text-3xl">🏎️</div>
                                  <div>
                                    <div className="font-bold text-gray-900">{car.brand} {car.model}</div>
                                    <div className="text-sm text-gray-500">{car.year}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  car.type === 'Racing' ? 'bg-red-100 text-red-800' :
                                  car.type === 'Drift' ? 'bg-purple-100 text-purple-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {car.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-semibold text-gray-900">{car.power} CV</td>
                              <td className="px-6 py-4 font-bold text-blue-600">{car.pricePerDay}€</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  car.status === 'Available' ? 'bg-green-100 text-green-800' :
                                  car.status === 'Rented' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {car.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteCar(car.id)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Circuits Tab */}
                {activeTab === 'circuits' && (
                  <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Gestión de Circuitos</h2>
                      <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Añadir Circuito</span>
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-orange-50 to-red-50 border-b-2 border-orange-200">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Circuito</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ubicación</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Longitud</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Superficie</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {circuits.map((circuit) => (
                            <tr key={circuit.id} className="hover:bg-orange-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="text-3xl">🏁</div>
                                  <div className="font-bold text-gray-900">{circuit.name}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{circuit.location}</div>
                                <div className="text-xs text-gray-500">{circuit.province}</div>
                              </td>
                              <td className="px-6 py-4 font-semibold text-gray-900">{circuit.lengthMeters} m</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  circuit.surfaceType === 'Asphalt' ? 'bg-gray-100 text-gray-800' :
                                  circuit.surfaceType === 'Mixed' ? 'bg-orange-100 text-orange-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {circuit.surfaceType}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  circuit.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {circuit.isAvailable ? 'Disponible' : 'No disponible'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <button className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteCircuit(circuit.id)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="text-8xl mb-4">👥</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h3>
                    <p className="text-gray-600">Próximamente disponible</p>
                  </div>
                )}

                {/* Reservations Tab */}
                {activeTab === 'reservations' && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Reservas</h2>
                    <div className="space-y-4">
                      {reservations.map((reservation) => (
                        <div key={reservation.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-400 hover:shadow-lg transition-all duration-300">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900 mb-2">
                                {reservation.car?.brand} {reservation.car?.model} - {reservation.circuit?.name}
                              </h3>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Cliente:</span>
                                  <span className="ml-2 font-semibold">{reservation.user?.firstName} {reservation.user?.lastName}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Fechas:</span>
                                  <span className="ml-2 font-semibold">
                                    {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Total:</span>
                                  <span className="ml-2 font-bold text-green-600">{reservation.totalPrice}€</span>
                                </div>
                              </div>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                              reservation.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                              reservation.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              reservation.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {reservation.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
