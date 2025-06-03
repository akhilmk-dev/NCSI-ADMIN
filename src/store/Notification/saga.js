import { call, put, takeEvery } from 'redux-saga/effects'
import {
  GET_NOTIFICATIONS,
} from './actionTypes'
import {
  getNotificationsSuccess,
  getNotificationsFail,
} from './actions'
import axiosInstance from 'pages/Utility/axiosInstance' // Replace with actual axios instance
import toast from 'react-hot-toast'

// API call
const fetchNotificationsApi = (userId) => axiosInstance.get('', { params: { sp: "usp_GetNotifications", toUserId: userId } })

// Saga for fetching notifications
function* getNotificationsSaga(action) {
  try {
    const { data } = yield call(fetchNotificationsApi, action.payload)
    yield put(getNotificationsSuccess(data))
  } catch (error) {
    yield put(getNotificationsFail(error.response?.data || error.message))
  }
}

// Watcher Saga
function* notificationSaga() {
  yield takeEvery(GET_NOTIFICATIONS, getNotificationsSaga)
}

export default notificationSaga
