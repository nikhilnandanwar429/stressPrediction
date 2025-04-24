import React, { useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa6";

function RecordAudio({ onRecordingComplete, isRecording, setIsRecording }) {
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                if (onRecordingComplete) {
                    onRecordingComplete(audioBlob);
                }
                chunksRef.current = [];
                
                // Clean up the stream
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone. Please ensure you have granted permission.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

    return (
        <div className="flex justify-center">
            <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-4 rounded-full transition-all ${
                    isRecording 
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
        </div>
    );
}

export default RecordAudio;
