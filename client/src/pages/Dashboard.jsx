import React, { useEffect, useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { createTranscription, getTranscriptions } from '../services/transcriptions';
import { setTranscriptions, addTranscription } from '../context/AppContext';

const Dashboard = () => {
  const { state, dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en-US');

  useEffect(() => {
    const fetchTranscriptions = async () => {
      try {
        const transcriptions = await getTranscriptions();
        dispatch(setTranscriptions(transcriptions))
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transcriptions:', err);
        setError('Failed to load transcriptions. Please try again later.');
        setLoading(false);
      }
    };

    fetchTranscriptions();
  }, [dispatch]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTranscription = await createTranscription({ text, language });
      dispatch(addTranscription(newTranscription));
      setText('');
      // setLanguage('en-US');
    } catch (err) {
      console.error('Error creating transcription:', err);
      setError('Failed to create transcription. Please try again.');
    }
  };

  if (loading) return <div>Loading transcriptions...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <h3 className="text-xl font-bold mb-2">Create New Transcription</h3>
        <div className="mb-4">
          <label htmlFor="text" className="block mb-2">Text</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="language" className="block mb-2">Language</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="en-US">English (US)</option>
            <option value="es-ES">Spanish (Spain)</option>
            <option value="fr-FR">French (France)</option>
            {/* Add more language options as needed */}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Transcription
        </button>
      </form>

      <h3 className="text-xl font-bold mb-2">Your Transcriptions</h3>
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