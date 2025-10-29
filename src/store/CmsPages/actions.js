import {
    GET_CMS_PAGES,
    GET_CMS_PAGES_SUCCESS,
    GET_CMS_PAGES_FAIL,
  } from './actionTypes';
  
  // Get CMS Pages
  export const getCmsPages = (params) => ({
    type: GET_CMS_PAGES,
    payload: params,
  });
  
  export const getCmsPagesSuccess = (pages) => ({
    type: GET_CMS_PAGES_SUCCESS,
    payload: pages,
  });
  
  export const getCmsPagesFail = (error) => ({
    type: GET_CMS_PAGES_FAIL,
    payload: error,
  });
  