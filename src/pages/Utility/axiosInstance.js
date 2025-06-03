// src/axiosInstance.js
import axios from 'axios';
import { BASE_URL } from 'constants/config';
import { showError } from 'helpers/notification_helper';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  // Default baseURL (can be overridden in the request itself)
  baseURL: `${BASE_URL}`, // Default base URL
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach the access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Check if the request method is POST and switch the base URL if necessary
    if (config.method === 'post') {
      config.baseURL = `${BASE_URL}` // Change baseURL for POST requests
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors (unauthorized) and refresh token
axiosInstance.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // If the error is 401, and the request hasn't been retried yet

      originalRequest._retry = true;

      try {
        // Attempt to refresh the access token
        const refreshToken = Cookies.get('refresh_token');
        const response = await axios.post(`${BASE_URL}`, {
          "sp": "regenerateAccessToken",
          "refreshToken": refreshToken
      });

        // Save the new access token to localStorage or your store
        const newAccessToken = response.data.accessToken;
        Cookies?.set('access_token', newAccessToken);

        // Retry the original request with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refreshing the token fails, log out the user
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        // Redirect to login page
        showError("Session Expired, Please login")
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }else if(error.response.status === 500){
      if(error.response?.data?.Message?.startsWith("The DELETE statement")){
        showError("Unable to delete as dependencies found")
      }else if(error.response.data?.Message){
        showError(error.response.data?.Message)
      }else{
        showError("Something went wrong")
      }
      
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
