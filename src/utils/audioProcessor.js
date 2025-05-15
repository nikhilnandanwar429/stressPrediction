export const processAudioFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        // Create form data to send the audio file
        const formData = new FormData();
        formData.append('audio', file);

        console.log('Sending audio file to backend...');
        console.log('File type:', file.type);
        console.log('File size:', file.size);

        // Send the audio file to the backend
        const response = await fetch('http://127.0.0.1:5000/predict', {
          method: 'POST',
          body: formData,
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to analyze audio: ${errorText}`);
        }

        const result = await response.json();
        console.log('Response data:', result);
        
        resolve({
          duration: formatDuration(result.duration || 0),
          stressLevel: result.stressLevel,
          date: new Date().toISOString().split('T')[0]
        });
      } catch (error) {
        console.error('Detailed error:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}; 