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
  
  const initialState = {
    classifications: [],
    loading: false,
    error: null,
    status: null,
    fieldErrors: {}, // Store field-specific errors
  }
  
  const classificationReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_CLASSIFICATIONS:
        return { ...state, loading: true }
      case GET_CLASSIFICATIONS_SUCCESS:
        return { ...state, loading: false, classifications: action.payload }
      case GET_CLASSIFICATIONS_FAIL:
        return { ...state, loading: false, error: action.payload }
  
      case ADD_CLASSIFICATIONS:
        return { ...state, loading: true }
      case ADD_CLASSIFICATIONS_SUCCESS:
        return { ...state, loading: false, status: 'success', fieldErrors: {} }
      case ADD_CLASSIFICATIONS_FAIL:
        return { ...state, loading: false, error: action.payload }
  
      case UPDATE_CLASSIFICATIONS:
        return { ...state, loading: true }
      case UPDATE_CLASSIFICATIONS_SUCCESS:
        return { ...state, loading: false, fieldErrors: {} }
      case UPDATE_CLASSIFICATIONS_FAIL:
        return { ...state, loading: false, error: action.payload }
  
      case DELETE_CLASSIFICATIONS:
        return { ...state, loading: true }
      case DELETE_CLASSIFICATIONS_SUCCESS:
        return { ...state, loading: false }
      case DELETE_CLASSIFICATIONS_FAIL:
        return { ...state, loading: false, error: action.payload }
  
      case SET_CLASSIFICATION_FIELD_ERRORS:
        return { ...state, fieldErrors: action.payload }
  
      default:
        return state
    }
  }
  
  export default classificationReducer
  