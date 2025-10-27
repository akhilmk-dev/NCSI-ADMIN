import {
    GET_NEWS,
    GET_NEWS_SUCCESS,
    GET_NEWS_FAIL,
    ADD_NEWS,
    ADD_NEWS_SUCCESS,
    ADD_NEWS_FAIL,
    UPDATE_NEWS,
    UPDATE_NEWS_SUCCESS,
    UPDATE_NEWS_FAIL,
    DELETE_NEWS,
    DELETE_NEWS_SUCCESS,
    DELETE_NEWS_FAIL,
    SET_NEWS_FIELD_ERRORS,
  } from './actionTypes';
  
  // Get News
  export const getNews = (news) => ({
    type: GET_NEWS,
    payload: news,
  });
  
  export const getNewsSuccess = (news) => ({
    type: GET_NEWS_SUCCESS,
    payload: news,
  });
  
  export const getNewsFail = (error) => ({
    type: GET_NEWS_FAIL,
    payload: error,
  });
  
  // Add News
  export const addNews = (news, resetForm, handleClose) => ({
    type: ADD_NEWS,
    payload: { news, resetForm, handleClose },
  });
  
  export const addNewsSuccess = (news) => ({
    type: ADD_NEWS_SUCCESS,
    payload: news,
  });
  
  export const addNewsFail = (error) => ({
    type: ADD_NEWS_FAIL,
    payload: error,
  });
  
  // Update News
  export const updateNews = (news, id, resetForm, handleClose) => ({
    type: UPDATE_NEWS,
    payload: { news, id, resetForm, handleClose },
  });
  
  export const updateNewsSuccess = (news) => ({
    type: UPDATE_NEWS_SUCCESS,
    payload: news,
  });
  
  export const updateNewsFail = (error) => ({
    type: UPDATE_NEWS_FAIL,
    payload: error,
  });
  
  // Delete News
  export const deleteNews = (id) => ({
    type: DELETE_NEWS,
    payload: id,
  });
  
  export const deleteNewsSuccess = (id) => ({
    type: DELETE_NEWS_SUCCESS,
    payload: id,
  });
  
  export const deleteNewsFail = (error) => ({
    type: DELETE_NEWS_FAIL,
    payload: error,
  });
  
  // Set Field Errors
  export const setNewsFieldErrors = (errors) => ({
    type: SET_NEWS_FIELD_ERRORS,
    payload: errors,
  });
  