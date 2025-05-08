import axios from 'axios';
import { API_URL } from './config';

// Get user profile
export const getUserProfile = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };

  const response = await axios.get(`${API_URL}/users/profile`, config);
  return response.data;
};

// Update user profile
export const updateUserProfile = async (userData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };

  const response = await axios.put(`${API_URL}/users/profile`, userData, config);
  return response.data;
}; 