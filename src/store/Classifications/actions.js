import {
    GET_CLASSIFICATIONS,
    GET_CLASSIFICATIONS_SUCCESS,
    GET_CLASSIFICATIONS_FAIL,
    ADD_CLASSIFICATIONS,
    ADD_CLASSIFICATIONS_SUCCESS,
    ADD_CLASSIFICATIONS_FAIL,
    UPDATE_CLASSIFICATIONS,
    UPDATE_CLASSIFICATIONS_SUCCESS,
    UPDATE_CLASSIFICATIONS_FAIL,
    DELETE_CLASSIFICATIONS,
    DELETE_CLASSIFICATIONS_SUCCESS,
    DELETE_CLASSIFICATIONS_FAIL,
    SET_CLASSIFICATION_FIELD_ERRORS,
  } from './actionTypes'
  
  // Get Classifications
  export const getClassifications = (classifications) => ({
    type: GET_CLASSIFICATIONS,
    payload:classifications
  })
  
  export const getClassificationsSuccess = (classifications) => ({
    type: GET_CLASSIFICATIONS_SUCCESS,
    payload: classifications,
  })
  
  export const getClassificationsFail = (error) => ({
    type: GET_CLASSIFICATIONS_FAIL,
    payload: error,
  })
  
  // Add Classification
  export const addClassification = (classification,resetForm,handleClose) => ({
    type: ADD_CLASSIFICATIONS,
    payload: {classification:classification,resetForm:resetForm,handleClose:handleClose},
  })
  
  export const addClassificationSuccess = (classification) => ({
    type: ADD_CLASSIFICATIONS_SUCCESS,
    payload: classification,
  })
  
  export const addClassificationFail = (error) => ({
    type: ADD_CLASSIFICATIONS_FAIL,
    payload: error,
  })
  
  // Update Classification
  export const updateClassification = (classification,id,resetForm,handleClose) => ({
    type: UPDATE_CLASSIFICATIONS,
    payload: {classification:classification,id:id,resetForm,handleClose},
  })
  
  export const updateClassificationSuccess = (classification) => ({
    type: UPDATE_CLASSIFICATIONS_SUCCESS,
    payload: classification,
  })
  
  export const updateClassificationFail = (error) => ({
    type: UPDATE_CLASSIFICATIONS_FAIL,
    payload: error,
  })
  
  // Delete Classification
  export const deleteClassification = (id) => ({
    type: DELETE_CLASSIFICATIONS,
    payload: id,
  })
  
  export const deleteClassificationSuccess = (id) => ({
    type: DELETE_CLASSIFICATIONS_SUCCESS,
    payload: id,
  })
  
  export const deleteClassificationFail = (error) => ({
    type: DELETE_CLASSIFICATIONS_FAIL,
    payload: error,
  })
  
  // Set Field Errors
  export const setClassificationFieldErrors = (errors) => ({
    type: SET_CLASSIFICATION_FIELD_ERRORS,
    payload: errors,
  })
  