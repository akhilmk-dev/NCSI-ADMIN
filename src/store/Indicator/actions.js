import {
    GET_INDICATORS,
    GET_INDICATORS_SUCCESS,
    GET_INDICATORS_FAIL,
    ADD_INDICATOR,
    ADD_INDICATOR_SUCCESS,
    ADD_INDICATOR_FAIL,
    UPDATE_INDICATOR,
    UPDATE_INDICATOR_SUCCESS,
    UPDATE_INDICATOR_FAIL,
    DELETE_INDICATOR,
    DELETE_INDICATOR_SUCCESS,
    DELETE_INDICATOR_FAIL,
    SET_INDICATOR_FIELD_ERRORS,
  } from './actionTypes';
  
  // Get Indicators
  export const getIndicators = (data) => ({
    type: GET_INDICATORS,
    payload:data
  });
  
  export const getIndicatorsSuccess = (indicators) => ({
    type: GET_INDICATORS_SUCCESS,
    payload: indicators,
  });
  
  export const getIndicatorsFail = (error) => ({
    type: GET_INDICATORS_FAIL,
    payload: error,
  });
  
  // Add Indicator
  export const addIndicator = (indicator, resetForm, handleClose) => ({
    type: ADD_INDICATOR,
    payload: { indicator, resetForm, handleClose },
  });
  
  export const addIndicatorSuccess = (indicator) => ({
    type: ADD_INDICATOR_SUCCESS,
    payload: indicator,
  });
  
  export const addIndicatorFail = (error) => ({
    type: ADD_INDICATOR_FAIL,
    payload: error,
  });
  
  // Update Indicator
  export const updateIndicator = (indicator, id, resetForm, handleClose) => ({
    type: UPDATE_INDICATOR,
    payload: { indicator, id, resetForm, handleClose },
  });
  
  export const updateIndicatorSuccess = (indicator) => ({
    type: UPDATE_INDICATOR_SUCCESS,
    payload: indicator,
  });
  
  export const updateIndicatorFail = (error) => ({
    type: UPDATE_INDICATOR_FAIL,
    payload: error,
  });
  
  // Delete Indicator
  export const deleteIndicator = (id) => ({
    type: DELETE_INDICATOR,
    payload: id,
  });
  
  export const deleteIndicatorSuccess = (id) => ({
    type: DELETE_INDICATOR_SUCCESS,
    payload: id,
  });
  
  export const deleteIndicatorFail = (error) => ({
    type: DELETE_INDICATOR_FAIL,
    payload: error,
  });
  
  // Set Field Errors
  export const setIndicatorFieldErrors = (errors) => ({
    type: SET_INDICATOR_FIELD_ERRORS,
    payload: errors,
  });
  