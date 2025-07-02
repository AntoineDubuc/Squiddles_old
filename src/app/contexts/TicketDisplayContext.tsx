/**
 * Context for managing ticket display state
 * Handles showing Jira tickets in the UI with voice response separation
 */

"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { JiraTicketDisplay } from '../components/TicketList';

interface TicketDisplayState {
  isVisible: boolean;
  tickets: JiraTicketDisplay[];
  totalCount: number;
  voiceMessage: string;
  searchQuery?: string;
}

interface TicketDisplayContextType {
  ticketDisplay: TicketDisplayState | null;
  showTickets: (tickets: JiraTicketDisplay[], totalCount: number, voiceMessage: string, searchQuery?: string) => void;
  hideTickets: () => void;
  clearTickets: () => void;
}

const TicketDisplayContext = createContext<TicketDisplayContextType | undefined>(undefined);

export function TicketDisplayProvider({ children }: { children: ReactNode }) {
  const [ticketDisplay, setTicketDisplay] = useState<TicketDisplayState | null>(null);

  const showTickets = (tickets: JiraTicketDisplay[], totalCount: number, voiceMessage: string, searchQuery?: string) => {
    setTicketDisplay({
      isVisible: true,
      tickets,
      totalCount,
      voiceMessage,
      searchQuery
    });
  };

  const hideTickets = () => {
    if (ticketDisplay) {
      setTicketDisplay({
        ...ticketDisplay,
        isVisible: false
      });
    }
  };

  const clearTickets = () => {
    setTicketDisplay(null);
  };

  return (
    <TicketDisplayContext.Provider value={{
      ticketDisplay,
      showTickets,
      hideTickets,
      clearTickets
    }}>
      {children}
    </TicketDisplayContext.Provider>
  );
}

export function useTicketDisplay() {
  const context = useContext(TicketDisplayContext);
  if (context === undefined) {
    throw new Error('useTicketDisplay must be used within a TicketDisplayProvider');
  }
  return context;
}