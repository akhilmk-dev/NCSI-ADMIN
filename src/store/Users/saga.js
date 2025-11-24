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
import { showSuccess } from 'helpers/notification_helper'

// API calls
const fetchUsersApi = async (data) => {
  return await axiosInstance.post('V1/users/list',data)
}

const addUserApi = async (user) => {
  return await axiosInstance.post('V1/users', user)
}

const updateUserApi = async ({id,user}) => {
  return await axiosInstance.post(`V1/user/update/${id}`, user)
}

const deleteUserApi = async (userId) => {
  return await axiosInstance.post(`V1/user/${userId}`)
}

// Fetch users
function* fetchUsersSaga(action) {
  try {
    const response = yield call(fetchUsersApi,action.payload)
    yield put(fetchUsersSuccess(response.data?.data))
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
    showSuccess('User added successfully!')
    yield put({ type: FETCH_USERS_REQUEST })
  } catch (error) {
    yield put(addUserFailure(error?.response?.data?.errors))
  }
}

// Update user
function* updateUserSaga(action) {
  try {
    const response = yield call(updateUserApi, action.payload)
    console.log(action.payload)
    showSuccess(response?.data?.message)
    action.payload.onClose();
    yield put(updateUserSuccess(response))
    yield put({ type: FETCH_USERS_REQUEST })
  } catch (error) {
    yield put(updateUserFailure(error?.response?.data?.errors))
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
