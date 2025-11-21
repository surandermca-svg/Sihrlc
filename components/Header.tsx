import React, { useState } from 'react';
import { parseEventWithGemini } from '../services/geminiService';
import { CalendarEvent } from '../types';

interface HeaderProps {
  onToggleSidePanel: () => void;
  onAddEvent: (event: CalendarEvent) => void;
  isReadOnly: boolean;
  onToggleReadOnly: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleSidePanel, 
  onAddEvent,
  isReadOnly,
  onToggleReadOnly
}) => {
  const [aiInput, setAiInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isReadOnly) return;

    setIsLoading(true);
    try {
      const parsed = await parseEventWithGemini(aiInput);
      if (parsed) {
        const newEvent: CalendarEvent = {
          id: crypto.randomUUID(),
          title: parsed.title,
          description: parsed.description,
          startDate: new Date(parsed.startDate + 'T00:00:00'), // Force local midnight
          endDate: new Date(parsed.endDate + 'T00:00:00'),     // Force local midnight
          startTime: parsed.startTime,
          endTime: parsed.endTime,
          color: parsed.color
        };
        onAddEvent(newEvent);
        setAiInput('');
      }
    } catch (err) {
      console.error(err);
      alert("Failed to understand the event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-2 min-w-fit">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-md">
          CP
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">ChronoPlan AI</h1>
      </div>

      <div className="flex-1 w-full lg:max-w-2xl flex items-center gap-4">
        <form onSubmit={handleAiSubmit} className="flex-1 relative">
          <div className={`relative group ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className={`h-5 w-5 ${isLoading ? 'text-primary animate-pulse' : 'text-gray-400 group-focus-within:text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <input
              type="text"
              className={`
                block w-full pl-10 pr-3 py-2 border rounded-full leading-5 sm:text-sm transition-all shadow-sm
                ${isReadOnly 
                  ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' 
                  : 'bg-gray-50 border-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary hover:shadow-md'}
              `}
              placeholder={isReadOnly ? "Switch to Admin mode to create events with AI..." : "Ask AI: 'Project Sync Mon to Wed next week at 10am blue label...'"}
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              disabled={isLoading || isReadOnly}
            />
            {isLoading && (
               <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-500 animate-pulse">
                 Thinking...
               </span>
            )}
          </div>
        </form>
      </div>

      <div className="flex items-center gap-3 min-w-fit">
        {/* Rights / Access Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 px-1 border border-gray-200" title="Toggle Access Rights">
          <button
            onClick={() => isReadOnly && onToggleReadOnly()}
            className={`
              px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5
              ${!isReadOnly ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Admin
          </button>
          <button
             onClick={() => !isReadOnly && onToggleReadOnly()}
             className={`
              px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5
              ${isReadOnly ? 'bg-white text-gray-800 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Viewer
          </button>
        </div>

        <div className="w-px h-8 bg-gray-200 mx-1 hidden sm:block"></div>

        <button
          onClick={onToggleSidePanel}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors text-sm font-medium shadow-sm"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="hidden sm:inline">All Events</span>
        </button>
      </div>
    </header>
  );
};