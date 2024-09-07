import React, { useEffect, useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { getTranscriptions } from '../services/transcriptions';

const Dashboard = () => {
  const { state, dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTranscriptions = async () => {
      try {
        const transcriptions = await getTranscriptions();
        dispatch({ type: 'SET_TRANSCRIPTIONS', payload: transcriptions });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transcriptions:', err);
        setError('Failed to load transcriptions. Please try again later.');
        setLoading(false);
      }
    };

    fetchTranscriptions();
  }, [dispatch]);

  if (loading) return <div>Loading transcriptions...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {state.transcriptions.length === 0 ? (
        <p>You don't have any transcriptions yet.</p>
      ) : (
        <ul>
          {state.transcriptions.map((transcription) => (
            <li key={transcription.id} className="mb-4 p-4 border rounded">
              <h3 className="font-bold">{transcription.language}</h3>
              <p>{transcription.text.substring(0, 100)}...</p>
              <p className="text-sm text-gray-500">Created: {new Date(transcription.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;