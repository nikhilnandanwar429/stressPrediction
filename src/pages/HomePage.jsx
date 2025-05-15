import React, { useState } from 'react';
import { processAudioFile } from '../utils/audioProcessor';
import RecordAudio from '../components/RecordAudio';

const HomePage = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [stressLevel, setStressLevel] = useState(null);
  const [activeMode, setActiveMode] = useState(null); // 'upload' or 'record'

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setActiveMode('upload');
    } else {
      alert('Please upload an audio file');
    }
  };

  const handleAudioRecorded = (audioBlob) => {
    const file = new File([audioBlob], 'recording.wav', {
      type: 'audio/wav'
    });
    setAudioFile(file);
    setActiveMode('record');
  };

  const handleSubmit = async () => {
    if (!audioFile) {
      alert('Please upload or record an audio file first');
      return;
    }

    setProcessing(true);
    try {
      const result = await processAudioFile(audioFile);
      setStressLevel(result.stressLevel);
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Error processing audio. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const resetAudio = () => {
    setAudioFile(null);
    setActiveMode(null);
    setStressLevel(null);
  };

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
              disabled={activeMode === 'record'}
              className={`block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                ${activeMode === 'record' 
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
                onRecordingComplete={handleAudioRecorded}
                isRecording={isRecording}
                setIsRecording={setIsRecording}
                disabled={activeMode === 'upload'}
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Click the microphone to start/stop recording
            </p>
          </div>

          {/* Current Audio Status */}
          {audioFile && (
            <div className="p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                {activeMode === 'upload' ? 'Audio file uploaded' : 'Audio recorded'}
              </p>
              <button
                onClick={resetAudio}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Clear and try again
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={processing || !audioFile}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : 'Analyze Stress Level'}
          </button>

          {/* Results Display */}
          {stressLevel !== null && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Analysis Result
              </h2>
              <p className="text-2xl font-bold text-blue-600">
                Stress Level: {stressLevel}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
