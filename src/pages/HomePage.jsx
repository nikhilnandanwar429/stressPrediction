import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { processAudioFile } from '../utils/audioProcessor';

const HomePage = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleAudioUpload = (event) => {
    const files = Array.from(event.target.files);
    setAudioFiles(prev => [...prev, ...files]);
  };

  const handleSubmit = async () => {
    setProcessing(true);
    try {
      const results = await Promise.all(
        audioFiles.map(file => processAudioFile(file))
      );
      
      // Store results in localStorage for demo purposes
      // In a real app, you'd send this to your backend
      localStorage.setItem('analysisResults', JSON.stringify(results));
      navigate('/group');
    } catch (error) {
      console.error('Error processing audio files:', error);
      alert('Error processing audio files. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Audio Files</h1>
          
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <label
                  htmlFor="audio-upload"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Upload Audio Files
                </label>
                <input
                  id="audio-upload"
                  type="file"
                  accept="audio/*"
                  multiple
                  className="hidden"
                  onChange={handleAudioUpload}
                />
              </div>
            </div>

            {audioFiles.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Uploaded Files:</h2>
                <ul className="space-y-2">
                  {audioFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <button
                        onClick={() => setAudioFiles(files => files.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={audioFiles.length === 0 || processing}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : 'Process Audio Files'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 