import {
    GET_EVENTS,
    GET_EVENTS_SUCCESS,
    GET_EVENTS_FAIL,
    ADD_EVENT,
    ADD_EVENT_SUCCESS,
    ADD_EVENT_FAIL,
    UPDATE_EVENT,
    UPDATE_EVENT_SUCCESS,
    UPDATE_EVENT_FAIL,
    DELETE_EVENT,
    DELETE_EVENT_SUCCESS,
    DELETE_EVENT_FAIL,
    SET_EVENT_FIELD_ERRORS,
  } from './actionTypes'
  
  // Get Events
  export const getEvents = (event) => ({ type: GET_EVENTS ,payload:event})
  export const getEventsSuccess = (events) => ({ type: GET_EVENTS_SUCCESS, payload: events })
  export const getEventsFail = (error) => ({ type: GET_EVENTS_FAIL, payload: error })
  
  // Add Event
  export const addEvent = (event,resetForm,handleClose) => ({ type: ADD_EVENT, payload: {data:event,resetForm:resetForm,handleClose:handleClose}})
  export const addEventSuccess = (event) => ({ type: ADD_EVENT_SUCCESS, payload: event })
  export const addEventFail = (error) => ({ type: ADD_EVENT_FAIL, payload: error })
  
  // Update Event
  export const updateEvent = (event,id,resetForm,handleClose) => ({ type: UPDATE_EVENT, payload: {data:event,id:id,resetForm:resetForm,handleClose:handleClose} })
  export const updateEventSuccess = (event) => ({ type: UPDATE_EVENT_SUCCESS, payload: event })
  export const updateEventFail = (error) => ({ type: UPDATE_EVENT_FAIL, payload: error })
  
  // Delete Event
  export const deleteEvent = (id) => ({ type: DELETE_EVENT, payload: id })
  export const deleteEventSuccess = (id) => ({ type: DELETE_EVENT_SUCCESS, payload: id })
  export const deleteEventFail = (error) => ({ type: DELETE_EVENT_FAIL, payload: error })
  
  // Set Field Errors
  export const setEventFieldErrors = (errors) => ({ type: SET_EVENT_FIELD_ERRORS, payload: errors })
  