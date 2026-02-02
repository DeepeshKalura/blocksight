'use client';

import React, { useState } from "react";
import mockResponse from '../mock-query-response.json';

interface QueryResponse {
  success: boolean;
  question: string;
  sql_query: string | null;
  result: any[] | null;
  answer: string | null;
  error: string | null;
}

export function QueryInterface() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For the demo, we always return the mock success response
    setResponse(mockResponse as QueryResponse);
    
    setIsLoading(false);
  };

  const handleClear = () => {
    setQuery("");
    setResponse(null);
    setError(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6 max-w-4xl mx-auto border border-gray-700">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Natural Language Query Interface
        </h3>
        <p className="text-gray-400 text-sm">
          Ask questions about the dApp data using natural language. The AI will convert your question to SQL and execute it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-300 mb-2">
            Your Question
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Show me the most active wallets by transaction count..."
            className="w-full h-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
            disabled={isLoading}
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Execute Query"
            )}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Clear
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-md p-4 text-red-300">
          Error: {error}
        </div>
      )}

      {response && (
        <div className="space-y-4 pt-4 border-t border-gray-700">
            <h4 className="text-lg font-medium text-white mb-3">Query Response</h4>
            
            {response.answer && (
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-2">Answer:</h5>
                <p className="text-gray-100 bg-gray-900/50 p-3 rounded border-l-4 border-orange-500">{response.answer}</p>
              </div>
            )}

            {response.sql_query && (
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-2">Generated SQL:</h5>
                <pre className="text-sm text-gray-100 bg-gray-900 p-3 rounded overflow-x-auto border border-gray-600"><code>{response.sql_query}</code></pre>
              </div>
            )}

            {response.result && response.result.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-2">Raw Results ({response.result.length} rows):</h5>
                <div className="bg-gray-900 rounded overflow-x-auto border border-gray-600">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        {Object.keys(response.result[0]).map((key) => (
                          <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {response.result.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value: any, cellIndex) => (
                            <td key={cellIndex} className="px-3 py-2 whitespace-nowrap text-sm text-gray-200">{String(value)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}