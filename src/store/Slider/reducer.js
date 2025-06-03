import {
    GET_SLIDERS,
    GET_SLIDERS_SUCCESS,
    GET_SLIDERS_FAIL,
    ADD_SLIDER,
    ADD_SLIDER_SUCCESS,
    ADD_SLIDER_FAIL,
    UPDATE_SLIDER,
    UPDATE_SLIDER_SUCCESS,
    UPDATE_SLIDER_FAIL,
    DELETE_SLIDER,
    DELETE_SLIDER_SUCCESS,
    DELETE_SLIDER_FAIL,
    SET_SLIDER_FIELD_ERRORS,
  } from './actionTypes';
  
  const initialState = {
    sliders: [],
    loading: false,
    error: null,
    fieldErrors: {},
  };
  
  const sliderReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_SLIDERS:
        return { ...state, loading: true };
  
      case GET_SLIDERS_SUCCESS:
        return { ...state, loading: false, sliders: action.payload };
  
      case GET_SLIDERS_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case ADD_SLIDER:
        return { ...state, loading: true };
  
      case ADD_SLIDER_SUCCESS:
        return { ...state, loading: false, fieldErrors: {} };
  
      case ADD_SLIDER_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case UPDATE_SLIDER:
        return { ...state, loading: true };
  
      case UPDATE_SLIDER_SUCCESS:
        return { ...state, loading: false, fieldErrors: {} };
  
      case UPDATE_SLIDER_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case DELETE_SLIDER:
        return { ...state, loading: true };
  
      case DELETE_SLIDER_SUCCESS:
        return { ...state, loading: false };
  
      case DELETE_SLIDER_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case SET_SLIDER_FIELD_ERRORS:
        return { ...state, fieldErrors: action.payload };
  
      default:
        return state;
    }
  };
  
  export default sliderReducer;
  