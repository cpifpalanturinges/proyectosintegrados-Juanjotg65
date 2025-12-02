"use client";

import { useEffect, useState } from 'react';
import { Car, Circuit } from '@/types';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

type Props = {
  open: boolean;
  onClose: () => void;
  car?: Car | null;
  circuit?: Circuit | null;
};

export default function DetailsModal({ open, onClose, car, circuit }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Array<Car | Circuit>>([]);
  const [selectedCircuitId, setSelectedCircuitId] = useState<string | null>(null);
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api$/, '');

  // When opened for a car, load circuits. When opened for a circuit, load cars.
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    (async () => {
      try {
        if (car) {
          const circuits = await apiClient.getCircuits();
          setItems(circuits as Circuit[]);
        } else if (circuit) {
          const cars = await apiClient.getCars();
          setItems(cars as Car[]);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, car, circuit]);

  if (!open) return null;

  const isCircuitCompatibleWithCar = (c: Circuit) => {
    if (!car) return true;
    if (car.type === 'Racing' && c.surfaceType === 'Concrete') return false;
    return true;
  };

  const isCarCompatibleWithCircuit = (c: Car) => {
    if (!circuit) return true;
    if (c.type === 'Racing' && circuit.surfaceType === 'Concrete') return false;
    return true;
  };

  const handleReserve = () => {
    // navigate to reservations page with selected params
    const params = new URLSearchParams();
    if (car) params.set('carId', car.id);
    if (selectedCircuitId) params.set('circuitId', selectedCircuitId);
    if (circuit && !params.has('circuitId')) params.set('circuitId', circuit.id);
    router.push('/reservations?' + params.toString());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden">
        <div className="p-8">
          <div className="flex items-start justify-between">
            <h3 className="text-3xl font-extrabold text-gray-900">Detalles</h3>
            <button onClick={onClose} aria-label="Cerrar" className="text-gray-500 hover:text-gray-800 text-lg font-medium">✕</button>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-8">
            {/* Left: larger visual + details (span 2 cols) */}
            <div className="md:col-span-2 space-y-6">
              {car ? (
                <>
                  <div className="text-2xl font-semibold text-gray-900">{car.brand} {car.model}</div>
                  <div className="w-full rounded-lg overflow-hidden shadow bg-gray-50">
                    <img
                      src={`${apiBase}${car.imageUrl}`}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-auto object-cover"
                      style={{ aspectRatio: '16/9', maxHeight: '420px' }}
                      loading="lazy"
                      onError={e => { (e.currentTarget as HTMLImageElement).src = '/window.svg'; }}
                    />
                  </div>
                  <p className="text-gray-700">{car.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div className="space-y-1">
                      <div><span className="font-semibold">Tipo:</span> {car.type}</div>
                      <div><span className="font-semibold">Potencia:</span> {car.power} CV</div>
                      <div><span className="font-semibold">Año:</span> {car.year}</div>
                    </div>
                      <div className="space-y-1">
                        <div><span className="font-semibold">Precio/Día:</span> {car.pricePerDay}€</div>
                        <div><span className="font-semibold">Estado:</span> {car.status}</div>
                      </div>
                  </div>
                </>
              ) : (
                circuit && (
                  <>
                    <div className="text-2xl font-semibold text-gray-900">{circuit.name}</div>
                    <div className="w-full rounded-lg overflow-hidden shadow bg-gray-50">
                      <img
                        src={`${apiBase}${circuit.imageUrl}`}
                        alt={circuit.name}
                        className="w-full h-auto object-cover"
                        style={{ aspectRatio: '16/9', maxHeight: '420px' }}
                        loading="lazy"
                        onError={e => { (e.currentTarget as HTMLImageElement).src = '/window.svg'; }}
                      />
                    </div>
                    <p className="text-gray-700">{circuit.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                      <div className="space-y-1">
                        <div><span className="font-semibold">Ubicación:</span> {circuit.location}, {circuit.province}</div>
                        <div><span className="font-semibold">Longitud:</span> {circuit.lengthMeters} m</div>
                        <div><span className="font-semibold">Anchura:</span> {circuit.widthMeters} m</div>
                      </div>
                      <div className="space-y-1">
                        <div><span className="font-semibold">Superficie:</span> {circuit.surfaceType}</div>
                        <div><span className="font-semibold">Curvas:</span> {circuit.numberOfCorners}</div>
                      </div>
                    </div>
                  </>
                )
              )}
            </div>

            {/* Right: list of opposite items */}
            <div className="md:col-span-1">
              <h4 className="font-semibold mb-3 text-gray-800">{car ? 'Circuitos disponibles' : 'Coches disponibles'}</h4>
              <div className="space-y-3 max-h-80 overflow-auto pr-2">
                {loading ? (
                  <div className="text-gray-500">Cargando...</div>
                ) : items.length === 0 ? (
                  <div className="text-sm text-gray-500">No hay elementos.</div>
                ) : (
                  items.map((it: any) => {
                    if (car) {
                      const c = it as Circuit;
                      const compatible = isCircuitCompatibleWithCar(c);
                      const selected = selectedCircuitId === c.id;
                      return (
                        <div key={c.id} className={`p-3 border rounded-lg flex items-center justify-between transition-shadow ${compatible ? (selected ? 'ring-2 ring-offset-2 ring-orange-300 bg-orange-50 shadow-md' : 'bg-white hover:shadow-md') : 'opacity-60 bg-gray-50'}`}>
                          <div>
                            <div className="font-medium text-gray-800">{c.name}</div>
                            <div className="text-xs text-gray-500">{c.province} — {c.lengthMeters} m</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button disabled={!compatible} onClick={() => setSelectedCircuitId(c.id)} className={`px-3 py-1 rounded-md text-sm font-medium ${compatible ? (selected ? 'bg-orange-600 text-white' : 'bg-white border border-orange-500 text-orange-600 hover:bg-orange-50') : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
                              {selected ? 'Seleccionado' : 'Seleccionar'}
                            </button>
                          </div>
                        </div>
                      );
                    } else {
                      const carItem = it as Car;
                      const compatible = isCarCompatibleWithCircuit(carItem);
                      return (
                        <div key={carItem.id} className={`p-3 border rounded-lg flex items-center justify-between transition-shadow ${compatible ? 'bg-white hover:shadow-md' : 'opacity-60 bg-gray-50'}`}>
                          <div>
                            <div className="font-medium text-gray-800">{carItem.brand} {carItem.model}</div>
                            <div className="text-xs text-gray-500">{carItem.power} CV — {carItem.type}</div>
                          </div>
                          <div>
                            <button disabled={!compatible} onClick={() => router.push(`/reservations?carId=${carItem.id}&circuitId=${circuit?.id ?? ''}`)} className={`px-3 py-1 rounded-md text-sm font-medium ${compatible ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
                              Reservar
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button onClick={onClose} className="px-5 py-2 rounded-md bg-gray-100 text-gray-700 font-medium">Volver</button>
            <button onClick={handleReserve} className="px-5 py-2 rounded-md bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold shadow">Reservar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
