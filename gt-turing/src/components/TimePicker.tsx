'use client';

import { useState, useEffect } from 'react';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
}

export default function TimePicker({ value, onChange, label }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState('10');
  const [minutes, setMinutes] = useState('00');

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      setHours(h || '10');
      setMinutes(m || '00');
    }
  }, [value]);

  const handleHourChange = (newHour: string) => {
    setHours(newHour);
    onChange(`${newHour}:${minutes}`);
  };

  const handleMinuteChange = (newMinute: string) => {
    setMinutes(newMinute);
    onChange(`${hours}:${newMinute}`);
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  const minuteOptions = Array.from({ length: 12 }, (_, i) => 
    (i * 5).toString().padStart(2, '0')
  );

  return (
    <div className="relative">
      <label className="block text-sm font-bold text-gray-900 mb-3">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 bg-white flex items-center justify-between hover:border-green-300"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-lg font-semibold">{hours}:{minutes}</span>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Hours Column */}
              <div>
                <div className="text-center text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  Horas
                </div>
                <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-lg border border-gray-200">
                  {hourOptions.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => handleHourChange(hour)}
                      className={`w-full px-3 py-2 text-center transition-all ${
                        hours === hour
                          ? 'bg-green-600 text-white font-bold'
                          : 'text-gray-700 hover:bg-green-50'
                      }`}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minutes Column */}
              <div>
                <div className="text-center text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  Minutos
                </div>
                <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-lg border border-gray-200">
                  {minuteOptions.map((minute) => (
                    <button
                      key={minute}
                      type="button"
                      onClick={() => handleMinuteChange(minute)}
                      className={`w-full px-3 py-2 text-center transition-all ${
                        minutes === minute
                          ? 'bg-green-600 text-white font-bold'
                          : 'text-gray-700 hover:bg-green-50'
                      }`}
                    >
                      {minute}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Time Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                Horas comunes
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      const [h, m] = time.split(':');
                      handleHourChange(h);
                      handleMinuteChange(m);
                      setIsOpen(false);
                    }}
                    className="px-2 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-green-100 hover:text-green-700 rounded-lg transition-all font-medium"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-all"
            >
              Confirmar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
