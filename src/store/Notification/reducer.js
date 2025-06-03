import {
  GET_NOTIFICATIONS,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAIL,
} from './actionTypes'

const initialState = {
  notifications: [],
  loading: false,
  error: null,
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTIFICATIONS:
      return { ...state, loading: true }

    case GET_NOTIFICATIONS_SUCCESS:
      return { ...state, loading: false, notifications: action.payload }

    case GET_NOTIFICATIONS_FAIL:
      return { ...state, loading: false, error: action.payload }

    default:
      return state
  }
}

export default notificationReducer
