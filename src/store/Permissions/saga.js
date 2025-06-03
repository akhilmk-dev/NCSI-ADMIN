// saga.js

import { call, put, takeEvery } from 'redux-saga/effects'
import {
  GET_PERMISSIONS,
  ADD_PERMISSION,
  UPDATE_PERMISSION,
  DELETE_PERMISSION,
} from './actionTypes'
import {
  getPermissionsSuccess,
  getPermissionsFail,
  addPermissionSuccess,
  addPermissionFail,
  updatePermissionSuccess,
  updatePermissionFail,
  deletePermissionSuccess,
  deletePermissionFail,
  setPermissionFieldErrors,
} from './actions'
import axiosInstance from 'pages/Utility/axiosInstance' // Adjust the import path to your axios instance
import toast from 'react-hot-toast'

// API calls
const fetchPermissionsApi = () => axiosInstance.get('', { params: { sp: 'usp_GetPermission' } })
const addPermissionApi = (permission) => axiosInstance.post('', permission)
const updatePermissionApi = (permission) => axiosInstance.post('', permission)
const deletePermissionApi = (id) => axiosInstance.post('', { sp: 'usp_DeletePermission', permissionId: id })

// Sagas
function* getPermissionsSaga() {
  try {
    const { data } = yield call(fetchPermissionsApi)
    yield put(getPermissionsSuccess(data))
  } catch (error) {
    yield put(getPermissionsFail(error.response?.data || error.message))
  }
}

function* addPermissionSaga(action) {
  try {
    const { data } = yield call(addPermissionApi, action.payload)
    yield put(addPermissionSuccess(data))
    toast.success('Permission added successfully!')
    yield put({ type: GET_PERMISSIONS })
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
      yield put(setPermissionFieldErrors(error.response.data.fieldErrors))
    } else {
      yield put(addPermissionFail(error.response?.data || error.message))
    }
  }
}

function* updatePermissionSaga(action) {
  try {
    const { data } = yield call(updatePermissionApi, action.payload)
    yield put(updatePermissionSuccess(data))
    toast.success('Permission updated successfully!')
    yield put({ type: GET_PERMISSIONS })
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
      yield put(setPermissionFieldErrors(error.response.data.fieldErrors))
    } else {
      yield put(updatePermissionFail(error.response?.data || error.message))
    }
  }
}

function* deletePermissionSaga(action) {
  try {
    yield call(deletePermissionApi, action.payload)
    yield put(deletePermissionSuccess(action.payload))
    toast.success('Permission deleted successfully!')
    yield put({ type: GET_PERMISSIONS })
  } catch (error) {
    yield put(deletePermissionFail(error.response?.data || error.message))
  }
}

// Watcher saga
function* permissionSaga() {
  yield takeEvery(GET_PERMISSIONS, getPermissionsSaga)
  yield takeEvery(ADD_PERMISSION, addPermissionSaga)
  yield takeEvery(UPDATE_PERMISSION, updatePermissionSaga)
  yield takeEvery(DELETE_PERMISSION, deletePermissionSaga)
}

export default permissionSaga
