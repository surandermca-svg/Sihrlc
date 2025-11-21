import React, { useState, useEffect } from 'react';
import { CalendarEvent, EventColor, COLOR_STYLES } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
  initialDate?: Date;
  existingEvent?: CalendarEvent;
  readOnly?: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialDate,
  existingEvent,
  readOnly = false
}) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<EventColor>(EventColor.Blue);

  useEffect(() => {
    if (isOpen) {
      if (existingEvent) {
        setTitle(existingEvent.title);
        setStartDate(existingEvent.startDate.toISOString().split('T')[0]);
        setEndDate(existingEvent.endDate.toISOString().split('T')[0]);
        setStartTime(existingEvent.startTime || '');
        setEndTime(existingEvent.endTime || '');
        setDescription(existingEvent.description || '');
        setColor(existingEvent.color);
      } else {
        setTitle('');
        const isoDate = initialDate ? initialDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        setStartDate(isoDate);
        setEndDate(isoDate); // Default end date to start date
        setStartTime('');
        setEndTime('');
        setDescription('');
        setColor(EventColor.Blue);
      }
    }
  }, [isOpen, existingEvent, initialDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return; 
    if (!title || !startDate || !endDate) return;

    if (new Date(endDate) < new Date(startDate)) {
      alert("End date cannot be before start date");
      return;
    }

    const newEvent: CalendarEvent = {
      id: existingEvent ? existingEvent.id : crypto.randomUUID(),
      title,
      startDate: new Date(startDate + 'T00:00:00'),
      endDate: new Date(endDate + 'T00:00:00'),
      startTime,
      endTime,
      description,
      color
    };

    onSave(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal Panel */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-gray-100">
          <div className="bg-white px-6 pt-6 pb-6">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                     {readOnly ? 'Event Details' : (existingEvent ? 'Edit Event' : 'Create New Event')}
                   </h3>
                   {readOnly && (
                     <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded font-medium border border-gray-200">
                       Read Only
                     </span>
                   )}
                </div>
                
                <form id="event-form" onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Event Title</label>
                    <input
                      type="text"
                      required
                      disabled={readOnly}
                      className="block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition-shadow disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="e.g., Project Launch, Doctor Appointment"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        required
                        disabled={readOnly}
                        className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          if (!endDate || new Date(endDate) < new Date(e.target.value)) {
                            setEndDate(e.target.value);
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        required
                        disabled={readOnly}
                        className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        disabled={readOnly}
                        className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        disabled={readOnly}
                        className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      disabled={readOnly}
                      className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm resize-none disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Add details, location, links..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Label Color</label>
                    {readOnly ? (
                       <div className={`inline-flex items-center px-3 py-1 rounded-full border ${COLOR_STYLES[color].bg} ${COLOR_STYLES[color].border} ${COLOR_STYLES[color].text} text-sm font-medium`}>
                          <span className={`w-2 h-2 rounded-full ${COLOR_STYLES[color].dot} mr-2`}></span>
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                       </div>
                    ) : (
                      <div className="flex flex-wrap gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                        {Object.values(EventColor).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            className={`
                              w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                              ${COLOR_STYLES[c].bg} ${COLOR_STYLES[c].border} border
                              ${color === c ? `ring-2 ring-offset-2 ${COLOR_STYLES[c].ring} scale-110 shadow-sm` : 'hover:scale-105 opacity-80 hover:opacity-100'}
                            `}
                            title={c.charAt(0).toUpperCase() + c.slice(1)}
                          >
                            {color === c && (
                              <svg className={`w-4 h-4 ${COLOR_STYLES[c].text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    {!readOnly && <p className="text-xs text-gray-500 mt-1.5">Choose a background color for your event label.</p>}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse gap-2">
            {!readOnly ? (
              <>
                <button
                  type="submit"
                  form="event-form"
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2.5 bg-primary text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:w-auto sm:text-sm"
                >
                  {existingEvent ? 'Update Event' : 'Create Event'}
                </button>
                {existingEvent && (
                  <button
                    type="button"
                    onClick={() => { 
                      if(window.confirm('Are you sure you want to delete this event?')) {
                        onDelete(existingEvent.id); 
                        onClose(); 
                      }
                    }}
                    className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2.5 bg-red-100 text-base font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                  >
                    Delete
                  </button>
                )}
              </>
            ) : (
               <div className="flex-1"></div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:w-auto sm:text-sm"
            >
              {readOnly ? 'Close' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};