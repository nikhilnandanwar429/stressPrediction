import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { processAudioFile } from '../utils/audioProcessor';
import RecordAudio from '../components/RecordAudio';

const HomePage = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showPredict, setShowPredict] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(null); // for UI display
  const navigate = useNavigate();

  const questions = [
    "What was the last movie you watched?",
    "Do you usually listen to music while working or studying?", 
    // "What's your go-to song when you're feeling down?", 
    // "What's a book you recommend everyone should read?", 
    // "What's your dream travel destination?", 
    // "What's one app you can't live without?", 
    // "What's something you've always wanted to try but haven't yet?", 
    // "If you could learn any skill instantly, what would it be?", 
    // "What's your favorite memory with your family?", 
    // "What's one thing you've learned from a family member?", 
  ];

  const handleAudioRecorded = (audioBlob) => {
    const file = new File([audioBlob], `question_${currentQuestion + 1}.wav`, {
      type: 'audio/wav'
    });
    setAudioFiles(prev => [...prev, file]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowPredict(true);
    }
  };

  const handleSubmit = async () => {
    setProcessing(true);
    try {
      // Step 1: Play audios sequentially
      for (let i = 0; i < audioFiles.length; i++) {
        setPlayingIndex(i);
        await playAudio(audioFiles[i]);
      }

      // Step 2: Process audio after all are played
      setPlayingIndex(null);
      const results = await Promise.all(
        audioFiles.map(file => processAudioFile(file))
      );

      console.log("Processing Results:", results);
      localStorage.removeItem('analysisResults');
      localStorage.setItem('analysisResults', JSON.stringify(results));
      navigate('/group');
    } catch (error) {
      console.error('Error processing audio files:', error);
      alert('Error processing audio files. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const playAudio = (file) => {
    return new Promise((resolve) => {
      const audioUrl = URL.createObjectURL(file);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl); // Clean up
        resolve(); // Resolve when audio ends
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        {!showPredict ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <p className="text-lg text-gray-700">{questions[currentQuestion]}</p>
            <div className="space-y-4">
              <RecordAudio 
                onRecordingComplete={handleAudioRecorded}
                isRecording={isRecording}
                setIsRecording={setIsRecording}
              />
              <p className="text-sm text-gray-500">
                Click the microphone to start/stop recording your answer
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-600">
              All questions answered!
            </h2>
            <div className="text-gray-700">
              <p>You've recorded {audioFiles.length} responses.</p>
              {playingIndex !== null && (
                <p className="text-blue-500">
                  Playing audio {playingIndex + 1} of {audioFiles.length}...
                </p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={processing}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {processing ? (playingIndex !== null ? 'Playing Recordings...' : 'Processing...') : 'Predict Stress'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
