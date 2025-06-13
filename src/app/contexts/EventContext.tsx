"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EventItem } from '../types';

interface EventContextType {
  events: EventItem[];
  addEvent: (event: EventItem) => void;
  clearEvents: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>([]);

  const addEvent = (event: EventItem) => {
    setEvents(prev => [...prev, event]);
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <EventContext.Provider value={{
      events,
      addEvent,
      clearEvents
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}