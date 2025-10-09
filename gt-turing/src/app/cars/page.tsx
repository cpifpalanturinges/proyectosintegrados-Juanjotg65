'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Car } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CarsPage() {
  const { t } = useLanguage();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    minPower: '',
    maxPower: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      setError('');
      
      const filterObj: any = {};
      if (filters.type) filterObj.type = filters.type;
      if (filters.minPower) filterObj.minPower = parseInt(filters.minPower);
      if (filters.maxPower) filterObj.maxPower = parseInt(filters.maxPower);
      if (filters.minPrice) filterObj.minPricePerDay = parseInt(filters.minPrice);
      if (filters.maxPrice) filterObj.maxPricePerDay = parseInt(filters.maxPrice);

      const data = await apiClient.getCars(filterObj);
      setCars(data);
    } catch (err: any) {
      setError('Error al cargar los coches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const applyFilters = () => {
    loadCars();
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      minPower: '',
      maxPower: '',
      minPrice: '',
      maxPrice: ''
    });
    setTimeout(() => loadCars(), 100);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Racing': return 'bg-red-100 text-red-800';
      case 'Drift': return 'bg-purple-100 text-purple-800';
      case 'Hybrid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-6xl font-bold mb-4 tracking-tight">Nuestra Flota</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Descubre los coches más potentes y emocionantes para tu experiencia en pista
            </p>
            <div className="mt-8 flex justify-center items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-3xl">🏎️</span>
                <span>{cars.length} Coches</span>
              </div>
              <span className="text-blue-300">•</span>
              <div className="flex items-center space-x-2">
                <span className="text-3xl">⚡</span>
                <span>Desde 300 CV</span>
              </div>
              <span className="text-blue-300">•</span>
              <div className="flex items-center space-x-2">
                <span className="text-3xl">💰</span>
                <span>Mejores Precios</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filtros Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-100 sticky top-4 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtros
              </h2>
              
              <div className="space-y-6">
                <div className="pb-6 border-b border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Tipo de Coche
                  </label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-blue-300"
                  >
                    <option value="">Todos</option>
                    <option value="Racing">🏁 Competición</option>
                    <option value="Drift">💨 Drift</option>
                    <option value="Hybrid">⚡ Híbrido</option>
                  </select>
                </div>

                <div className="pb-6 border-b border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Potencia (CV)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      name="minPower"
                      value={filters.minPower}
                      onChange={handleFilterChange}
                      placeholder="Mín"
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300"
                    />
                    <input
                      type="number"
                      name="maxPower"
                      value={filters.maxPower}
                      onChange={handleFilterChange}
                      placeholder="Máx"
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300"
                    />
                  </div>
                </div>

                <div className="pb-6 border-b border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Precio/Día (€)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Mín"
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Máx"
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={applyFilters}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Aplicar Filtros</span>
                  </button>
                  <button
                    onClick={clearFilters}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Limpiar Filtros</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-16">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600 text-lg">Cargando coches...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center animate-fade-in">
                <div className="text-4xl mb-2">❌</div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            ) : cars.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center animate-fade-in">
                <div className="text-6xl mb-3">🔍</div>
                <p className="text-gray-700 text-lg font-medium">No se encontraron coches con los filtros aplicados</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-gray-600">
                    <span className="font-bold text-blue-600 text-lg">{cars.length}</span> coches encontrados
                  </p>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {cars.map((car, index) => (
                    <div
                      key={car.id}
                      className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-2 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative h-48 bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="text-center relative z-10">
                          <div className="text-7xl mb-2 transform group-hover:scale-110 transition-transform duration-300">🏎️</div>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(car.type)}`}>
                            {car.type}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                          {car.brand} {car.model}
                        </h3>
                        
                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">⚡</span>
                            <span className="font-medium">{car.power} CV</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">📅</span>
                            <span>{car.year}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{car.status === 'Available' ? '✅' : '🔒'}</span>
                            <span className={car.status === 'Available' ? 'text-green-600 font-medium' : 'text-red-600'}>
                              {car.status === 'Available' ? 'Disponible' : car.status === 'Rented' ? 'Alquilado' : 'Mantenimiento'}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 mt-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{car.pricePerDay}€</span>
                              <span className="text-gray-600 text-sm">/día</span>
                            </div>
                            <Link
                              href={`/cars/${car.id}`}
                              className="group/btn bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
                            >
                              <span>Ver Detalles</span>
                              <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
