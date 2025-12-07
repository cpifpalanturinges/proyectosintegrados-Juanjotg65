'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiClient } from '@/lib/api-client';
import { Car, Circuit } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Calendar from '@/components/Calendar';
import TimePicker from '@/components/TimePicker';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/components/Toast';

function ReservationContent() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { showToast, ToastContainer } = useToast();
  
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
    // Wait for auth to finish loading before checking
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, authLoading]);

  // If query params provide preselected carId / circuitId, apply them after data loads
  const searchParams = useSearchParams();
  useEffect(() => {
    if (cars.length === 0 || circuits.length === 0) return;
    const carId = searchParams?.get('carId');
    const circuitId = searchParams?.get('circuitId');
    if (carId) {
      const pre = cars.find(c => c.id === carId);
      if (pre) setSelectedCar(pre);
    }
    if (circuitId) {
      const preC = circuits.find(c => c.id === circuitId);
      if (preC) setSelectedCircuit(preC);
    }
  }, [cars, circuits, searchParams]);

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
      const formatTimeForBackend = (time: string) => {
        // backend expects TimeSpan -> format as HH:mm:ss
        if (!time) return '00:00:00';
        const parts = time.split(':');
        if (parts.length === 3) return time;
        if (parts.length === 2) return `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}:00`;
        return `${time}:00`;
      };

      await apiClient.createReservation({
        carId: selectedCar.id,
        circuitId: selectedCircuit.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        pickupTime: formatTimeForBackend(pickupTime),
        returnTime: formatTimeForBackend(returnTime)
      });
      showToast('¡Reserva creada exitosamente!', 'success');
      setTimeout(() => router.push('/dashboard?reservation=success'), 1000);
    } catch (error) {
      // Try to extract server message
      const raw = (error as any)?.message || 'Error al crear la reserva';
      const translateBackendMessage = (m: string) => {
        // Map common backend messages to Spanish-friendly messages
        const map: Record<string, string> = {
          'Car is not available': 'El coche no está disponible',
          'Circuit is not available': 'El circuito no está disponible',
          'End date must be after start date': 'La fecha de fin debe ser posterior a la fecha de inicio',
          'Start date cannot be in the past': 'La fecha de inicio no puede estar en el pasado',
          'Car is already reserved for these dates': 'El coche ya está reservado para las fechas seleccionadas',
          'Racing cars cannot be assigned to Concrete circuits': 'Los coches de competición no pueden asignarse a circuitos de hormigón',
          'Car not found': 'Coche no encontrado',
          'Circuit not found': 'Circuito no encontrado',
        };
        // Try exact match first
        if (map[m]) return map[m];
        // Try to find a substring match
        for (const key of Object.keys(map)) {
          if (m.includes(key)) return map[key];
        }
        // Fallback: return original message (or a generic Spanish message)
        return m || 'Error al crear la reserva';
      };

      const msg = translateBackendMessage(raw);
      showToast(msg, 'error');
      console.error('Create reservation error:', raw, error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 4) {
      if (step === 1 && !selectedCar) {
        showToast('Por favor, selecciona un coche', 'warning');
        return;
      }
      if (step === 2 && !selectedCircuit) {
        showToast('Por favor, selecciona un circuito', 'warning');
        return;
      }
      if (step === 3 && (!startDate || !endDate)) {
        showToast('Por favor, selecciona las fechas de tu reserva', 'warning');
        return;
      }
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (loading && (cars.length === 0 || circuits.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <ToastContainer />
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ToastContainer />
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
                {cars.map((car) => {
                  return (
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
                  );
                })}
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
                {circuits.map((circuit) => {
                  const incompatible = selectedCar?.type === 'Racing' && circuit.surfaceType === 'Concrete';
                  return (
                  <div
                    key={circuit.id}
                    onClick={() => {
                      if (incompatible) { alert('Este coche de competición no puede correr en circuitos de hormigón'); return; }
                      setSelectedCircuit(circuit);
                    }}
                    className={`group cursor-pointer bg-white rounded-xl shadow-lg p-6 border-2 transition-all duration-300 transform hover:-translate-y-2 ${
                      selectedCircuit?.id === circuit.id
                        ? 'border-green-600 shadow-2xl scale-105'
                        : 'border-gray-200 hover:border-green-300'
                    } ${incompatible ? 'opacity-60 cursor-not-allowed' : ''}`}
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
                          <p>🛣️ {t(`circuits.surface.${circuit.surfaceType.toLowerCase()}`)}</p>
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
                  );
                })}
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
                    carId={selectedCar?.id}
                    minDate={new Date()}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Fecha de Fin</h3>
                  <Calendar
                    selectedDate={endDate}
                    onDateSelect={setEndDate}
                    carId={selectedCar?.id}
                    minDate={startDate || new Date()}
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <TimePicker
                    value={pickupTime}
                    onChange={setPickupTime}
                    label="Hora de Recogida"
                  />
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <TimePicker
                    value={returnTime}
                    onChange={setReturnTime}
                    label="Hora de Devolución"
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

export default function NewReservationPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ReservationContent />
    </Suspense>
  );
}
