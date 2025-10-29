import { call, put, takeEvery } from 'redux-saga/effects';
import { GET_CMS_PAGES } from './actionTypes';
import { getCmsPagesSuccess, getCmsPagesFail } from './actions';
import axiosInstance from 'pages/Utility/axiosInstance';

// API Call
const fetchCmsPagesApi = (payload) => axiosInstance.post('V1/pages/list', payload);

// Saga: Get CMS Pages
function* getCmsPagesSaga(action) {
  try {
    const { data } = yield call(fetchCmsPagesApi, action.payload);
    yield put(getCmsPagesSuccess(data));
  } catch (error) {
    yield put(getCmsPagesFail(error.response?.data || error.message));
  }
}

// Watcher Saga
function* cmsPageSaga() {
  yield takeEvery(GET_CMS_PAGES, getCmsPagesSaga);
}

export default cmsPageSaga;
