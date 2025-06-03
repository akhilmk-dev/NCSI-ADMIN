import {
    GET_POPULATION,
    GET_POPULATION_SUCCESS,
    GET_POPULATION_FAIL,
    ADD_POPULATION,
    ADD_POPULATION_SUCCESS,
    ADD_POPULATION_FAIL,
    UPDATE_POPULATION,
    UPDATE_POPULATION_SUCCESS,
    UPDATE_POPULATION_FAIL,
    DELETE_POPULATION,
    DELETE_POPULATION_SUCCESS,
    DELETE_POPULATION_FAIL,
    SET_POPULATION_FIELD_ERRORS,
  } from "./actionTypes";
  
  const initialState = {
    populationList: [],
    loading: false,
    error: null,
    fieldErrors: {},
  };
  
  const populationReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_POPULATION:
        return { ...state, loading: true };
  
      case GET_POPULATION_SUCCESS:
        return { ...state, loading: false, populationList: action.payload };
  
      case GET_POPULATION_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case ADD_POPULATION:
        return { ...state, loading: true };
  
      case ADD_POPULATION_SUCCESS:
        return { ...state, loading: false, fieldErrors: {} };
  
      case ADD_POPULATION_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case UPDATE_POPULATION:
        return { ...state, loading: true };
  
      case UPDATE_POPULATION_SUCCESS:
        return { ...state, loading: false, fieldErrors: {} };
  
      case UPDATE_POPULATION_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case DELETE_POPULATION:
        return { ...state, loading: true };
  
      case DELETE_POPULATION_SUCCESS:
        return { ...state, loading: false };
  
      case DELETE_POPULATION_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case SET_POPULATION_FIELD_ERRORS:
        return { ...state, fieldErrors: action.payload };
  
      default:
        return state;
    }
  };
  
  export default populationReducer;
  