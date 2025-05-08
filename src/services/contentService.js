import axios from 'axios';
import { API_URL } from './config';

// Get all content with optional query parameters
export const getContents = async (query = '') => {
  try {
    const res = await axios.get(`${API_URL}/content${query}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get a single content by ID
export const getContentById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/content/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create new content
export const createContent = async (contentData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    const res = await axios.post(`${API_URL}/content`, contentData, config);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update content
export const updateContent = async (id, contentData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    const res = await axios.put(`${API_URL}/content/${id}`, contentData, config);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete content
export const deleteContent = async (id) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    const res = await axios.delete(`${API_URL}/content/${id}`, config);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Like content
export const likeContent = async (id) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    const res = await axios.put(`${API_URL}/content/${id}/like`, {}, config);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Comment on content
export const commentOnContent = async (id, commentData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    const res = await axios.post(`${API_URL}/content/${id}/comments`, commentData, config);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 