import React, { useRef, useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa6";
import { predictStress } from '../utils/api';

function RecordAudio({ onRecordingComplete, isRecording, setIsRecording, disabled }) {
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const startRecording = async () => {
        if (disabled) return;
        setError(null);
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                chunksRef.current = [];
                
                // Clean up the stream
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }

                // Process the audio
                try {
                    setIsProcessing(true);
                    const result = await predictStress(audioBlob);
                    if (onRecordingComplete) {
                        onRecordingComplete(result);
                    }
                } catch (err) {
                    setError('Failed to process audio. Please try again.');
                    console.error('Error processing audio:', err);
                } finally {
                    setIsProcessing(false);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            setError('Could not access microphone. Please ensure you have granted permission.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <button 
                onClick={isRecording ? stopRecording : startRecording}
                disabled={disabled || isProcessing}
                className={`p-4 rounded-full transition-all ${
                    disabled || isProcessing
                        ? 'bg-gray-300 cursor-not-allowed'
                        : isRecording 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
                {isRecording ? (
                    <FaMicrophoneSlash className="w-6 h-6 text-white" />
                ) : (
                    <FaMicrophone className="w-6 h-6 text-white" />
                )}
            </button>
            {isProcessing && (
                <p className="text-blue-500">Processing audio...</p>
            )}
            {error && (
                <p className="text-red-500">{error}</p>
            )}
        </div>
    );
}

export default RecordAudio;
