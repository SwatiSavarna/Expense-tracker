


import React, { useState } from 'react';
import axios from 'axios';

const AISuggestionsWidget = ({ transactions }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  const fetchSuggestions = async () => {
    if (!transactions || transactions.length === 0) {
      setError('No transactions available for suggestions.');
      setShow(true);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/ai/generate', { transactions });
      setSuggestions(res.data.suggestions);
    } catch (err) {
      console.error('AI Suggestions Error:', err);
      setError('Failed to fetch suggestions. Please try again.');
    } finally {
      setLoading(false);
      setShow(true);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h3 className="font-semibold mb-2">💡 AI Budget Insights</h3>
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
        onClick={fetchSuggestions}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Get Suggestions'}
      </button>

      {show && (
        <p className="mt-3 text-sm whitespace-pre-line text-gray-700">
          {error || suggestions || 'No suggestions available.'}
        </p>
      )}
    </div>
  );
};

export default AISuggestionsWidget;