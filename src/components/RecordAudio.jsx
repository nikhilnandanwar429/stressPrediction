import React, { useRef, useState, useEffect } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa6";
import { predictStress } from '../utils/api';

function RecordAudio({ onRecordingComplete, isRecording, setIsRecording, disabled }) {
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [micPermission, setMicPermission] = useState(null);

    useEffect(() => {
        setMicPermission(true); // Initially allow button to be clickable
    }, []);

    const startRecording = async () => {
        if (disabled) return;
        
        // Simulate microphone not available error
        setError('No microphone detected on your device');
        setMicPermission(false);
        return;
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
                disabled={disabled || isProcessing || (micPermission === false)}
                className={`p-4 rounded-full transition-all ${
                    disabled || isProcessing || (micPermission === false)
                        ? 'bg-gray-300 cursor-not-allowed'
                        : isRecording 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-blue-500 hover:bg-blue-600'
                }`}
                title={micPermission === false ? "Microphone not available" : "Record audio"}
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
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
                    {error}
                </div>
            )}
        </div>
    );
}

export default RecordAudio;
