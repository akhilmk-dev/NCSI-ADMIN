
import { call, put, takeEvery } from 'redux-saga/effects'
import {
  GET_ROLES,
  ADD_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
} from './actionTypes'
import {
  getRolesSuccess,
  getRolesFail,
  addRoleSuccess,
  addRoleFail,
  updateRoleSuccess,
  updateRoleFail,
  deleteRoleSuccess,
  deleteRoleFail,
  setRoleFieldErrors,
} from './actions'
import axiosInstance from 'pages/Utility/axiosInstance' // Adjust import path to your axios instance
import toast from 'react-hot-toast'
import { showSuccess } from 'helpers/notification_helper'

// API calls
const fetchRolesApi = () => axiosInstance.get('', { params: { sp: 'usp_GetRoles' } })
const addRoleApi = (role) => axiosInstance.post('', role)
const updateRoleApi = (role) => axiosInstance.post('', role)
const deleteRoleApi = (id) => axiosInstance.post('', { sp: 'usp_DeleteRole', roleId: id })

// Sagas
function* getRolesSaga() {
  try {
    const { data } = yield call(fetchRolesApi)
    yield put(getRolesSuccess(data))
  } catch (error) {
    yield put(getRolesFail(error.response?.data || error.message))
  }
}

function* addRoleSaga(action) {
  try {
    const { data } = yield call(addRoleApi, action.payload?.role)
    yield put(addRoleSuccess(data))
    action.payload.navigate(`/roles`)
    showSuccess('Role added successfully!')
    yield put({ type: GET_ROLES })
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
      yield put(setRoleFieldErrors(error.response.data.fieldErrors))
    } else {
      yield put(addRoleFail(error.response?.data || error.message))
    }
  }
}

function* updateRoleSaga(action) {
  try {
    const { data } = yield call(updateRoleApi, action.payload?.role)
    yield put(updateRoleSuccess(data))
    action.payload.navigate(`/roles`)
    showSuccess('Role updated successfully!')
    yield put({ type: GET_ROLES })
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
      yield put(setRoleFieldErrors(error.response.data.fieldErrors))
    } else {
      yield put(updateRoleFail(error.response?.data || error.message))
    }
  }
}

function* deleteRoleSaga(action) {
  try {
    yield call(deleteRoleApi, action.payload)
    yield put(deleteRoleSuccess(action.payload))
    showSuccess('Role deleted successfully!')
    yield put({ type: GET_ROLES })
  } catch (error) {
    yield put(deleteRoleFail(error.response?.data || error.message))
  }
}

// Watcher saga
function* roleSaga() {
  yield takeEvery(GET_ROLES, getRolesSaga)
  yield takeEvery(ADD_ROLE, addRoleSaga)
  yield takeEvery(UPDATE_ROLE, updateRoleSaga)
  yield takeEvery(DELETE_ROLE, deleteRoleSaga)
}

export default roleSaga
