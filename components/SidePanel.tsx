import React from 'react';
import { CalendarEvent, COLOR_STYLES } from '../types';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onCreateEvent: () => void;
  isReadOnly: boolean;
}

export const SidePanel: React.FC<SidePanelProps> = ({ 
  isOpen, 
  onClose, 
  events, 
  onEventClick,
  onCreateEvent,
  isReadOnly
}) => {
  
  // Sort events by startDate
  const sortedEvents = [...events].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  // Group by Month of startDate
  const groupedEvents: { [key: string]: CalendarEvent[] } = {};
  sortedEvents.forEach(event => {
    const monthKey = event.startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!groupedEvents[monthKey]) groupedEvents[monthKey] = [];
    groupedEvents[monthKey].push(event);
  });

  const formatDateRange = (start: Date, end: Date) => {
    const sDate = start.getDate();
    const sMonth = start.toLocaleString('default', { month: 'short' });
    const eDate = end.getDate();
    const eMonth = end.toLocaleString('default', { month: 'short' });
    
    if (start.getTime() === end.getTime()) {
      return `${sDate} ${sMonth}`;
    }
    
    if (start.getMonth() === end.getMonth()) {
        return `${sDate} - ${eDate} ${sMonth}`;
    }

    return `${sDate} ${sMonth} - ${eDate} ${eMonth}`;
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30 transition-opacity lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Panel */}
      <div 
        className={`
          fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">All Events</h2>
          <div className="flex items-center gap-2">
            {!isReadOnly && (
              <button 
                onClick={onCreateEvent}
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                title="Add New Event"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
          {Object.keys(groupedEvents).length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No events scheduled yet.</p>
              {!isReadOnly && <p className="text-sm mt-2">Try adding one from the calendar or ask the AI.</p>}
            </div>
          ) : (
            Object.entries(groupedEvents).map(([month, monthEvents]) => (
              <div key={month}>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 sticky top-0 bg-white py-2 z-10 border-b border-gray-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  {month}
                </h3>
                <div className="space-y-3">
                  {monthEvents.map(event => (
                    <div 
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className={`
                        group p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 bg-white
                        ${COLOR_STYLES[event.color].border}
                        hover:border-l-4
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className={`font-bold ${COLOR_STYLES[event.color].text} mb-1`}>
                            {event.title}
                          </div>
                          <div className="text-xs text-gray-600 flex items-center gap-1.5 flex-wrap">
                             <div className={`px-2 py-0.5 rounded-md ${COLOR_STYLES[event.color].bg} text-xs font-medium`}>
                                {formatDateRange(event.startDate, event.endDate)}
                             </div>
                             {event.startTime && (
                               <span className="text-gray-400 text-[10px] font-mono">
                                 {event.startTime} {event.endTime ? `- ${event.endTime}` : ''}
                               </span>
                             )}
                          </div>
                          {event.description && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2 pl-1 border-l-2 border-gray-100">{event.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};