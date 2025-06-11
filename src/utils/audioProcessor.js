import { API_URL, ENDPOINTS } from './config';

export const processAudioFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        // Validate file type and size
        if (!file.type.startsWith('audio/')) {
          // console.log('Invalid file type:', file.type);
          throw new Error('Invalid file type. Please upload an audio file.');
        }

        if (file.size > 16 * 1024 * 1024) { // 16MB
          throw new Error('File size too large. Maximum size is 16MB.');
        }

        // Create form data to send the audio file
        const formData = new FormData();
        formData.append('audio', file);
        // console.log("formData", formData);

        // console.log('Sending audio file to backend...');
        // console.log('File type:', file.type);
        // console.log('File size:', file.size);

        // Send the audio file to the backend with retry logic
        
        let lastError = null;

        
          try {
            // console.log("audioPro",  formData);
            const response = await fetch(`${API_URL}${ENDPOINTS.predict}`, {
              method: 'POST',
              body: formData,
              headers: {
                'Accept': 'application/json',
              },
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Error response:', errorText);
              throw new Error(errorText || 'Failed to analyze audio');
            }

            // console.log('Response status:', response.status);

            // if (!response.ok) {
            //   const errorText = await response.text();
            //   console.error('Error response:', errorText);
            //   throw new Error(errorText || 'Failed to analyze audio');
            // }

            const result = await response.json();
            // console.log('Response data:', result);
            
            // Map the prediction to stress levels
            const stressLevels = ['Low', 'Medium', 'High'];
            const stressLevel = stressLevels[result.predicted_class] || 'Unknown';
            
            resolve({
              stressLevel,
            
              date: new Date().toISOString().split('T')[0]
            });
            return; // Success, exit the retry loop
          } catch (error) {
            console.error(`Attempt ${4 - retries} failed:`, error);
            lastError = error;
            retries--;
            if (retries > 0) {
              // Wait for 1 second before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        
        
        // If we get here, all retries failed
        throw lastError || new Error('Failed to process audio after multiple attempts');
      } catch (error) {
        console.error('Error processing audio:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(new Error('Failed to read the audio file'));
    };

    // Start reading the file
    reader.readAsArrayBuffer(file);
  });
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}; 