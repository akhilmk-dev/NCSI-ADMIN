import { call, put, takeEvery } from 'redux-saga/effects'
import {
  LOGIN,
  LOGOUT,
} from './actionTypes'
import {
  loginSuccess,
  loginFail,
  logoutSuccess,
  logoutFail,
  setLoginFieldErrors,
} from './actions'
import axiosInstance from 'pages/Utility/axiosInstance'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

// API calls
const loginApi = (credentials) => axiosInstance.post('V1/user/login', credentials)
const logoutApi = () => axiosInstance.post('/logout')

// Sagas
function* loginSaga(action) {
  try {
    const { data } = yield call(loginApi, action.payload.credentials)
    Cookies.set('access_token', data?.data?.token);
    action.payload.navigate(`/dashboard`);
    yield put(loginSuccess(data))
    toast.success(data?.message)
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
      yield put(setLoginFieldErrors(error.response.data.fieldErrors))
    } else {
      yield put(loginFail(error.response?.data || error.message))
    }
  }
}

function* logoutSaga() {
  try {
    yield call(logoutApi)
    yield put(logoutSuccess())
    toast.success('Logout successful!')
  } catch (error) {
    yield put(logoutFail(error.response?.data || error.message))
  }
}

// Watcher saga
function* authSaga() {
  yield takeEvery(LOGIN, loginSaga)
  yield takeEvery(LOGOUT, logoutSaga)
}

export default authSaga
