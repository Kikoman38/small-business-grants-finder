import React, { useState, useMemo } from 'react';
import { Grant } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface CalendarProps {
  grants: Grant[];
}

const Calendar: React.FC<CalendarProps> = ({ grants }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const deadlineDates = useMemo(() => {
    const dates = new Set<string>();
    grants.forEach(grant => {
      if (grant.deadline) {
        const nonDateKeywords = ['varies', 'n/a', 'ongoing'];
        if (nonDateKeywords.some(keyword => grant.deadline!.toLowerCase().includes(keyword))) {
          return;
        }
        const deadlineDate = new Date(grant.deadline);
        if (!isNaN(deadlineDate.getTime())) {
          // Store as YYYY-MM-DD to ignore time zones
          dates.add(deadlineDate.toISOString().split('T')[0]);
        }
      }
    });
    return dates;
  }, [grants]);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{`${monthName} ${year}`}</h3>
        <div className="flex space-x-2">
          <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Previous month">
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Next month">
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-semibold text-gray-500 pb-2">{day}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, day) => {
          const dayNumber = day + 1;
          const date = new Date(year, month, dayNumber);
          const dateString = date.toISOString().split('T')[0];
          const isToday = date.getTime() === today.getTime();
          const hasDeadline = deadlineDates.has(dateString);

          return (
            <div key={dayNumber} className={`relative py-2 rounded-full flex items-center justify-center ${isToday ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-700'}`}>
              <span>{dayNumber}</span>
              {hasDeadline && (
                <div className="absolute bottom-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
