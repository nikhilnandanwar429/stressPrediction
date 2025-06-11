import axios from 'axios';

const API_BASE_URL = 'https://stresspredictionbackend.onrender.com'; // Backend URL

export const predictStress = async (audioBlob) => {
    try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');

        const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        // console.log(response);
        
        return response.data;
    } catch (error) {
        console.error('Error predicting stress:', error);
        throw error;
    }
}; 