'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiClient } from '@/lib/api-client';
import { Car, Circuit } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Calendar from '@/components/Calendar';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function NewReservationPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  
  const [step, setStep] = useState(1);
  const [cars, setCars] = useState<Car[]>([]);
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnTime, setReturnTime] = useState('18:00');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [carsData, circuitsData] = await Promise.all([
        apiClient.getCars({ status: 'Available' }),
        apiClient.getCircuits({ isAvailable: true })
      ]);
      setCars(carsData);
      setCircuits(circuitsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedCar || !startDate || !endDate) return 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return selectedCar.pricePerDay * days;
  };

  const createReservation = async () => {
    if (!selectedCar || !selectedCircuit || !startDate || !endDate) return;

    setLoading(true);
    try {
      await apiClient.createReservation({
        carId: selectedCar.id,
        circuitId: selectedCircuit.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        pickupTime,
        returnTime
      });
      router.push('/dashboard?reservation=success');
    } catch (error) {
      alert('Error al crear la reserva');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getUnavailableDates = () => {
    // Aquí podrías cargar las fechas no disponibles del servidor
    // Por ahora retornamos algunas fechas de ejemplo
    const today = new Date();
    return [
      new Date(today.getFullYear(), today.getMonth(), 15),
      new Date(today.getFullYear(), today.getMonth(), 16),
      new Date(today.getFullYear(), today.getMonth(), 25),
    ];
  };

  if (loading && (cars.length === 0 || circuits.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl font-bold mb-2">Nueva Reserva</h1>
            <p className="text-xl text-green-100">
              Reserva tu experiencia en pista paso a paso
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  step >= num
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > num ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  num
                )}
              </div>
              {num < 4 && (
                <div
                  className={`w-24 h-1 mx-2 transition-colors duration-300 ${
                    step > num ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="max-w-5xl mx-auto">
          {/* Step 1: Select Car */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Selecciona tu Coche
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <div
                    key={car.id}
                    onClick={() => setSelectedCar(car)}
                    className={`group cursor-pointer bg-white rounded-xl shadow-lg p-6 border-2 transition-all duration-300 transform hover:-translate-y-2 ${
                      selectedCar?.id === car.id
                        ? 'border-green-600 shadow-2xl scale-105'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-2">🏎️</div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-gray-600">{car.year}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Potencia:</span>
                        <span className="font-bold">{car.power} CV</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Precio:</span>
                        <span className="font-bold text-green-600">{car.pricePerDay}€/día</span>
                      </div>
                    </div>
                    {selectedCar?.id === car.id && (
                      <div className="mt-4 text-center">
                        <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          ✓ Seleccionado
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Circuit */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Selecciona el Circuito
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {circuits.map((circuit) => (
                  <div
                    key={circuit.id}
                    onClick={() => setSelectedCircuit(circuit)}
                    className={`group cursor-pointer bg-white rounded-xl shadow-lg p-6 border-2 transition-all duration-300 transform hover:-translate-y-2 ${
                      selectedCircuit?.id === circuit.id
                        ? 'border-green-600 shadow-2xl scale-105'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-5xl">🏁</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {circuit.name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>📍 {circuit.location}, {circuit.province}</p>
                          <p>📏 {circuit.lengthMeters} metros</p>
                          <p>🛣️ {circuit.surfaceType}</p>
                        </div>
                        {selectedCircuit?.id === circuit.id && (
                          <div className="mt-3">
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              ✓ Seleccionado
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select Dates */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Selecciona las Fechas
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Fecha de Inicio</h3>
                  <Calendar
                    selectedDate={startDate}
                    onDateSelect={setStartDate}
                    unavailableDates={getUnavailableDates()}
                    minDate={new Date()}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Fecha de Fin</h3>
                  <Calendar
                    selectedDate={endDate}
                    onDateSelect={setEndDate}
                    unavailableDates={getUnavailableDates()}
                    minDate={startDate || new Date()}
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Hora de Recogida
                  </label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Hora de Devolución
                  </label>
                  <input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Confirma tu Reserva
              </h2>
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="text-gray-600 font-medium">Coche:</span>
                    <span className="text-xl font-bold text-gray-900">
                      {selectedCar?.brand} {selectedCar?.model}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="text-gray-600 font-medium">Circuito:</span>
                    <span className="text-xl font-bold text-gray-900">{selectedCircuit?.name}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="text-gray-600 font-medium">Fechas:</span>
                    <span className="font-bold text-gray-900">
                      {startDate?.toLocaleDateString('es-ES')} - {endDate?.toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="text-gray-600 font-medium">Horario:</span>
                    <span className="font-bold text-gray-900">
                      {pickupTime} - {returnTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-2xl font-bold text-gray-900">Total:</span>
                    <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {calculateTotalPrice()}€
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Anterior</span>
            </button>

            {step < 4 ? (
              <button
                onClick={nextStep}
                disabled={
                  (step === 1 && !selectedCar) ||
                  (step === 2 && !selectedCircuit) ||
                  (step === 3 && (!startDate || !endDate))
                }
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
              >
                <span>Siguiente</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={createReservation}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Confirmar Reserva</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
