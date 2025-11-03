import {
    GET_GUIDE_CLASSIFICATIONS,
    GET_GUIDE_CLASSIFICATIONS_SUCCESS,
    GET_GUIDE_CLASSIFICATIONS_FAIL,
    ADD_GUIDE_CLASSIFICATION,
    ADD_GUIDE_CLASSIFICATION_SUCCESS,
    ADD_GUIDE_CLASSIFICATION_FAIL,
    UPDATE_GUIDE_CLASSIFICATION,
    UPDATE_GUIDE_CLASSIFICATION_SUCCESS,
    UPDATE_GUIDE_CLASSIFICATION_FAIL,
    DELETE_GUIDE_CLASSIFICATION,
    DELETE_GUIDE_CLASSIFICATION_SUCCESS,
    DELETE_GUIDE_CLASSIFICATION_FAIL,
    SET_GUIDE_CLASSIFICATION_FIELD_ERRORS,
  } from './actionTypes'
  
  // ==================== GET ALL ====================
  export const getGuideClassifications = (payload) => ({
    type: GET_GUIDE_CLASSIFICATIONS,
    payload,
  })
  
  export const getGuideClassificationsSuccess = (data) => ({
    type: GET_GUIDE_CLASSIFICATIONS_SUCCESS,
    payload: data,
  })
  
  export const getGuideClassificationsFail = (error) => ({
    type: GET_GUIDE_CLASSIFICATIONS_FAIL,
    payload: error,
  })
  
  // ==================== ADD ====================
  export const addGuideClassification = (data, resetForm, handleClose) => ({
    type: ADD_GUIDE_CLASSIFICATION,
    payload: { data, resetForm, handleClose },
  })
  
  export const addGuideClassificationSuccess = (data) => ({
    type: ADD_GUIDE_CLASSIFICATION_SUCCESS,
    payload: data,
  })
  
  export const addGuideClassificationFail = (error) => ({
    type: ADD_GUIDE_CLASSIFICATION_FAIL,
    payload: error,
  })
  
  // ================= UPDATE ===================
  export const updateGuideClassification = (data, id, resetForm, handleClose) => ({
    type: UPDATE_GUIDE_CLASSIFICATION,
    payload: { data, id, resetForm, handleClose },
  })
  
  export const updateGuideClassificationSuccess = (data) => ({
    type: UPDATE_GUIDE_CLASSIFICATION_SUCCESS,
    payload: data,
  })
  
  export const updateGuideClassificationFail = (error) => ({
    type: UPDATE_GUIDE_CLASSIFICATION_FAIL,
    payload: error,
  })
  
  // ==================== DELETE ====================
  export const deleteGuideClassification = (id) => ({
    type: DELETE_GUIDE_CLASSIFICATION,
    payload: id,
  })
  
  export const deleteGuideClassificationSuccess = (id) => ({
    type: DELETE_GUIDE_CLASSIFICATION_SUCCESS,
    payload: id,
  })
  
  export const deleteGuideClassificationFail = (error) => ({
    type: DELETE_GUIDE_CLASSIFICATION_FAIL,
    payload: error,
  })
  
  // ==================== FIELD ERRORS ====================
  export const setGuideClassificationFieldErrors = (errors) => ({
    type: SET_GUIDE_CLASSIFICATION_FIELD_ERRORS,
    payload: errors,
  })
  