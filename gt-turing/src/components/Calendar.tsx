'use client';

import { useState } from 'react';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  unavailableDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
}

export default function Calendar({
  selectedDate,
  onDateSelect,
  unavailableDates = [],
  minDate,
  maxDate
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

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
    return unavailableDates.some(
      unavailable =>
        unavailable.getDate() === date.getDate() &&
        unavailable.getMonth() === date.getMonth() &&
        unavailable.getFullYear() === date.getFullYear()
    );
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
