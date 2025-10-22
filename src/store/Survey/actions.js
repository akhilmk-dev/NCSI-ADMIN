import {
    GET_SURVEYS,
    GET_SURVEYS_SUCCESS,
    GET_SURVEYS_FAIL,
    DELETE_SURVEY,
    DELETE_SURVEY_SUCCESS,
    DELETE_SURVEY_FAIL,
    SET_SURVEY_FIELD_ERRORS,
  } from './actionTypes';
  
  // Get Surveys
  export const getSurveys = (params) => ({
    type: GET_SURVEYS,
    payload: params,
  });
  
  export const getSurveysSuccess = (surveys) => ({
    type: GET_SURVEYS_SUCCESS,
    payload: surveys,
  });
  
  export const getSurveysFail = (error) => ({
    type: GET_SURVEYS_FAIL,
    payload: error,
  });
  
  // Delete Survey
  export const deleteSurvey = (id) => ({
    type: DELETE_SURVEY,
    payload: id,
  });
  
  export const deleteSurveySuccess = (id) => ({
    type: DELETE_SURVEY_SUCCESS,
    payload: id,
  });
  
  export const deleteSurveyFail = (error) => ({
    type: DELETE_SURVEY_FAIL,
    payload: error,
  });
  
  // Set Field Errors
  export const setSurveyFieldErrors = (errors) => ({
    type: SET_SURVEY_FIELD_ERRORS,
    payload: errors,
  });
  