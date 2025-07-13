"use client";

import React, { useEffect, useState } from 'react';

export default function TestSimple() {
  const [currentView, setCurrentView] = useState<'loading' | 'dashboard'>('loading');

  useEffect(() => {
    console.log('TestSimple useEffect running');
    setCurrentView('dashboard');
  }, []);

  if (currentView === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Initializing Squiddles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">🦑 Squiddles Dashboard</h1>
        <p className="text-gray-600">Voice/Text model separation is working!</p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Model Routing</h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span>Voice input → Nova Sonic (~$0.70/hour)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Text input → Nova Pro (~$0.0008/1K tokens)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}