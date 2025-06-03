// saga.js
import { call, put, takeLatest } from 'redux-saga/effects'

import {
  FETCH_USERS_REQUEST,
  ADD_USER_REQUEST,
  UPDATE_USER_REQUEST,
  DELETE_USER_REQUEST,
} from './actionTypes'
import {
  fetchUsersSuccess,
  fetchUsersFailure,
  addUserSuccess,
  addUserFailure,
  updateUserSuccess,
  updateUserFailure,
  deleteUserSuccess,
  deleteUserFailure,
} from './actions'
import axiosInstance from 'pages/Utility/axiosInstance'
import toast from 'react-hot-toast'

// API calls
const fetchUsersApi = async () => {
  return await axiosInstance.get('', { params: { sp: "usp_GetUser" } })
}

const addUserApi = async (user) => {
  return await axiosInstance.post('', user)
}

const updateUserApi = async (user) => {
  return await axiosInstance.post(``, user)
}

const deleteUserApi = async (userId) => {
  return await axiosInstance.post(``, {
    "sp": "usp_DeleteUser",
    "userId": userId

  })
}

// Fetch users
function* fetchUsersSaga() {
  try {
    const response = yield call(fetchUsersApi)
    yield put(fetchUsersSuccess(response.data))
  } catch (error) {
    yield put(fetchUsersFailure(error.message))
  }
}

// Add user
function* addUserSaga(action) {
  try {
    const response = yield call(addUserApi, action.payload.user);
    action.payload.onClose();
    yield put(addUserSuccess(response.data))
    toast.success('User added successfully!')
    yield put({ type: FETCH_USERS_REQUEST })
  } catch (error) {
    yield put(addUserFailure(error.message))
  }
}

// Update user
function* updateUserSaga(action) {
  try {
    const response = yield call(updateUserApi, action.payload.user)
    action.payload.onClose();
    yield put(updateUserSuccess(response.data))
    toast.success('User updated successfully!')
    yield put({ type: FETCH_USERS_REQUEST })
  } catch (error) {
    yield put(updateUserFailure(error.message))
  }
}

// Delete user
function* deleteUserSaga(action) {
  try {
    yield call(deleteUserApi, action.payload)
    yield put(deleteUserSuccess(action.payload))
    toast.success('User Deleted successfully!')
    yield put({ type: FETCH_USERS_REQUEST })
  } catch (error) {
    yield put(deleteUserFailure(error.message))
  }
}

// Watcher saga
export default function* userSaga() {
  yield takeLatest(FETCH_USERS_REQUEST, fetchUsersSaga)
  yield takeLatest(ADD_USER_REQUEST, addUserSaga)
  yield takeLatest(UPDATE_USER_REQUEST, updateUserSaga)
  yield takeLatest(DELETE_USER_REQUEST, deleteUserSaga)
}
