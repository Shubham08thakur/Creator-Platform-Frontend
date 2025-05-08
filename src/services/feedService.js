import axios from 'axios';
import { API_URL } from './config';

// Get feed with optional filters
export const getFeed = async (query = '') => {
  const response = await axios.get(`${API_URL}/feed${query}`);
  return response.data;
};

// Save content to user's collection
export const saveContent = async (contentData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };

  const response = await axios.post(`${API_URL}/feed/save`, contentData, config);
  return response.data;
};

// Get user's saved content
export const getSavedContent = async (query = '') => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };

  const response = await axios.get(`${API_URL}/feed/saved${query}`, config);
  return response.data;
};

// Delete saved content
export const deleteSavedContent = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };

  const response = await axios.delete(`${API_URL}/feed/saved/${id}`, config);
  return response.data;
};

// Report content
export const reportContent = async (reportData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };

  const response = await axios.post(`${API_URL}/feed/report`, reportData, config);
  return response.data;
}; 