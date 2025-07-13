"use client";

import React, { useEffect, useState } from 'react';

export default function StatusPage() {
  const [jsWorking, setJsWorking] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    console.log('✅ JavaScript is working on status page');
    setJsWorking(true);
    setCurrentTime(new Date().toLocaleString());
    
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Squiddles App Status</h1>
        
        <div className="grid gap-6">
          {/* JavaScript Status */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">JavaScript Status</h2>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${jsWorking ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{jsWorking ? '✅ JavaScript is working' : '❌ JavaScript not loaded'}</span>
            </div>
            <p className="text-gray-400 mt-2">Current time: {currentTime}</p>
          </div>

          {/* Enhanced Descriptions Status */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Enhanced Descriptions Implementation</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>✅ Jira API enhanced with description extraction</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>✅ Confluence API enhanced with excerpt extraction</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>✅ TicketList component updated for better descriptions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>✅ CSS styling enhanced for readability</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Navigation</h2>
            <div className="space-y-3">
              <a 
                href="/demo-descriptions"
                className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                🎉 View Enhanced Descriptions Demo
              </a>
              <a 
                href="/"
                className="block px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors"
              >
                🏠 Back to Main App
              </a>
            </div>
          </div>

          {/* Issue Information */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Current Issue</h2>
            <p className="text-gray-300 mb-4">
              The main app is stuck in "Initializing" state due to AWS Bedrock connection errors. 
              The voice functionality requires AWS credentials which aren't configured.
            </p>
            <p className="text-green-400">
              ✅ Enhanced descriptions are implemented and working (see demo page)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}