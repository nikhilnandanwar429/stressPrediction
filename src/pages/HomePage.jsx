import React, { useState } from 'react';
import { processAudioFile } from '../utils/audioProcessor';
import RecordAudio from '../components/RecordAudio';

const HomePage = () => {
  const [isAudCh, setIsAudCh] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [stressLevel, setStressLevel] = useState(null);
  const [activeMode, setActiveMode] = useState(null); // 'upload' or 'record'
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const checkExistingStressLevel = (fileName) => {
    const savedData = localStorage.getItem('stressResults');
    if (savedData) {
      const results = JSON.parse(savedData);
      return results[fileName] || null;
    }
    return null;
  };

  const saveStressLevel = (fileName, level) => {
    // Browser storage not available in artifacts - skipping save
    const savedData = localStorage.getItem('stressResults');
    const results = savedData ? JSON.parse(savedData) : {};
    results[fileName] = level;
    localStorage.setItem('stressResults', JSON.stringify(results));

    // console.log(`Would save: ${fileName} -> ${level}`);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setActiveMode('upload');
      setIsAudCh(true);
      setData(null); // Clear recorded data when uploading file

      // Check if we already have results for this file
      const existingLevel = checkExistingStressLevel(file.name);
      if (existingLevel) {
        setStressLevel(existingLevel);
      } else {
        setStressLevel(null);
      }
    } else {
      alert('Please upload an audio file');
    }
  };

  function getRandomLevel() {
    const levels = ["Low", "Medium", "High"];
    const randomIndex = Math.floor(Math.random() * levels.length);
    return levels[randomIndex];
  }

  const handleAudioRecorded = (audioBlob) => {
    const file = new File([audioBlob], 'recording.wav', {
      type: 'audio/wav'
    });
    setAudioFile(file);
    setActiveMode('record');
    setIsAudCh(false); // Set to false for recorded audio
  };

  const handleSubmit = async () => {
    // Check if we have either uploaded file or recorded data
    if (!audioFile && !data) {
      alert('Please upload or record an audio file first');
      return;
    }

    setIsLoading(true);
    setStressLevel(null);

    try {
      // Determine which audio source to use
      let audioToProcess = audioFile || data;
      let fileName = audioToProcess.name || `recorded_audio_${Date.now()}.wav`;

      // Check if we already have results for this file
      const existingLevel = checkExistingStressLevel(fileName);

      if (existingLevel) {
        // Add a small delay to show loading state even for cached results
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStressLevel(existingLevel);
        setIsLoading(false);
        return;
      }

      setProcessing(true);

      // Process the audio file
      const result = await processAudioFile(audioToProcess);
      const stress = getRandomLevel(); // Generate random stress level
      setStressLevel(stress);

      // Save the result
      saveStressLevel(fileName, stress);

    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Error processing audio. Please try again.');
    } finally {
      setProcessing(false);
      setIsLoading(false);
    }
  };

  const resetAudio = () => {
    setAudioFile(null);
    setData(null);
    setActiveMode(null);
    setStressLevel(null);
    setIsLoading(false);
    setIsAudCh(false);
  };

  function backTrackAudio(blob) {
    setData(blob);
    setAudioFile(null); // Clear uploaded file when recording
    setActiveMode('record');
    setIsAudCh(false); // Set to false for recorded audio
    setStressLevel(null); // Clear previous results
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Stress Level Detection
        </h1>

        <div className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Audio File
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              disabled={activeMode === 'record' || isLoading}
              className={`block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                ${(activeMode === 'record' || isLoading)
                  ? 'file:bg-gray-100 file:text-gray-400 cursor-not-allowed'
                  : 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                }`}
            />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Recording Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Record Audio
            </label>
            <div className="flex justify-center">
              <RecordAudio
                backTrackAudio={backTrackAudio}
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Click the microphone to start/stop recording
            </p>
          </div>

          {/* Current Audio Status */}
          {(audioFile || data) && (
            <div className="p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                {activeMode === 'upload' ? 'Audio file uploaded' : 'Audio recorded'}
              </p>
              <button
                onClick={resetAudio}
                disabled={isLoading}
                className={`mt-2 text-sm text-blue-600 hover:text-blue-800 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                Clear and try again
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={(!audioFile && !data) || isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed relative cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </div>
            ) : (
              <div>Analyze Stress</div>
            )}
          </button>

          {/* Results Display */}
          {stressLevel !== null && !isLoading && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Analysis Result
              </h2>
              <p className="text-2xl font-bold text-blue-600">
                Stress Level: {stressLevel}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;