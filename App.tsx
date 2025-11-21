import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Calendar } from './components/Calendar';
import { EventModal } from './components/EventModal';
import { SidePanel } from './components/SidePanel';
import { CalendarEvent, EventColor } from './types';

// Helper to create date relative to today
const getDate = (dayOffset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(0, 0, 0, 0);
  return d;
};

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Product Strategy Meeting',
    description: 'Discuss Q4 roadmap with engineering team.',
    startDate: getDate(2),
    endDate: getDate(2),
    startTime: '10:00',
    endTime: '11:30',
    color: EventColor.Blue
  },
  {
    id: '2',
    title: 'Design Sprint',
    description: 'Review new dashboard mocks and iterate.',
    startDate: getDate(5),
    endDate: getDate(7), // 3 day event
    startTime: '09:00',
    color: EventColor.Purple
  },
  {
    id: '3',
    title: 'Lunch with Client',
    startDate: getDate(10),
    endDate: getDate(10),
    startTime: '12:30',
    endTime: '13:30',
    color: EventColor.Green
  },
  {
    id: '4',
    title: 'Code Freeze',
    startDate: getDate(15),
    endDate: getDate(15),
    color: EventColor.Red
  }
];

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  
  // Access Rights State
  const [isReadOnly, setIsReadOnly] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined);

  // Calendar Navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Event Handlers
  const handleDateClick = (date: Date) => {
    if (isReadOnly) return; // Access control: Prevent creation in read-only mode
    setSelectedDate(date);
    setEditingEvent(undefined);
    setIsModalOpen(true);
  };

  const handleCreateEvent = () => {
    if (isReadOnly) return;
    setSelectedDate(new Date()); // Default to today
    setEditingEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setSelectedDate(event.startDate);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    if (isReadOnly) return;
    if (editingEvent) {
      setEvents(events.map(e => e.id === event.id ? event : e));
    } else {
      setEvents([...events, event]);
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (isReadOnly) return;
    setEvents(events.filter(e => e.id !== id));
  };

  const handleAddEventFromHeader = (event: CalendarEvent) => {
    if (isReadOnly) return;
    setEvents(prev => [...prev, event]);
    // Jump to that date so user sees it
    setCurrentDate(new Date(event.startDate.getFullYear(), event.startDate.getMonth(), 1));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-900 font-sans overflow-hidden">
      
      <Header 
        onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)} 
        onAddEvent={handleAddEventFromHeader}
        isReadOnly={isReadOnly}
        onToggleReadOnly={() => setIsReadOnly(!isReadOnly)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Main Content Area */}
        <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ease-in-out ${isSidePanelOpen ? 'mr-0 md:mr-96' : ''}`}>
          <div className="max-w-7xl mx-auto h-full">
             <Calendar
                currentDate={currentDate}
                events={events}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                isReadOnly={isReadOnly}
             />
          </div>
        </main>

        {/* Side Panel (Always mounted, translated off-screen by default via CSS in component) */}
        <SidePanel 
          isOpen={isSidePanelOpen}
          onClose={() => setIsSidePanelOpen(false)}
          events={events}
          onEventClick={handleEventClick}
          onCreateEvent={handleCreateEvent}
          isReadOnly={isReadOnly}
        />

      </div>

      {/* Add/Edit Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialDate={selectedDate}
        existingEvent={editingEvent}
        readOnly={isReadOnly}
      />

    </div>
  );
}