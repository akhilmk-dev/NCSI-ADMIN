import {
    GET_CMS_PAGES,
    GET_CMS_PAGES_SUCCESS,
    GET_CMS_PAGES_FAIL,
  } from './actionTypes';
  
  const initialState = {
    cmsPages: [],
    loading: false,
    error: null,
  };
  
  const cmsPageReducer = (state = initialState, action) => {
    switch (action.type) {
      // Get CMS Pages
      case GET_CMS_PAGES:
        return { ...state, loading: true };
  
      case GET_CMS_PAGES_SUCCESS:
        return { ...state, loading: false, cmsPages: action.payload };
  
      case GET_CMS_PAGES_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // Default
      default:
        return state;
    }
  };
  
  export default cmsPageReducer;
  