import { GET_EVENTS_FAIL } from "store/Events/actionTypes";
import { GET_NEWS, GET_NEWS_SUCCESS } from "./actionTypes";





//GET NEWS
export const getNews=(news)=>({type:GET_NEWS,payload:news})
export const getNewsSuccess=(news)=>({type:GET_NEWS_SUCCESS,payload:news})
export const getNewsFail=(error)=>({type:GET_EVENTS_FAIL,payload:error})