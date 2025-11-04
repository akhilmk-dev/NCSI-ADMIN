import {
    GET_SURVEY_LICENSES,
    GET_SURVEY_LICENSES_SUCCESS,
    GET_SURVEY_LICENSES_FAIL,
    ADD_SURVEY_LICENSE,
    ADD_SURVEY_LICENSE_SUCCESS,
    ADD_SURVEY_LICENSE_FAIL,
    UPDATE_SURVEY_LICENSE,
    UPDATE_SURVEY_LICENSE_SUCCESS,
    UPDATE_SURVEY_LICENSE_FAIL,
    DELETE_SURVEY_LICENSE,
    DELETE_SURVEY_LICENSE_SUCCESS,
    DELETE_SURVEY_LICENSE_FAIL,
    SET_SURVEY_LICENSE_FIELD_ERRORS,
  } from "./actionTypes";
  
  const initialState = {
    licenses: [],
    loading: false,
    error: null,
    fieldErrors: {},
  };
  
  const surveyLicenseReducer = (state = initialState, action) => {
    switch (action.type) {
      // Get Survey Licenses
      case GET_SURVEY_LICENSES:
        return { ...state, loading: true };
      case GET_SURVEY_LICENSES_SUCCESS:
        return { ...state, loading: false, licenses: action.payload };
      case GET_SURVEY_LICENSES_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // Add Survey License
      case ADD_SURVEY_LICENSE:
        return { ...state, loading: true };
      case ADD_SURVEY_LICENSE_SUCCESS:
        return { ...state, loading: false, fieldErrors: {} };
      case ADD_SURVEY_LICENSE_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // Update Survey License
      case UPDATE_SURVEY_LICENSE:
        return { ...state, loading: true };
      case UPDATE_SURVEY_LICENSE_SUCCESS:
        return { ...state, loading: false, fieldErrors: {} };
      case UPDATE_SURVEY_LICENSE_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // Delete Survey License
      case DELETE_SURVEY_LICENSE:
        return { ...state, loading: true };
      case DELETE_SURVEY_LICENSE_SUCCESS:
        return { ...state, loading: false };
      case DELETE_SURVEY_LICENSE_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // Field Errors
      case SET_SURVEY_LICENSE_FIELD_ERRORS:
        return { ...state, fieldErrors: action.payload, loading: false };
  
      default:
        return state;
    }
  };
  
  export default surveyLicenseReducer;
  