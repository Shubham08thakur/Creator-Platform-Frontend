import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:5000/api';

// Report a content
export const reportContent = async (contentId, reportData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    }
  };

  const response = await axios.post(
    `${API_URL}/reports`, 
    { contentId, ...reportData }, 
    config
  );

  return response.data;
};

// For admin: Get all reported content
export const getReportedContent = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  };

  const response = await axios.get(`${API_URL}/reports`, config);
  return response.data;
};

// For admin: Update report status
export const updateReportStatus = async (reportId, status) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    }
  };

  const response = await axios.put(
    `${API_URL}/reports/${reportId}`, 
    { status }, 
    config
  );

  return response.data;
}; 