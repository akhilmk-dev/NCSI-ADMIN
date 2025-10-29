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
  
  const initialState = {
    organizationCharts: [],
    loading: false,
    error: null,
    fieldErrors: {},
  };
  
  const organizationChartReducer = (state = initialState, action) => {
    switch (action.type) {
      // GET Organization Chart
      case GET_ORGANIZATION_CHART:
        return { ...state, loading: true };
  
      case GET_ORGANIZATION_CHART_SUCCESS:
        return { ...state, loading: false, organizationCharts: action.payload };
  
      case GET_ORGANIZATION_CHART_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // ADD Organization Chart
      case ADD_ORGANIZATION_CHART:
        return { ...state, loading: true };
  
      case ADD_ORGANIZATION_CHART_SUCCESS:
        return { ...state, loading: false, fieldErrors: {} };
  
      case ADD_ORGANIZATION_CHART_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // UPDATE Organization Chart
      case UPDATE_ORGANIZATION_CHART:
        return { ...state, loading: true };
  
      case UPDATE_ORGANIZATION_CHART_SUCCESS:
        return { ...state, loading: false, fieldErrors: {} };
  
      case UPDATE_ORGANIZATION_CHART_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // DELETE Organization Chart
      case DELETE_ORGANIZATION_CHART:
        return { ...state, loading: true };
  
      case DELETE_ORGANIZATION_CHART_SUCCESS:
        return { ...state, loading: false };
  
      case DELETE_ORGANIZATION_CHART_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // FIELD ERRORS
      case SET_ORGANIZATION_CHART_FIELD_ERRORS:
        return { ...state, fieldErrors: action.payload, loading: false };
  
      // Default
      default:
        return state;
    }
  };
  
  export default organizationChartReducer;
  