import {
  GET_NOTIFICATIONS,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAIL,
} from './actionTypes'

// Get Notifications
export const getNotifications = (id) => ({
  type: GET_NOTIFICATIONS,
  payload: id
})

export const getNotificationsSuccess = (notifications) => ({
  type: GET_NOTIFICATIONS_SUCCESS,
  payload: notifications,
})

export const getNotificationsFail = (error) => ({
  type: GET_NOTIFICATIONS_FAIL,
  payload: error,
})
