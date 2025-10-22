import {
    GET_FEEDBACKS,
    GET_FEEDBACKS_SUCCESS,
    GET_FEEDBACKS_FAIL,
    DELETE_FEEDBACK,
    DELETE_FEEDBACK_SUCCESS,
    DELETE_FEEDBACK_FAIL,
  } from './actionTypes';
  
  const initialState = {
    feedbacks: [],
    loading: false,
    error: null,
    status: null,
  };
  
  const feedbackReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_FEEDBACKS:
        return { ...state, loading: true };
  
      case GET_FEEDBACKS_SUCCESS:
        return { ...state, loading: false ,feedbacks:action.payload};
  
      case GET_FEEDBACKS_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case DELETE_FEEDBACK:
        return { ...state, loading: true };
  
      case DELETE_FEEDBACK_SUCCESS:
        return {
          ...state,
          loading: false,
          feedbacks: {
            ...state.feedbacks,
          },
        };
  
      case DELETE_FEEDBACK_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  
  export default feedbackReducer;
  