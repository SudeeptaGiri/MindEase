import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const { score, riskLevel, assessmentType, followUpDate } = location.state || {};
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch suggestions from DeepSeek API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!score || !assessmentType) {
        return;
      }
      setLoading(true);
      setError('');
      const API_KEY = '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';
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'HTTP-Referer': window.location.href,
            'X-Title': 'Mental Health Assistant',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-r1:free',
            messages: [
              {
                role: 'user',
                content: `Based on my ${assessmentType} score of ${score} and risk level of ${riskLevel}, generate a detailed roadmap of actionable suggestions (like a to-do list) that I can follow until my next follow-up on ${followUpDate}.`,
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }

        const data = await response.json();
        const suggestions = data.choices[0].message.content.split('\n').filter((line) => line.trim() !== '');
        setSuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setError('Failed to fetch suggestions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [score, riskLevel, assessmentType, followUpDate]);

  if (!location.state) {
    return <div>No results found. Please complete the assessment first.</div>;
  }

  return (
    <div>
      <h2>Assessment Results</h2>
      <p>Your Score: {score}</p>
      <p>Risk Level: {riskLevel}</p>
      <p>Follow-Up Scheduled: {followUpDate}</p>

      <h3>Your Roadmap Until Next Follow-Up</h3>
      {loading && <p>Loading suggestions...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Results;