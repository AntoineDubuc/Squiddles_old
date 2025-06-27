'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface GmailConfigProps {
  onConfigUpdate?: () => void;
}

interface GmailStats {
  totalEmails: number;
  recentEmails: number;
  connection: string;
  lastChecked: string;
}

export default function GmailConfig({ onConfigUpdate }: GmailConfigProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<GmailStats | null>(null);
  const [indexing, setIndexing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkGmailConnection();
  }, []);

  const checkGmailConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/pinecone/stats');
      const data = await response.json();
      
      if (data.gmail && data.gmail.status === 'connected') {
        setIsConnected(true);
        setStats(data.gmail.stats);
      } else {
        setIsConnected(false);
        setError(data.gmail?.error || 'Gmail not connected');
      }
    } catch (err) {
      setIsConnected(false);
      setError('Failed to check Gmail connection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndexEmails = async (daysBack: number) => {
    setIndexing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/pinecone/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'gmail',
          options: { daysBack }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh stats
        await checkGmailConnection();
        if (onConfigUpdate) onConfigUpdate();
      } else {
        setError(data.error || 'Failed to index emails');
      }
    } catch (err) {
      setError('Failed to index emails');
    } finally {
      setIndexing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-100">Gmail Connection</h3>
          <button
            onClick={checkGmailConnection}
            disabled={isLoading}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isLoading ? 'Checking...' : 'Refresh'}
          </button>
        </div>
        
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-green-400">Connected</span>
                </>
              ) : (
                <>
                  <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                  <span className="text-red-400">Not Connected</span>
                </>
              )}
            </div>
            
            {stats && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-400">Total Emails</p>
                  <p className="text-lg font-medium text-gray-100">{stats.totalEmails.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Recent Emails</p>
                  <p className="text-lg font-medium text-gray-100">{stats.recentEmails.toLocaleString()}</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mt-3 p-3 bg-red-900/20 border border-red-800/50 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Configuration */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-medium text-gray-100 mb-4">Gmail Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">
              Gmail integration requires OAuth setup. Ensure you have configured:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Google Cloud Project with Gmail API enabled</li>
              <li>OAuth 2.0 credentials</li>
              <li>Proper scopes for reading emails</li>
            </ul>
          </div>
          
          <div className="pt-4">
            {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
              <p className="text-amber-400 text-sm">
                ⚠️ Google OAuth credentials are not configured. Please set up the environment variables first.
              </p>
            ) : (
              <a
                href="/api/auth/google"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Connect Gmail Account
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Indexing Options */}
      {isConnected && (
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-medium text-gray-100 mb-4">Index Emails</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Last 7 days', days: 7 },
              { label: 'Last 30 days', days: 30 },
              { label: 'Last 90 days', days: 90 },
              { label: 'Last year', days: 365 },
            ].map(({ label, days }) => (
              <button
                key={days}
                onClick={() => handleIndexEmails(days)}
                disabled={indexing}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {indexing ? 'Indexing...' : label}
              </button>
            ))}
          </div>
          
          <p className="text-sm text-gray-400 mt-4">
            Indexing will process emails and make them searchable in Pinecone.
          </p>
        </div>
      )}

      {/* Documentation */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-medium text-gray-100 mb-4">Setup Instructions</h3>
        
        <div className="space-y-3 text-sm text-gray-300">
          <p>To connect Gmail to Squiddles:</p>
          
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Google Cloud Console</a></li>
            <li>Create a new project or select existing one</li>
            <li>Enable the Gmail API</li>
            <li>Create OAuth 2.0 credentials</li>
            <li>Add authorized redirect URI: <code className="bg-gray-700 px-2 py-1 rounded">http://localhost:8888/api/auth/callback/google</code></li>
            <li>Set environment variables:
              <pre className="bg-gray-900 p-3 rounded-lg mt-2 overflow-x-auto">
{`GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8888/api/auth/callback/google`}
              </pre>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}