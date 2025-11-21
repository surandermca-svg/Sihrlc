export enum EventColor {
  Blue = 'blue',
  Red = 'red',
  Green = 'green',
  Purple = 'purple',
  Orange = 'orange',
  Gray = 'gray',
  Pink = 'pink',
  Indigo = 'indigo'
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date; // Start of the event range
  endDate: Date;   // End of the event range (inclusive)
  startTime?: string; // HH:mm format (applies to start date)
  endTime?: string;   // HH:mm format (applies to end date)
  color: EventColor;
}

export interface DateCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const COLOR_STYLES: Record<EventColor, { bg: string; text: string; border: string; ring: string; dot: string }> = {
  [EventColor.Blue]: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', ring: 'ring-blue-500', dot: 'bg-blue-500' },
  [EventColor.Red]: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', ring: 'ring-red-500', dot: 'bg-red-500' },
  [EventColor.Green]: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', ring: 'ring-green-500', dot: 'bg-green-500' },
  [EventColor.Purple]: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', ring: 'ring-purple-500', dot: 'bg-purple-500' },
  [EventColor.Orange]: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', ring: 'ring-orange-500', dot: 'bg-orange-500' },
  [EventColor.Gray]: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', ring: 'ring-gray-500', dot: 'bg-gray-500' },
  [EventColor.Pink]: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200', ring: 'ring-pink-500', dot: 'bg-pink-500' },
  [EventColor.Indigo]: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', ring: 'ring-indigo-500', dot: 'bg-indigo-500' },
};
