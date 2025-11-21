import React, { useMemo } from 'react';
import { CalendarEvent, DateCell, EventColor, COLOR_STYLES } from '../types';

interface CalendarProps {
  currentDate: Date;
  events: CalendarEvent[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  isReadOnly?: boolean;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  events,
  onPrevMonth,
  onNextMonth,
  onDateClick,
  onEventClick,
  isReadOnly = false
}) => {
  const days = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
    
    const calendarDays: DateCell[] = [];

    // Previous month filler
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      calendarDays.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Current month
    const today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      calendarDays.push({
        date: d,
        isCurrentMonth: true,
        isToday: d.getTime() === today.getTime()
      });
    }

    // Next month filler
    const remaining = 42 - calendarDays.length;
    for (let i = 1; i <= remaining; i++) {
      calendarDays.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false
      });
    }

    return calendarDays;
  }, [currentDate]);

  const getEventsForDate = (date: Date) => {
    const cellDate = new Date(date);
    cellDate.setHours(0, 0, 0, 0);

    return events.filter(e => {
      const start = new Date(e.startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(e.endDate);
      end.setHours(23, 59, 59, 999);

      return cellDate.getTime() >= start.getTime() && cellDate.getTime() <= end.getTime();
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Calendar Header Controls */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
        <h2 className="text-2xl font-bold text-gray-800">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
          <button onClick={onPrevMonth} className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="w-px h-6 bg-gray-200"></span>
          <button onClick={onNextMonth} className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {days.map((cell, idx) => {
          const dayEvents = getEventsForDate(cell.date);
          return (
            <div
              key={idx}
              onClick={() => !isReadOnly && onDateClick(cell.date)}
              className={`
                min-h-[120px] border-b border-r border-gray-100 p-2 transition-colors relative flex flex-col
                ${!cell.isCurrentMonth ? 'bg-gray-50/50 text-gray-400' : 'bg-white text-gray-800'}
                ${!isReadOnly ? 'cursor-pointer hover:bg-gray-50 group' : ''}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`
                  text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                  ${cell.isToday ? 'bg-primary text-white shadow-md' : 'text-gray-700'}
                `}>
                  {cell.date.getDate()}
                </span>
                 {!isReadOnly && (
                    <button 
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary transition-opacity"
                      title="Add Event"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                 )}
              </div>
              
              <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1">
                {dayEvents.map(event => {
                  const isStart = event.startDate.getDate() === cell.date.getDate() && event.startDate.getMonth() === cell.date.getMonth();
                  const isEnd = event.endDate.getDate() === cell.date.getDate() && event.endDate.getMonth() === cell.date.getMonth();
                  const isMultiDay = event.startDate.getTime() !== event.endDate.getTime();

                  return (
                    <div
                      key={event.id}
                      onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                      className={`
                        text-xs px-2 py-1 rounded border truncate transition-all hover:shadow-sm cursor-pointer
                        ${COLOR_STYLES[event.color].bg} 
                        ${COLOR_STYLES[event.color].text} 
                        ${COLOR_STYLES[event.color].border}
                        hover:brightness-95
                        ${isMultiDay ? 'shadow-sm' : ''}
                      `}
                    >
                      <div className="flex items-center gap-1">
                         {/* Only show time on start day, or if it's a single day event */}
                         {event.startTime && (isStart || !isMultiDay) && (
                            <span className="opacity-75 font-normal text-[10px]">{event.startTime}</span>
                         )}
                         <span className="font-medium truncate">
                           {event.title}
                           {isMultiDay && (
                             <span className="text-[10px] opacity-60 ml-1">
                               {isStart ? '(Start)' : isEnd ? '(End)' : '(Cont.)'}
                             </span>
                           )}
                         </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};