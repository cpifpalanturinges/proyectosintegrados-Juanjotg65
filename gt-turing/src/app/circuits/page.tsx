'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DetailsModal from '@/components/DetailsModal';
import { apiClient } from '@/lib/api-client';
import { Circuit } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CircuitsPage() {
  const { t } = useLanguage();
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    province: '',
    surface: '',
    minLength: '',
    maxLength: '',
    minPrice: '',
    maxPrice: ''
  });

  // Backend origin derived from NEXT_PUBLIC_API_URL (strip trailing /api)
  const backendOrigin = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api$/, '');

  useEffect(() => {
    loadCircuits();
  }, []);

  const loadCircuits = async () => {
    try {
      setLoading(true);
      setError('');
      
      const filterObj: any = {};
      if (filters.province) filterObj.province = filters.province;
      if (filters.surface) filterObj.surface = filters.surface;
      if (filters.minLength) filterObj.minLength = parseInt(filters.minLength);
      if (filters.maxLength) filterObj.maxLength = parseInt(filters.maxLength);
      if (filters.minPrice) filterObj.minPricePerHour = parseInt(filters.minPrice);
      if (filters.maxPrice) filterObj.maxPricePerHour = parseInt(filters.maxPrice);

      const data = await apiClient.getCircuits(filterObj);
      setCircuits(data);
    } catch (err: any) {
      setError('Error al cargar los circuitos');
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
    loadCircuits();
  };

  const clearFilters = () => {
    setFilters({
      province: '',
      surface: '',
      minLength: '',
      maxLength: '',
      minPrice: '',
      maxPrice: ''
    });
    // Immediately reload circuits from API so clearing updates results reliably
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await apiClient.getCircuits({});
        setCircuits(data);
      } catch (err: any) {
        setError('Error al cargar los circuitos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  };

  const provinces = Array.from(new Set(circuits.map(c => c.province))).sort();

  const getSurfaceColor = (surface: string) => {
    switch (surface) {
      case 'Asphalt': return 'bg-gray-100 text-gray-800';
      case 'Concrete': return 'bg-gray-200 text-gray-900';
      case 'Mixed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getSurfaceIcon = (surface: string) => {
    switch (surface) {
      case 'Asphalt': return '🛣️';
      case 'Concrete': return '🏗️';
      case 'Mixed': return '🏁';
      default: return '🏗️';
    }
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [modalCircuit, setModalCircuit] = useState<Circuit | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-6xl font-bold mb-4 tracking-tight">{t('circuits.title')}</h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              {t('circuits.subtitle')}
            </p>
            <div className="mt-8 flex justify-center items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-3xl">🏁</span>
                <span>{circuits.length} {t('circuits.count')}</span>
              </div>
              <span className="text-red-300">•</span>
              <div className="flex items-center space-x-2">
                <span className="text-3xl">📍</span>
                <span>Por toda España</span>
              </div>
              <span className="text-red-300">•</span>
              <div className="flex items-center space-x-2">
                <span className="text-3xl">⭐</span>
                <span>Alta Calidad</span>
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
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent flex items-center">
                <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {t('circuits.filters')}
              </h2>
              
              <div className="space-y-6">
                <div className="pb-6 border-b border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    {t('circuits.filterProvince')}
                  </label>
                  <select
                    name="province"
                    value={filters.province}
                    onChange={handleFilterChange}
                    className="w-full text-gray-900 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white hover:border-orange-300"
                  >
                    <option value="">Todas</option>
                    {provinces.map(prov => (
                      <option key={prov} value={prov}>📍 {prov}</option>
                    ))}
                  </select>
                </div>

                <div className="pb-6 border-b border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    {t('circuits.filterSurface')}
                  </label>
                  <select
                    name="surface"
                    value={filters.surface}
                    onChange={handleFilterChange}
                    className="w-full text-gray-900 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white hover:border-orange-300"
                  >
                    <option value="">Todas</option>
                    <option value="Asphalt">🛣️ {t('circuits.surface.asphalt')}</option>
                    <option value="Concrete">🏗️ {t('circuits.surface.concrete')}</option>
                    <option value="Mixed">🏁 {t('circuits.surface.mixed')}</option>
                  </select>
                </div>

                <div className="pb-6 border-b border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    {t('circuits.filterLength')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="number"
                      name="minLength"
                      value={filters.minLength}
                      onChange={handleFilterChange}
                      placeholder="Mín"
                      className="w-full text-gray-900 placeholder-gray-400 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-orange-300"
                    />
                    <input
                      type="number"
                      name="maxLength"
                      value={filters.maxLength}
                      onChange={handleFilterChange}
                      placeholder={t('circuits.max')}
                      className="w-full text-gray-900 placeholder-gray-400 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-orange-300"
                    />
                  </div>
                </div>

                <div className="pb-6 border-b border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    {t('circuits.filterPrice')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder={t('circuits.min')}
                      className="w-full text-gray-900 placeholder-gray-400 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-orange-300"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder={t('circuits.max')}
                      className="w-full text-gray-900 placeholder-gray-400 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-orange-300"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={applyFilters}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t('circuits.apply')}</span>
                  </button>
                  <button
                    onClick={clearFilters}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>{t('circuits.clear')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Circuits Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-16">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600 text-lg">{t('circuits.loading')}</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center animate-fade-in">
                <div className="text-4xl mb-2">❌</div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            ) : circuits.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center animate-fade-in">
                <div className="text-6xl mb-3">🔍</div>
                <p className="text-gray-700 text-lg font-medium">{t('circuits.noResults')}</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  {t('circuits.clear')}
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-gray-600">
                    <span className="font-bold text-orange-500 text-lg">{circuits.length}</span> {t('circuits.found')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {circuits.map((circuit, index) => (
                    <div
                      key={circuit.id}
                      className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-2 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative h-48 bg-gradient-to-br from-orange-500 via-red-600 to-red-800 overflow-hidden">
                        {/* image fills header */}
                        <img
                          src={`${backendOrigin}${circuit.imageUrl}`}
                          alt={circuit.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={e => { (e.currentTarget as HTMLImageElement).src = '/window.svg'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {/* centered surface badge */}
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getSurfaceColor(circuit.surfaceType)} bg-white/70 shadow-sm`}>
                            {getSurfaceIcon(circuit.surfaceType)} {t(`circuits.surface.${circuit.surfaceType.toLowerCase()}`)}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition">
                          {circuit.name}
                        </h3>
                        
                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">📍</span>
                            <span className="font-medium">{circuit.location}, {circuit.province}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">📏</span>
                            <span>{circuit.lengthMeters.toLocaleString()} m × {circuit.widthMeters} m</span>
                          </div>
                          {circuit.numberOfCorners && (
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">🎯</span>
                              <span>{circuit.numberOfCorners} {t('circuits.corners')}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{circuit.isAvailable ? '✅' : '🔒'}</span>
                            <span className={circuit.isAvailable ? 'text-green-600 font-medium' : 'text-red-600'}>
                              {circuit.isAvailable ? t('circuits.available') : t('circuits.notAvailable')}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 mt-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">{t('circuits.consultPrice')}</span>
                              <span className="text-gray-600 text-xs block">precio</span>
                            </div>
                            <button
                              onClick={() => { setModalCircuit(circuit); setModalOpen(true); }}
                              className="group/btn bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2.5 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1"
                            >
                              <span>{t('circuits.viewDetails')}</span>
                              <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
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
      <DetailsModal open={modalOpen} onClose={() => setModalOpen(false)} circuit={modalCircuit} />
    </div>
  );
}
