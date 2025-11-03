import {
    GET_STATISTICS,
    GET_STATISTICS_SUCCESS,
    GET_STATISTICS_FAIL,
    ADD_STATISTICS,
    ADD_STATISTICS_SUCCESS,
    ADD_STATISTICS_FAIL,
    UPDATE_STATISTICS,
    UPDATE_STATISTICS_SUCCESS,
    UPDATE_STATISTICS_FAIL,
    DELETE_STATISTICS,
    DELETE_STATISTICS_SUCCESS,
    DELETE_STATISTICS_FAIL,
    SET_STATISTICS_FIELD_ERRORS,
  } from './actionTypes';
  
  // Get Statistics
  export const getStatistics = (filters) => ({
    type: GET_STATISTICS,
    payload: filters,
  });
  
  export const getStatisticsSuccess = (statistics) => ({
    type: GET_STATISTICS_SUCCESS,
    payload: statistics,
  });
  
  export const getStatisticsFail = (error) => ({
    type: GET_STATISTICS_FAIL,
    payload: error,
  });
  
  // Add Statistics
  export const addStatistics = (statistic, resetForm, handleClose) => ({
    type: ADD_STATISTICS,
    payload: { statistic, resetForm, handleClose },
  });
  
  export const addStatisticsSuccess = (statistic) => ({
    type: ADD_STATISTICS_SUCCESS,
    payload: statistic,
  });
  
  export const addStatisticsFail = (error) => ({
    type: ADD_STATISTICS_FAIL,
    payload: error,
  });
  
  // Update Statistics
  export const updateStatistics = (statistic, id, resetForm, handleClose) => ({
    type: UPDATE_STATISTICS,
    payload: { statistic, id, resetForm, handleClose },
  });
  
  export const updateStatisticsSuccess = (statistic) => ({
    type: UPDATE_STATISTICS_SUCCESS,
    payload: statistic,
  });
  
  export const updateStatisticsFail = (error) => ({
    type: UPDATE_STATISTICS_FAIL,
    payload: error,
  });
  
  // Delete Statistics
  export const deleteStatistics = (id) => ({
    type: DELETE_STATISTICS,
    payload: id,
  });
  
  export const deleteStatisticsSuccess = (id) => ({
    type: DELETE_STATISTICS_SUCCESS,
    payload: id,
  });
  
  export const deleteStatisticsFail = (error) => ({
    type: DELETE_STATISTICS_FAIL,
    payload: error,
  });
  
  // Set Field Errors
  export const setStatisticsFieldErrors = (errors) => ({
    type: SET_STATISTICS_FIELD_ERRORS,
    payload: errors,
  });
  