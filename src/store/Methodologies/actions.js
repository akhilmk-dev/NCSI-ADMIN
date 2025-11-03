import {
    GET_METHODOLOGIES,
    GET_METHODOLOGIES_SUCCESS,
    GET_METHODOLOGIES_FAIL,
    ADD_METHODOLOGY,
    ADD_METHODOLOGY_SUCCESS,
    ADD_METHODOLOGY_FAIL,
    UPDATE_METHODOLOGY,
    UPDATE_METHODOLOGY_SUCCESS,
    UPDATE_METHODOLOGY_FAIL,
    DELETE_METHODOLOGY,
    DELETE_METHODOLOGY_SUCCESS,
    DELETE_METHODOLOGY_FAIL,
    SET_METHODOLOGY_FIELD_ERRORS,
  } from "./actionTypes";
  
  // ==================== GET ALL ====================
  export const getMethodologies = (payload) => ({
    type: GET_METHODOLOGIES,
    payload,
  });
  
  export const getMethodologiesSuccess = (data) => ({
    type: GET_METHODOLOGIES_SUCCESS,
    payload: data,
  });
  
  export const getMethodologiesFail = (error) => ({
    type: GET_METHODOLOGIES_FAIL,
    payload: error,
  });
  
  // ==================== ADD ====================
  export const addMethodology = (data, resetForm, handleClose) => ({
    type: ADD_METHODOLOGY,
    payload: { data, resetForm, handleClose },
  });
  
  export const addMethodologySuccess = (data) => ({
    type: ADD_METHODOLOGY_SUCCESS,
    payload: data,
  });
  
  export const addMethodologyFail = (error) => ({
    type: ADD_METHODOLOGY_FAIL,
    payload: error,
  });
  
  // ==================== UPDATE ====================
  export const updateMethodology = (data, id, resetForm, handleClose) => ({
    type: UPDATE_METHODOLOGY,
    payload: { data, id, resetForm, handleClose },
  });
  
  export const updateMethodologySuccess = (data) => ({
    type: UPDATE_METHODOLOGY_SUCCESS,
    payload: data,
  });
  
  export const updateMethodologyFail = (error) => ({
    type: UPDATE_METHODOLOGY_FAIL,
    payload: error,
  });
  
  // ==================== DELETE ====================
  export const deleteMethodology = (id) => ({
    type: DELETE_METHODOLOGY,
    payload: id,
  });
  
  export const deleteMethodologySuccess = (id) => ({
    type: DELETE_METHODOLOGY_SUCCESS,
    payload: id,
  });
  
  export const deleteMethodologyFail = (error) => ({
    type: DELETE_METHODOLOGY_FAIL,
    payload: error,
  });
  
  // ==================== FIELD ERRORS ====================
  export const setMethodologyFieldErrors = (errors) => ({
    type: SET_METHODOLOGY_FIELD_ERRORS,
    payload: errors,
  });
  