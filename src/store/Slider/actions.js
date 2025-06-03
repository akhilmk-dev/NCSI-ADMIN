// actionTypes.js (import these in your reducers/middleware as needed)
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
  
  // Get Sliders
  export const getSliders = () => ({ type: GET_SLIDERS });
  export const getSlidersSuccess = (sliders) => ({
    type: GET_SLIDERS_SUCCESS,
    payload: sliders,
  });
  export const getSlidersFail = (error) => ({
    type: GET_SLIDERS_FAIL,
    payload: error,
  });
  
  // Add Slider
  export const addSlider = (sliderData) => ({
    type: ADD_SLIDER,
    payload: sliderData,
  });
  export const addSliderSuccess = (slider) => ({
    type: ADD_SLIDER_SUCCESS,
    payload: slider,
  });
  export const addSliderFail = (error) => ({
    type: ADD_SLIDER_FAIL,
    payload: error,
  });
  
  // Update Slider
  export const updateSlider = (sliderData) => ({
    type: UPDATE_SLIDER,
    payload: sliderData,
  });
  export const updateSliderSuccess = (slider) => ({
    type: UPDATE_SLIDER_SUCCESS,
    payload: slider,
  });
  export const updateSliderFail = (error) => ({
    type: UPDATE_SLIDER_FAIL,
    payload: error,
  });
  
  // Delete Slider
  export const deleteSlider = (id) => ({
    type: DELETE_SLIDER,
    payload: id,
  });
  export const deleteSliderSuccess = (id) => ({
    type: DELETE_SLIDER_SUCCESS,
    payload: id,
  });
  export const deleteSliderFail = (error) => ({
    type: DELETE_SLIDER_FAIL,
    payload: error,
  });
  
  // Set Field Errors
  export const setSliderFieldErrors = (errors) => ({
    type: SET_SLIDER_FIELD_ERRORS,
    payload: errors,
  });
  