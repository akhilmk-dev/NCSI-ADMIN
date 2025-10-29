import {
    GET_ACHIEVEMENTS,
    GET_ACHIEVEMENTS_SUCCESS,
    GET_ACHIEVEMENTS_FAIL,
    ADD_ACHIEVEMENT,
    ADD_ACHIEVEMENT_SUCCESS,
    ADD_ACHIEVEMENT_FAIL,
    UPDATE_ACHIEVEMENT,
    UPDATE_ACHIEVEMENT_SUCCESS,
    UPDATE_ACHIEVEMENT_FAIL,
    DELETE_ACHIEVEMENT,
    DELETE_ACHIEVEMENT_SUCCESS,
    DELETE_ACHIEVEMENT_FAIL,
    SET_ACHIEVEMENT_FIELD_ERRORS,
  } from "./actionTypes";
  
  // Get Achievements
  export const getAchievements = (params) => ({
    type: GET_ACHIEVEMENTS,
    payload: params,
  });
  
  export const getAchievementsSuccess = (achievements) => ({
    type: GET_ACHIEVEMENTS_SUCCESS,
    payload: achievements,
  });
  
  export const getAchievementsFail = (error) => ({
    type: GET_ACHIEVEMENTS_FAIL,
    payload: error,
  });
  
  // Add Achievement
  export const addAchievement = (achievement, resetForm, handleClose) => ({
    type: ADD_ACHIEVEMENT,
    payload: { achievement, resetForm, handleClose },
  });
  
  export const addAchievementSuccess = (achievement) => ({
    type: ADD_ACHIEVEMENT_SUCCESS,
    payload: achievement,
  });
  
  export const addAchievementFail = (error) => ({
    type: ADD_ACHIEVEMENT_FAIL,
    payload: error,
  });
  
  // Update Achievement
  export const updateAchievement = (achievement, id, resetForm, handleClose) => ({
    type: UPDATE_ACHIEVEMENT,
    payload: { achievement, id, resetForm, handleClose },
  });
  
  export const updateAchievementSuccess = (achievement) => ({
    type: UPDATE_ACHIEVEMENT_SUCCESS,
    payload: achievement,
  });
  
  export const updateAchievementFail = (error) => ({
    type: UPDATE_ACHIEVEMENT_FAIL,
    payload: error,
  });
  
  // Delete Achievement
  export const deleteAchievement = (id) => ({
    type: DELETE_ACHIEVEMENT,
    payload: id,
  });
  
  export const deleteAchievementSuccess = (id) => ({
    type: DELETE_ACHIEVEMENT_SUCCESS,
    payload: id,
  });
  
  export const deleteAchievementFail = (error) => ({
    type: DELETE_ACHIEVEMENT_FAIL,
    payload: error,
  });
  
  // Set Field Errors
  export const setAchievementFieldErrors = (errors) => ({
    type: SET_ACHIEVEMENT_FIELD_ERRORS,
    payload: errors,
  });
  