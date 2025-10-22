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
  
  const initialState = {
    indicators: [],
    loading: false,
    error: null,
    status: null,
    fieldErrors: {},
  };
  
  const indicatorReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_INDICATORS:
        return { ...state, loading: true };
  
      case GET_INDICATORS_SUCCESS:
        return { ...state, loading: false, indicators: action.payload };
  
      case GET_INDICATORS_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case ADD_INDICATOR:
        return { ...state, loading: true };
  
      case ADD_INDICATOR_SUCCESS:
        return { ...state, loading: false, status: 'success', fieldErrors: {} };
  
      case ADD_INDICATOR_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case UPDATE_INDICATOR:
        return { ...state, loading: true };
  
      case UPDATE_INDICATOR_SUCCESS:
        return { ...state, loading: false, fieldErrors: {} };
  
      case UPDATE_INDICATOR_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case DELETE_INDICATOR:
        return { ...state, loading: true };
  
      case DELETE_INDICATOR_SUCCESS:
        return { ...state, loading: false };
  
      case DELETE_INDICATOR_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case SET_INDICATOR_FIELD_ERRORS:
        return { ...state, fieldErrors: action.payload ,loading:false};
  
      default:
        return state;
    }
  };
  
  export default indicatorReducer;
  