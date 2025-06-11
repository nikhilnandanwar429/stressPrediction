import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

function RecordAudio({backTrackAudio}) {
    const [data, setData] = useState(null);
    const [isRecord, setIsRecord] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordingBlob, setRecordingBlob] = useState(null);

    // Initialize media recorder
    const initializeRecorder = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            
            const chunks = [];
            
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };
            
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                setRecordingBlob(blob);
                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };
            
            setMediaRecorder(recorder);
            return recorder;
        } catch (error) {
            console.error('Error accessing microphone:', error);
            return null;
        }
    };

    const startRecording = async () => {
        let recorder = mediaRecorder;
        
        if (!recorder || recorder.state === 'inactive') {
            recorder = await initializeRecorder();
        }
        
        if (recorder && recorder.state === 'inactive') {
            recorder.start();
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    };

    // Update data once recordingBlob becomes available
    useEffect(() => {
        // console.log("useEffect started")
        if (recordingBlob) {
            // console.log("Recording blob is ready", recordingBlob);
            setData(recordingBlob);
            backTrackAudio(recordingBlob);
        }
    }, [recordingBlob]);

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                onClick={async () => {
                    if (isRecord) {
                        // console.log("Recording stopped");
                        stopRecording();
                        setIsRecord(false);
                    } else {
                        // console.log("Recording started");
                        await startRecording();
                        setIsRecord(true);
                    }
                }}
                className={`p-4 rounded-full transition-all cursor-pointer ${isRecord
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                    }`}
            >
                {isRecord ? (
                    <MicOff className="w-6 h-6 text-white" />
                ) : (
                    <Mic className="w-6 h-6 text-white" />
                )}
            </button>
            {isRecord && (
                <p className="text-blue-500">Recording audio...</p>
            )}
        </div>
    );
}

export default RecordAudio;