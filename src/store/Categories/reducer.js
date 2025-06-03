import {
  GET_CATEGORIES,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAIL,
  ADD_CATEGORIES,
  ADD_CATEGORIES_SUCCESS,
  ADD_CATEGORIES_FAIL,
  UPDATE_CATEGORIES,
  UPDATE_CATEGORIES_SUCCESS,
  UPDATE_CATEGORIES_FAIL,
  DELETE_CATEGORIES,
  DELETE_CATEGORIES_SUCCESS,
  DELETE_CATEGORIES_FAIL,
  SET_CATEGORY_FIELD_ERRORS,
} from './actionTypes'

const initialState = {
  categories: [],
  loading: false,
  error: null,
  status: null,
  fieldErrors: {}, // Store field-specific errors
}

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES:
      return { ...state, loading: true }
    case GET_CATEGORIES_SUCCESS:
      return { ...state, loading: false, categories: action.payload }
    case GET_CATEGORIES_FAIL:
      return { ...state, loading: false, error: action.payload }

    case ADD_CATEGORIES:
      return { ...state, loading: true }
    case ADD_CATEGORIES_SUCCESS:
      return { ...state, loading: false, status: 'success', fieldErrors: {} }
    case ADD_CATEGORIES_FAIL:
      return { ...state, loading: false, error: action.payload }

    case UPDATE_CATEGORIES:
      return { ...state, loading: true }
    case UPDATE_CATEGORIES_SUCCESS:
      return { ...state, loading: false, fieldErrors: {} }
    case UPDATE_CATEGORIES_FAIL:
      return { ...state, loading: false, error: action.payload }

    case DELETE_CATEGORIES:
      return { ...state, loading: true }
    case DELETE_CATEGORIES_SUCCESS:
      return { ...state, loading: false }
    case DELETE_CATEGORIES_FAIL:
      return { ...state, loading: false, error: action.payload }

    case SET_CATEGORY_FIELD_ERRORS:
      return { ...state, fieldErrors: action.payload }

    default:
      return state
  }
}

export default categoryReducer
