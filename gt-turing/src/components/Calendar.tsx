'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  carId?: string; // ID del coche para obtener fechas ocupadas
  minDate?: Date;
  maxDate?: Date;
}

interface OccupiedDate {
  reservationId: string;
  startDate: string;
  endDate: string;
}

export default function Calendar({
  selectedDate,
  onDateSelect,
  carId,
  minDate,
  maxDate
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar fechas ocupadas cuando cambie el coche
  useEffect(() => {
    const fetchOccupiedDates = async () => {
      if (!carId) {
        setOccupiedDates([]);
        return;
      }

      setLoading(true);
      try {
        const response = await apiClient.get<OccupiedDate[]>(
          `/reservations/car/${carId}/occupied-dates`
        );
        
        // Convertir las fechas ocupadas a un array de fechas
        const dates: Date[] = [];
        response.data.forEach((occupation: OccupiedDate) => {
          // Normalizar las fechas a medianoche en hora local
          const start = new Date(occupation.startDate);
          start.setHours(0, 0, 0, 0);
          
          const end = new Date(occupation.endDate);
          end.setHours(0, 0, 0, 0);
          
          // Agregar todas las fechas entre start y end (inclusive)
          const currentDate = new Date(start);
          while (currentDate <= end) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });
        
        console.log(`Loaded ${dates.length} occupied dates for car ${carId}:`, dates);
        setOccupiedDates(dates);
      } catch (error) {
        console.error('Error fetching occupied dates:', error);
        setOccupiedDates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOccupiedDates();
  }, [carId]);


  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isDateUnavailable = (date: Date) => {
    // Normalizar la fecha de entrada a medianoche para comparación
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    
    return occupiedDates.some((unavailable: Date) => {
      const normalizedUnavailable = new Date(unavailable);
      normalizedUnavailable.setHours(0, 0, 0, 0);
      
      return normalizedUnavailable.getTime() === normalizedDate.getTime();
    });
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return isDateUnavailable(date);
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isDateDisabled(date)) {
      onDateSelect(date);
    }
  };

  const renderDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const disabled = isDateDisabled(date);
      const selected = isDateSelected(date);
      const today = isToday(date);
      const unavailable = isDateUnavailable(date);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={disabled}
          className={`
            p-2 rounded-lg text-center transition-all duration-200 transform
            ${selected
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg scale-110'
              : unavailable
              ? 'bg-red-50 text-red-400 cursor-not-allowed'
              : disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'hover:bg-blue-50 hover:scale-105 hover:shadow-md text-gray-900 font-medium cursor-pointer'
            }
            ${today && !selected ? 'ring-2 ring-blue-400 font-bold' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-2">
        {renderDays()}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <span className="text-gray-600">Seleccionado</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded ring-2 ring-blue-400"></div>
          <span className="text-gray-600">Hoy</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-red-50"></div>
          <span className="text-gray-600">No disponible</span>
        </div>
      </div>
    </div>
  );
}
