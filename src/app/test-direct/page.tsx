/**
 * Direct Dashboard Test Page
 * Bypasses all authentication and routing logic
 */

"use client";

import React from 'react';
import Dashboard from '../components/Dashboard';

export default function TestDirectPage() {
  const handleNavigateToVoice = () => {
    console.log('Navigate to voice clicked');
  };

  const handleNavigateToTickets = () => {
    console.log('Navigate to tickets clicked');
  };

  return (
    <div className="min-h-screen">
      <div className="p-4 bg-blue-600 text-white text-center">
        <h1>🧪 Direct Dashboard Test - Bypassing Auth</h1>
        <p>This should show the mockup-based dashboard interface directly</p>
      </div>
      
      <Dashboard 
        onNavigateToVoice={handleNavigateToVoice}
        onNavigateToTickets={handleNavigateToTickets}
      />
    </div>
  );
}