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
import { useToast } from '@/components/Toast';
import { useConfirm } from '@/components/ConfirmDialog';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { showToast, ToastContainer } = useToast();
  const { confirm, ConfirmDialogComponent } = useConfirm();
  
  const [activeTab, setActiveTab] = useState<'cars' | 'circuits' | 'users' | 'reservations'>('cars');
  const [cars, setCars] = useState<Car[]>([]);
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [connectedUserIds, setConnectedUserIds] = useState<string[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showCarModal, setShowCarModal] = useState(false);
  const [showCircuitModal, setShowCircuitModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [editingCircuit, setEditingCircuit] = useState<Circuit | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (authLoading) return;
    
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, isAdmin, authLoading, activeTab]);

  // Update connected users every 5 seconds when on users tab
  useEffect(() => {
    if (activeTab !== 'users' || !isAdmin) return;

    const interval = setInterval(async () => {
      try {
        const connectedIds = await apiClient.getConnectedUsers();
        setConnectedUserIds(connectedIds);
      } catch (error) {
        console.error('Error updating connected users:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab, isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'cars') {
        const data = await apiClient.getCars();
        setCars(data);
      } else if (activeTab === 'circuits') {
        const data = await apiClient.getCircuits();
        setCircuits(data);
      } else if (activeTab === 'users') {
        const [usersData, connectedIds] = await Promise.all([
          apiClient.getUsers(),
          apiClient.getConnectedUsers()
        ]);
        setUsers(usersData);
        setConnectedUserIds(connectedIds);
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
    confirm(
      t('admin.confirmDelete.carTitle'),
      t('admin.confirmDelete.carMessage'),
      async () => {
        try {
          await apiClient.deleteCar(id);
          showToast(t('admin.toast.carDeleted'), 'success');
          await loadData();
        } catch (error) {
          showToast(t('admin.toast.carDeleteError'), 'error');
        }
      },
      'danger'
    );
  };

  const handleDeleteCircuit = async (id: string) => {
    confirm(
      t('admin.confirmDelete.circuitTitle'),
      t('admin.confirmDelete.circuitMessage'),
      async () => {
        try {
          await apiClient.deleteCircuit(id);
          showToast(t('admin.toast.circuitDeleted'), 'success');
          await loadData();
        } catch (error) {
          showToast(t('admin.toast.circuitDeleteError'), 'error');
        }
      },
      'danger'
    );
  };

  const handleToggleBlockUser = async (id: string, currentlyBlocked: boolean) => {
    const action = currentlyBlocked ? 'desbloquear' : 'bloquear';
    confirm(
      currentlyBlocked ? t('admin.blockUser.unblockTitle') : t('admin.blockUser.blockTitle'),
      currentlyBlocked ? t('admin.blockUser.unblockMessage') : t('admin.blockUser.blockMessage'),
      async () => {
        try {
          await apiClient.toggleBlockUser(id, !currentlyBlocked);
          showToast(currentlyBlocked ? t('admin.toast.userUnblocked') : t('admin.toast.userBlocked'), 'success');
          await loadData();
        } catch (error) {
          showToast(t('admin.toast.userUpdateError'), 'error');
        }
      },
      currentlyBlocked ? 'info' : 'warning'
    );
  };

  const handleChangeUserRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'Admin' ? 'User' : 'Admin';
    confirm(
      t('admin.changeRole.title'),
      `${t('admin.changeRole.message')} ${newRole}?`,
      async () => {
        try {
          await apiClient.updateUserRole(id, newRole);
          showToast(t('admin.toast.roleUpdated'), 'success');
          await loadData();
        } catch (error) {
          showToast(t('admin.toast.roleUpdateError'), 'error');
        }
      },
      'info'
    );
  };

  const handleDeleteUser = async (id: string) => {
    confirm(
      t('admin.confirmDelete.userTitle'),
      t('admin.confirmDelete.userMessage'),
      async () => {
        try {
          await apiClient.deleteUser(id);
          showToast(t('admin.toast.userDeleted'), 'success');
          await loadData();
        } catch (error) {
          showToast(t('admin.toast.userDeleteError'), 'error');
        }
      },
      'danger'
    );
  };

  // Get user connection status
  const getUserStatus = (user: User) => {
    if (user.isBlocked) {
      return { 
        label: '🔒 Bloqueado', 
        color: 'bg-red-100 text-red-800',
        tooltip: 'Usuario bloqueado por administrador'
      };
    }
    if (connectedUserIds.includes(user.id)) {
      return { 
        label: '🟢 Conectado', 
        color: 'bg-green-100 text-green-800',
        tooltip: 'Usuario conectado al chat'
      };
    }
    return { 
      label: '⚫ Desconectado', 
      color: 'bg-gray-100 text-gray-800',
      tooltip: 'Usuario no conectado'
    };
  };

  // Modal handlers
  const openCarModal = (car?: Car) => {
    setEditingCar(car || null);
    setShowCarModal(true);
  };

  const openCircuitModal = (circuit?: Circuit) => {
    setEditingCircuit(circuit || null);
    setShowCircuitModal(true);
  };

  const openUserModal = (user: User) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const closeModals = () => {
    setShowCarModal(false);
    setShowCircuitModal(false);
    setShowUserModal(false);
    setEditingCar(null);
    setEditingCircuit(null);
    setEditingUser(null);
  };

  const handleSaveCar = async (carData: Partial<Car>) => {
    try {
      console.log('🚗 handleSaveCar - Datos recibidos:', carData);
      
      if (editingCar) {
        console.log('✏️ Actualizando coche existente:', editingCar.id);
        const result = await apiClient.updateCar(editingCar.id, carData);
        console.log('✅ Coche actualizado:', result);
        showToast(t('admin.toast.carUpdated'), 'success');
      } else {
        console.log('➕ Creando nuevo coche');
        const result = await apiClient.createCar(carData);
        console.log('✅ Coche creado:', result);
        showToast(t('admin.toast.carCreated'), 'success');
      }
      
      console.log('🔄 Recargando lista de coches...');
      const data = await apiClient.getCars();
      console.log('📋 Coches recargados:', data.length, 'coches');
      setCars(data);
      console.log('🚪 Cerrando modal');
      closeModals();
    } catch (error) {
      console.error('❌ Error en handleSaveCar:', error);
      showToast(error instanceof Error ? error.message : t('admin.toast.carSaveError'), 'error');
    }
  };

  const handleSaveCircuit = async (circuitData: Partial<Circuit>) => {
    try {
      console.log('🏁 handleSaveCircuit - Datos recibidos:', circuitData);
      
      if (editingCircuit) {
        console.log('✏️ Actualizando circuito existente:', editingCircuit.id);
        const result = await apiClient.updateCircuit(editingCircuit.id, circuitData);
        console.log('✅ Circuito actualizado:', result);
        showToast(t('admin.toast.circuitUpdated'), 'success');
      } else {
        console.log('➕ Creando nuevo circuito');
        const result = await apiClient.createCircuit(circuitData);
        console.log('✅ Circuito creado:', result);
        showToast(t('admin.toast.circuitCreated'), 'success');
      }
      
      console.log('🔄 Recargando lista de circuitos...');
      const data = await apiClient.getCircuits();
      console.log('📋 Circuitos recargados:', data.length, 'circuitos');
      setCircuits(data);
      console.log('🚪 Cerrando modal');
      closeModals();
    } catch (error) {
      console.error('❌ Error en handleSaveCircuit:', error);
      showToast(error instanceof Error ? error.message : t('admin.toast.circuitSaveError'), 'error');
    }
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      if (editingUser) {
        await apiClient.updateUser(editingUser.id, userData);
        showToast(t('admin.toast.userUpdated'), 'success');
      }
      // Recargar SIEMPRE los usuarios
      const [usersData, connectedIds] = await Promise.all([
        apiClient.getUsers(),
        apiClient.getConnectedUsers()
      ]);
      setUsers(usersData);
      setConnectedUserIds(connectedIds);
      closeModals();
    } catch (error) {
      showToast(t('admin.toast.userUpdateError'), 'error');
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
      <ToastContainer />
      <ConfirmDialogComponent />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Coches</h2>
                      <button 
                        onClick={() => openCarModal()}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold flex items-center justify-center space-x-2"
                      >
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
                                  <button 
                                    onClick={() => openCarModal(car)}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                    title={t('admin.actions.editCar')}
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteCar(car.id)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                    title={t('admin.actions.deleteCar')}
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
                      <button 
                        onClick={() => openCircuitModal()}
                        className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold flex items-center space-x-2"
                      >
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
                                  {t(`circuits.surface.${circuit.surfaceType.toLowerCase()}`)}
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
                                  <button 
                                    onClick={() => openCircuitModal(circuit)}
                                    className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition"
                                    title={t('admin.actions.editCircuit')}
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteCircuit(circuit.id)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                    title={t('admin.actions.deleteCircuit')}
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
                  <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Teléfono</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user.id} className="hover:bg-purple-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-bold text-gray-900">{user.firstName} {user.lastName}</div>
                                    <div className="text-xs text-gray-500">
                                      Registrado: {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{user.email}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-600">{user.phone || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => handleChangeUserRole(user.id, user.role)}
                                  className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition ${
                                    user.role === 'Admin' 
                                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                  }`}
                                  title="Click para cambiar rol"
                                >
                                  {user.role === 'Admin' ? '👑 Admin' : '👤 User'}
                                </button>
                              </td>
                              <td className="px-6 py-4">
                                {(() => {
                                  const status = getUserStatus(user);
                                  return (
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
                                      title={status.tooltip}
                                    >
                                      {status.label}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => openUserModal(user)}
                                    className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition"
                                    title="Editar usuario"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleToggleBlockUser(user.id, user.isBlocked)}
                                    className={`p-2 rounded-lg transition ${
                                      user.isBlocked
                                        ? 'text-green-600 hover:bg-green-100'
                                        : 'text-orange-600 hover:bg-orange-100'
                                    }`}
                                    title={user.isBlocked ? 'Desbloquear usuario' : 'Bloquear usuario'}
                                  >
                                    {user.isBlocked ? (
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                      </svg>
                                    ) : (
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                      </svg>
                                    )}
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                    title={t('admin.actions.deleteUser')}
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
                      {users.length === 0 && (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4">👥</div>
                          <p className="text-gray-600">No hay usuarios registrados</p>
                        </div>
                      )}
                    </div>
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
                                  <span className="ml-2 font-semibold text-gray-900">{reservation.user?.firstName} {reservation.user?.lastName}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Fechas:</span>
                                  <span className="ml-2 font-semibold text-gray-900">
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

      {/* Car Modal */}
      {showCarModal && (
        <CarModal
          car={editingCar}
          onClose={closeModals}
          onSave={handleSaveCar}
        />
      )}

      {/* Circuit Modal */}
      {showCircuitModal && (
        <CircuitModal
          circuit={editingCircuit}
          onClose={closeModals}
          onSave={handleSaveCircuit}
        />
      )}

      {/* User Modal */}
      {showUserModal && editingUser && (
        <UserModal
          user={editingUser}
          onClose={closeModals}
          onSave={handleSaveUser}
        />
      )}

      <Footer />
    </div>
  );
}

// Car Modal Component
function CarModal({ car, onClose, onSave }: { car: Car | null; onClose: () => void; onSave: (data: Partial<Car>) => void }) {
  const [formData, setFormData] = useState({
    brand: car?.brand || '',
    model: car?.model || '',
    year: car?.year || new Date().getFullYear(),
    type: car?.type || 'Racing' as 'Racing' | 'Drift' | 'Hybrid',
    power: car?.power || 100,
    pricePerDay: car?.pricePerDay || 100,
    status: car?.status || 'Available' as 'Available' | 'Rented' | 'Maintenance',
    description: car?.description || '',
    imageUrl: car?.imageUrl || '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(car?.imageUrl || '');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      console.log('📝 CarModal - Iniciando handleSubmit');
      console.log('📝 CarModal - formData:', formData);
      
      let imageUrl = '/images/coche1.jpg'; // Imagen por defecto

      // Upload image if a file was selected
      if (selectedFile) {
        console.log('📤 CarModal - Subiendo imagen:', selectedFile.name);
        // Generate filename from brand and model
        const fileName = `${formData.brand.trim()}_${formData.model.trim()}`.replace(/\s+/g, '_');
        const uploadResult = await apiClient.uploadImage(selectedFile, fileName);
        imageUrl = uploadResult.imageUrl;
        console.log('✅ CarModal - Imagen subida:', imageUrl);
      } else if (car && car.imageUrl) {
        // If editing and no new file, keep the existing image
        imageUrl = car.imageUrl;
        console.log('🔄 CarModal - Manteniendo imagen existente:', imageUrl);
      } else {
        console.log('🖼️ CarModal - Usando imagen por defecto:', imageUrl);
      }

      // Send only the fields expected by the backend DTO
      const dataToSend: any = {
        model: formData.model.trim(),
        brand: formData.brand.trim(),
        year: formData.year,
        power: formData.power,
        type: formData.type,
        pricePerDay: formData.pricePerDay,
        status: formData.status,
        imageUrl: imageUrl, // Always send imageUrl
      };
      
      // Only add optional fields if they have valid values
      if (formData.description && formData.description.trim()) {
        dataToSend.description = formData.description.trim();
      }
      
      console.log('📨 CarModal - Enviando datos a onSave:', dataToSend);
      await onSave(dataToSend);
      console.log('✅ CarModal - onSave completado');
    } catch (error) {
      console.error('❌ CarModal - Error:', error);
      alert('Error al subir la imagen. Por favor, intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{car ? 'Editar Coche' : 'Añadir Coche'}</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Marca *</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Ej: Nissan"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Modelo *</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Ej: Skyline GT-R"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Año *</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                min="1900"
                max="2100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Racing' | 'Drift' | 'Hybrid' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="Racing">Racing</option>
                <option value="Drift">Drift</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Potencia (CV) *</label>
              <input
                type="number"
                value={formData.power}
                onChange={(e) => setFormData({ ...formData, power: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                min="50"
                max="2000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Precio/Día (€) *</label>
              <input
                type="number"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                min="1"
                max="100000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Estado *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Available' | 'Rented' | 'Maintenance' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="Available">Disponible</option>
              <option value="Rented">Alquilado</option>
              <option value="Maintenance">Mantenimiento</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Imagen del Coche</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {previewUrl && (
              <div className="mt-3">
                <img src={previewUrl} alt="Preview" className="max-h-40 rounded-lg border border-gray-300" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción (opcional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              rows={3}
              placeholder="Descripción del coche..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              disabled={uploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={uploading}
            >
              {uploading ? 'Subiendo...' : (car ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Circuit Modal Component
function CircuitModal({ circuit, onClose, onSave }: { circuit: Circuit | null; onClose: () => void; onSave: (data: Partial<Circuit>) => Promise<void> }) {
  const [formData, setFormData] = useState({
    name: circuit?.name || '',
    location: circuit?.location || '',
    province: circuit?.province || '',
    lengthMeters: circuit?.lengthMeters || 1000,
    widthMeters: circuit?.widthMeters || 10,
    surfaceType: circuit?.surfaceType || 'Asphalt' as 'Asphalt' | 'Concrete' | 'Mixed',
    elevationChange: circuit?.elevationChange || 0,
    numberOfCorners: circuit?.numberOfCorners || 0,
    isAvailable: circuit?.isAvailable ?? true,
    description: circuit?.description || '',
    imageUrl: circuit?.imageUrl || '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(circuit?.imageUrl || '');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      console.log('📝 CircuitModal - Iniciando handleSubmit');
      console.log('📝 CircuitModal - formData:', formData);
      
      let imageUrl = '/images/barcelona.jpg'; // Imagen por defecto para circuitos

      // Upload image if a file was selected
      if (selectedFile) {
        console.log('📤 CircuitModal - Subiendo imagen:', selectedFile.name);
        const fileName = formData.name.trim().replace(/\s+/g, '_');
        const uploadResult = await apiClient.uploadImage(selectedFile, fileName);
        imageUrl = uploadResult.imageUrl;
        console.log('✅ CircuitModal - Imagen subida:', imageUrl);
      } else if (circuit && circuit.imageUrl) {
        imageUrl = circuit.imageUrl;
        console.log('🔄 CircuitModal - Manteniendo imagen existente:', imageUrl);
      } else {
        console.log('🖼️ CircuitModal - Usando imagen por defecto:', imageUrl);
      }

      // Send only the fields expected by the backend DTO
      const dataToSend: any = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        province: formData.province.trim(),
        lengthMeters: formData.lengthMeters,
        widthMeters: formData.widthMeters,
        surfaceType: formData.surfaceType,
        isAvailable: formData.isAvailable,
        imageUrl: imageUrl, // Always send imageUrl
      };
      
      // Only add optional fields if they have valid values
      if (formData.elevationChange && formData.elevationChange > 0) {
        dataToSend.elevationChange = formData.elevationChange;
      }
      
      if (formData.numberOfCorners && formData.numberOfCorners > 0) {
        dataToSend.numberOfCorners = formData.numberOfCorners;
      }
      
      if (formData.description && formData.description.trim()) {
        dataToSend.description = formData.description.trim();
      }
      
      console.log('📨 CircuitModal - Enviando datos a onSave:', dataToSend);
      await onSave(dataToSend);
      console.log('✅ CircuitModal - onSave completado');
    } catch (error) {
      console.error('❌ CircuitModal - Error:', error);
      alert('Error al subir la imagen. Por favor, intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{circuit ? 'Editar Circuito' : 'Añadir Circuito'}</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                placeholder="Ej: Circuito de Jerez"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ubicación *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                placeholder="Ej: Jerez de la Frontera"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Provincia *</label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                placeholder="Ej: Cádiz"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Superficie *</label>
              <select
                value={formData.surfaceType}
                onChange={(e) => setFormData({ ...formData, surfaceType: e.target.value as 'Asphalt' | 'Concrete' | 'Mixed' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
              >
                <option value="Asphalt">Asfalto</option>
                <option value="Concrete">Hormigón</option>
                <option value="Mixed">Mixto</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Longitud (metros) *</label>
              <input
                type="number"
                value={formData.lengthMeters}
                onChange={(e) => setFormData({ ...formData, lengthMeters: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                min="500"
                max="10000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ancho (metros) *</label>
              <input
                type="number"
                value={formData.widthMeters}
                onChange={(e) => setFormData({ ...formData, widthMeters: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                min="5"
                max="50"
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Desnivel (metros)</label>
              <input
                type="number"
                value={formData.elevationChange}
                onChange={(e) => setFormData({ ...formData, elevationChange: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                min="0"
                max="500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Número de Curvas</label>
              <input
                type="number"
                value={formData.numberOfCorners}
                onChange={(e) => setFormData({ ...formData, numberOfCorners: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                min="1"
                max="50"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm font-semibold text-gray-700">Circuito disponible</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Imagen del Circuito</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
            {previewUrl && (
              <div className="mt-3">
                <img src={previewUrl} alt="Preview" className="max-h-40 rounded-lg border border-gray-300" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción (opcional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
              rows={3}
              placeholder="Descripción del circuito..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              disabled={uploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={uploading}
            >
              {uploading ? 'Subiendo...' : (circuit ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// User Modal Component
function UserModal({ user, onClose, onSave }: { user: User; onClose: () => void; onSave: (data: Partial<User>) => void }) {
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Editar Usuario</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Apellidos</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold"
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
