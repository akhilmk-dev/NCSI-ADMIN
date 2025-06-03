import { call, put, takeEvery } from 'redux-saga/effects'
import {
  GET_SETTINGS,
  UPDATE_SETTINGS,
  DELETE_SETTINGS,
} from './actionTypes'
import {
  getSettingsSuccess,
  getSettingsFail,
  updateSettingsSuccess,
  updateSettingsFail,
  deleteSettingsSuccess,
  deleteSettingsFail,
  setSettingsFieldErrors,
} from './actions'
import axiosInstance from 'pages/Utility/axiosInstance'
import toast from 'react-hot-toast'

// API calls
const fetchSettingsApi = () => axiosInstance.get('', { params: { sp: 'usp_GetSettings' } })
const updateSettingsApi = (settings) => axiosInstance.post('', settings)
const deleteSettingsApi = (id) => axiosInstance.post('', { sp: 'usp_DeleteSetting', settingId: id })

// Sagas
function* getSettingsSaga() {
  try {
    const { data } = yield call(fetchSettingsApi)
    yield put(getSettingsSuccess(data))
  } catch (error) {
    yield put(getSettingsFail(error.response?.data || error.message))
  }
}

function* updateSettingsSaga(action) {
  try {
    const { data } = yield call(updateSettingsApi, action.payload)
    yield put(updateSettingsSuccess(data))
    toast.success('Settings updated successfully!')
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
      yield put(setSettingsFieldErrors(error.response.data.fieldErrors))
    } else {
      yield put(updateSettingsFail(error.response?.data || error.message))
    }
  }
}

function* deleteSettingsSaga(action) {
  try {
    yield call(deleteSettingsApi, action.payload)
    yield put(deleteSettingsSuccess(action.payload))
    toast.success('Settings deleted successfully!')
  } catch (error) {
    yield put(deleteSettingsFail(error.response?.data || error.message))
  }
}

// Watcher saga
function* settingsSaga() {
  yield takeEvery(GET_SETTINGS, getSettingsSaga)
  yield takeEvery(UPDATE_SETTINGS, updateSettingsSaga)
  yield takeEvery(DELETE_SETTINGS, deleteSettingsSaga)  // Watch DELETE_SETTINGS
}

export default settingsSaga
