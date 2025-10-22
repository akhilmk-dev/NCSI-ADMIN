import {
    GET_FEEDBACKS,
    GET_FEEDBACKS_SUCCESS,
    GET_FEEDBACKS_FAIL,
    DELETE_FEEDBACK,
    DELETE_FEEDBACK_SUCCESS,
    DELETE_FEEDBACK_FAIL,
  } from './actionTypes';
  
  // Get Feedbacks
  export const getFeedbacks = (data) => ({
    type: GET_FEEDBACKS,
    payload:data
  });
  
  export const getFeedbacksSuccess = (feedbacks) => ({
    type: GET_FEEDBACKS_SUCCESS,
    payload: feedbacks,
  });
  
  export const getFeedbacksFail = (error) => ({
    type: GET_FEEDBACKS_FAIL,
    payload: error,
  });
  
  // Delete Feedback
  export const deleteFeedback = (id) => ({
    type: DELETE_FEEDBACK,
    payload: id,
  });
  
  export const deleteFeedbackSuccess = (id) => ({
    type: DELETE_FEEDBACK_SUCCESS,
    payload: id,
  });
  
  export const deleteFeedbackFail = (error) => ({
    type: DELETE_FEEDBACK_FAIL,
    payload: error,
  });
  