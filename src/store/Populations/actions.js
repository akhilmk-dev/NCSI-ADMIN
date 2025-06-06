// Action Types
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
  } from './actionTypes';
  
  // Get Population List
  export const getPopulation = (data) => ({
    type: GET_POPULATION,
    payload:data
  });
  
  export const getPopulationSuccess = (population) => ({
    type: GET_POPULATION_SUCCESS,
    payload: population,
  });
  
  export const getPopulationFail = (error) => ({
    type: GET_POPULATION_FAIL,
    payload: error,
  });
  
  // Add Population Record
  export const addPopulation = (data,resetForm,handleClose) => ({
    type: ADD_POPULATION,
    payload: {data,resetForm,handleClose},
  });
  
  export const addPopulationSuccess = (data) => ({
    type: ADD_POPULATION_SUCCESS,
    payload: data,
  });
  
  export const addPopulationFail = (error) => ({
    type: ADD_POPULATION_FAIL,
    payload: error,
  });
  
  // Update Population Record
  export const updatePopulation = (data,id,resetForm,handleClose) => ({
    type: UPDATE_POPULATION,
    payload: {data,id,resetForm,handleClose},
  });
  
  export const updatePopulationSuccess = (data) => ({
    type: UPDATE_POPULATION_SUCCESS,
    payload: data,
  });
  
  export const updatePopulationFail = (error) => ({
    type: UPDATE_POPULATION_FAIL,
    payload: error,
  });
  
  // Delete Population Record
  export const deletePopulation = (id) => ({
    type: DELETE_POPULATION,
    payload: id,
  });
  
  export const deletePopulationSuccess = (id) => ({
    type: DELETE_POPULATION_SUCCESS,
    payload: id,
  });
  
  export const deletePopulationFail = (error) => ({
    type: DELETE_POPULATION_FAIL,
    payload: error,
  });
  
  // Set Field Errors
  export const setPopulationFieldErrors = (errors) => ({
    type: SET_POPULATION_FIELD_ERRORS,
    payload: errors,
  });
  