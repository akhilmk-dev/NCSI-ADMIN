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
  
  const initialState = {
    achievements: [],
    loading: false,
    error: null,
    fieldErrors: {},
  };
  
  const achievementReducer = (state = initialState, action) => {
    switch (action.type) {
      // Get Achievements
      case GET_ACHIEVEMENTS:
        return { ...state, loading: true };
      case GET_ACHIEVEMENTS_SUCCESS:
        return { ...state, loading: false, achievements: action.payload };
      case GET_ACHIEVEMENTS_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // Add Achievement
      case ADD_ACHIEVEMENT:
        return { ...state, loading: true };
      case ADD_ACHIEVEMENT_SUCCESS:
        return { ...state, loading: false, fieldErrors: {} };
      case ADD_ACHIEVEMENT_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // Update Achievement
      case UPDATE_ACHIEVEMENT:
        return { ...state, loading: true };
      case UPDATE_ACHIEVEMENT_SUCCESS:
        return { ...state, loading: false, fieldErrors: {} };
      case UPDATE_ACHIEVEMENT_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // Delete Achievement
      case DELETE_ACHIEVEMENT:
        return { ...state, loading: true };
      case DELETE_ACHIEVEMENT_SUCCESS:
        return { ...state, loading: false };
      case DELETE_ACHIEVEMENT_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // Field Errors
      case SET_ACHIEVEMENT_FIELD_ERRORS:
        return { ...state, fieldErrors: action.payload, loading: false };
  
      default:
        return state;
    }
  };
  
  export default achievementReducer;
  