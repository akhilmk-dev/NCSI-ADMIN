import {
    GET_ORGANIZATION_CHART,
    GET_ORGANIZATION_CHART_SUCCESS,
    GET_ORGANIZATION_CHART_FAIL,
    ADD_ORGANIZATION_CHART,
    ADD_ORGANIZATION_CHART_SUCCESS,
    ADD_ORGANIZATION_CHART_FAIL,
    UPDATE_ORGANIZATION_CHART,
    UPDATE_ORGANIZATION_CHART_SUCCESS,
    UPDATE_ORGANIZATION_CHART_FAIL,
    DELETE_ORGANIZATION_CHART,
    DELETE_ORGANIZATION_CHART_SUCCESS,
    DELETE_ORGANIZATION_CHART_FAIL,
    SET_ORGANIZATION_CHART_FIELD_ERRORS,
  } from './actionTypes';
  
  // GET Organization Chart
  export const getOrganizationChart = (payload) => ({
    type: GET_ORGANIZATION_CHART,
    payload,
  });
  
  export const getOrganizationChartSuccess = (data) => ({
    type: GET_ORGANIZATION_CHART_SUCCESS,
    payload: data,
  });
  
  export const getOrganizationChartFail = (error) => ({
    type: GET_ORGANIZATION_CHART_FAIL,
    payload: error,
  });
  
  // ADD Organization Chart
  export const addOrganizationChart = (chart, resetForm, handleClose) => ({
    type: ADD_ORGANIZATION_CHART,
    payload: { chart, resetForm, handleClose },
  });
  
  export const addOrganizationChartSuccess = (data) => ({
    type: ADD_ORGANIZATION_CHART_SUCCESS,
    payload: data,
  });
  
  export const addOrganizationChartFail = (error) => ({
    type: ADD_ORGANIZATION_CHART_FAIL,
    payload: error,
  });
  
  // UPDATE Organization Chart
  export const updateOrganizationChart = (chart, id, resetForm, handleClose) => ({
    type: UPDATE_ORGANIZATION_CHART,
    payload: { chart, id, resetForm, handleClose },
  });
  
  export const updateOrganizationChartSuccess = (data) => ({
    type: UPDATE_ORGANIZATION_CHART_SUCCESS,
    payload: data,
  });
  
  export const updateOrganizationChartFail = (error) => ({
    type: UPDATE_ORGANIZATION_CHART_FAIL,
    payload: error,
  });
  
  // DELETE Organization Chart
  export const deleteOrganizationChart = (id) => ({
    type: DELETE_ORGANIZATION_CHART,
    payload: id,
  });
  
  export const deleteOrganizationChartSuccess = (id) => ({
    type: DELETE_ORGANIZATION_CHART_SUCCESS,
    payload: id,
  });
  
  export const deleteOrganizationChartFail = (error) => ({
    type: DELETE_ORGANIZATION_CHART_FAIL,
    payload: error,
  });
  
  // SET Field Errors
  export const setOrganizationChartFieldErrors = (errors) => ({
    type: SET_ORGANIZATION_CHART_FIELD_ERRORS,
    payload: errors,
  });
  