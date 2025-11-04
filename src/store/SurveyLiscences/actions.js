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
  
  // Get Survey Licenses
  export const getSurveyLicenses = (filters) => ({
    type: GET_SURVEY_LICENSES,
    payload: filters,
  });
  
  export const getSurveyLicensesSuccess = (licenses) => ({
    type: GET_SURVEY_LICENSES_SUCCESS,
    payload: licenses,
  });
  
  export const getSurveyLicensesFail = (error) => ({
    type: GET_SURVEY_LICENSES_FAIL,
    payload: error,
  });
  
  // Add Survey License
  export const addSurveyLicense = (license, resetForm, handleClose) => ({
    type: ADD_SURVEY_LICENSE,
    payload: { license, resetForm, handleClose },
  });
  
  export const addSurveyLicenseSuccess = (license) => ({
    type: ADD_SURVEY_LICENSE_SUCCESS,
    payload: license,
  });
  
  export const addSurveyLicenseFail = (error) => ({
    type: ADD_SURVEY_LICENSE_FAIL,
    payload: error,
  });
  
  // Update Survey License
  export const updateSurveyLicense = (license, id, resetForm, handleClose) => ({
    type: UPDATE_SURVEY_LICENSE,
    payload: { license, id, resetForm, handleClose },
  });
  
  export const updateSurveyLicenseSuccess = (license) => ({
    type: UPDATE_SURVEY_LICENSE_SUCCESS,
    payload: license,
  });
  
  export const updateSurveyLicenseFail = (error) => ({
    type: UPDATE_SURVEY_LICENSE_FAIL,
    payload: error,
  });
  
  // Delete Survey License
  export const deleteSurveyLicense = (id) => ({
    type: DELETE_SURVEY_LICENSE,
    payload: id,
  });
  
  export const deleteSurveyLicenseSuccess = (id) => ({
    type: DELETE_SURVEY_LICENSE_SUCCESS,
    payload: id,
  });
  
  export const deleteSurveyLicenseFail = (error) => ({
    type: DELETE_SURVEY_LICENSE_FAIL,
    payload: error,
  });
  
  // Set Field Errors
  export const setSurveyLicenseFieldErrors = (errors) => ({
    type: SET_SURVEY_LICENSE_FIELD_ERRORS,
    payload: errors,
  });
  