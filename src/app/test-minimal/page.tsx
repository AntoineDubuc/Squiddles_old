"use client";

import React, { useEffect, useState } from 'react';

export default function TestMinimal() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    console.log('TestMinimal useEffect running');
    setStatus('loaded');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold">Test Minimal Page</h1>
        <p>Status: {status}</p>
      </div>
    </div>
  );
}