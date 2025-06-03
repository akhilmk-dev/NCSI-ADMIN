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

const initialState = {
  settings: [],
  loading: false,
  error: null,
  status: null,
  fieldErrors: {}, // Store field-specific errors
}

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SETTINGS:
      return { ...state, loading: true }
    case GET_SETTINGS_SUCCESS:
      return { ...state, loading: false, settings: action.payload }
    case GET_SETTINGS_FAIL:
      return { ...state, loading: false, error: action.payload }

    case UPDATE_SETTINGS:
      return { ...state, loading: true }
    case UPDATE_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        settings: action.payload,
        fieldErrors: {}, // Clear field errors on success
      }
    case UPDATE_SETTINGS_FAIL:
      return { ...state, loading: false, error: action.payload }

    case DELETE_SETTINGS:
      return { ...state, loading: true }
    case DELETE_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        settings: state.settings.filter(setting => setting.id !== action.payload), // Remove the deleted setting from the state
      }
    case DELETE_SETTINGS_FAIL:
      return { ...state, loading: false, error: action.payload }

    case SET_SETTINGS_FIELD_ERRORS:
      return { ...state, fieldErrors: action.payload }

    default:
      return state
  }
}

export default settingsReducer
