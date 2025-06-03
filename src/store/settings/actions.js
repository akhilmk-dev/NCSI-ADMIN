import {
  GET_SETTINGS,
  GET_SETTINGS_SUCCESS,
  GET_SETTINGS_FAIL,
  UPDATE_SETTINGS,
  UPDATE_SETTINGS_SUCCESS,
  UPDATE_SETTINGS_FAIL,
  DELETE_SETTINGS,
  DELETE_SETTINGS_SUCCESS,
  DELETE_SETTINGS_FAIL,
  SET_SETTINGS_FIELD_ERRORS,
} from './actionTypes'

// Get Settings
export const getSettings = () => ({
  type: GET_SETTINGS,
})

export const getSettingsSuccess = (settings) => ({
  type: GET_SETTINGS_SUCCESS,
  payload: settings,
})

export const getSettingsFail = (error) => ({
  type: GET_SETTINGS_FAIL,
  payload: error,
})

// Update Settings
export const updateSettings = (settings) => ({
  type: UPDATE_SETTINGS,
  payload: settings,
})

export const updateSettingsSuccess = (settings) => ({
  type: UPDATE_SETTINGS_SUCCESS,
  payload: settings,
})

export const updateSettingsFail = (error) => ({
  type: UPDATE_SETTINGS_FAIL,
  payload: error,
})

// Delete Settings
export const deleteSettings = (id) => ({
  type: DELETE_SETTINGS,
  payload: id,
})

export const deleteSettingsSuccess = (id) => ({
  type: DELETE_SETTINGS_SUCCESS,
  payload: id,
})

export const deleteSettingsFail = (error) => ({
  type: DELETE_SETTINGS_FAIL,
  payload: error,
})

// Set Field Errors
export const setSettingsFieldErrors = (errors) => ({
  type: SET_SETTINGS_FIELD_ERRORS,
  payload: errors,
})
