import {
    GET_SURVEYS,
    GET_SURVEYS_SUCCESS,
    GET_SURVEYS_FAIL,
    DELETE_SURVEY,
    DELETE_SURVEY_SUCCESS,
    DELETE_SURVEY_FAIL,
    SET_SURVEY_FIELD_ERRORS,
  } from './actionTypes';
  
  const initialState = {
    surveys: [],
    loading: false,
    error: null,
    fieldErrors: {},
  };
  
  const surveyReducer = (state = initialState, action) => {
    switch (action.type) {
      // Get Surveys
      case GET_SURVEYS:
        return { ...state, loading: true };
      case GET_SURVEYS_SUCCESS:
        return { ...state, loading: false, surveys: action.payload };
      case GET_SURVEYS_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // Delete Survey
      case DELETE_SURVEY:
        return { ...state, loading: true };
      case DELETE_SURVEY_SUCCESS:
        return { ...state, loading: false };
      case DELETE_SURVEY_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // Field errors (if needed)
      case SET_SURVEY_FIELD_ERRORS:
        return { ...state, fieldErrors: action.payload,loading:false };
  
      default:
        return state;
    }
  };
  
  export default surveyReducer;
  