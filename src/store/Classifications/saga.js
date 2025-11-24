import { call, put, takeEvery } from 'redux-saga/effects'
import {
  GET_CLASSIFICATIONS,
  ADD_CLASSIFICATIONS,
  UPDATE_CLASSIFICATIONS,
  DELETE_CLASSIFICATIONS,
} from './actionTypes'
import {
  getClassificationsSuccess,
  getClassificationsFail,
  addClassificationSuccess,
  addClassificationFail,
  updateClassificationSuccess,
  updateClassificationFail,
  deleteClassificationSuccess,
  deleteClassificationFail,
  setClassificationFieldErrors,
} from './actions'
import axiosInstance from 'pages/Utility/axiosInstance'
import toast from 'react-hot-toast'
import { showSuccess } from 'helpers/notification_helper'

// API calls
const fetchClassificationsApi = (classifications) => axiosInstance.post('V1/classifications/list',classifications )
const addClassificationApi = ({classification}) => axiosInstance.post('V1/classifications/create', classification)
const updateClassificationApi = ({classification,id}) => axiosInstance.post(`V1/classifications/update/${id}`, classification)
const deleteClassificationApi = (id) => axiosInstance.post(`V1/classifications/${id}`)

// Sagas
function* getClassificationsSaga(action) {
  try {
    const { data } = yield call(fetchClassificationsApi,action.payload)
    yield put(getClassificationsSuccess(data))
  } catch (error) {
    yield put(getClassificationsFail(error.response?.data || error.message))
    toast.dismiss();
    toast.error('Failed to fetch classifications!')
  }
}

function* addClassificationSaga(action) {
  try {
    const { data } = yield call(addClassificationApi, action.payload)
    yield put(addClassificationSuccess(data))
    action.payload.resetForm();
    action.payload.handleClose();
    showSuccess('Classification added successfully!')
    yield put({ type: GET_CLASSIFICATIONS,payload:{
      "pagesize": 10,
      "currentpage":Number(localStorage.getItem('pageIndex'))+ 1,
      "sortorder": JSON.parse(localStorage.getItem("selectedSortData"))?.value && JSON.parse(localStorage.getItem("selectedSortData"))?.direction
          ? {
              field: JSON.parse(localStorage.getItem("selectedSortData")).value,
              direction: JSON.parse(localStorage.getItem("selectedSortData")).direction,
          }
          : {},
      "searchstring": localStorage.getItem('searchString'),
      "filter":{}
  }  })
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      yield put(setClassificationFieldErrors(error.response.data.errors))
    } else {
      yield put(addClassificationFail(error.response?.data || error.message))
    }
  }
}

function* updateClassificationSaga(action) {
  try {
    const { data } = yield call(updateClassificationApi, action.payload)
    yield put(updateClassificationSuccess(data))
    action.payload.resetForm();
    action.payload.handleClose();
    showSuccess('Classification updated successfully!')
    yield put({ type: GET_CLASSIFICATIONS,payload:{
      "pagesize": 10,
      "currentpage":Number(localStorage.getItem('pageIndex'))+ 1,
      "sortorder": JSON.parse(localStorage.getItem("selectedSortData"))?.value && JSON.parse(localStorage.getItem("selectedSortData"))?.direction
          ? {
              field: JSON.parse(localStorage.getItem("selectedSortData")).value,
              direction: JSON.parse(localStorage.getItem("selectedSortData")).direction,
          }
          : {},
      "searchstring": localStorage.getItem('searchString'),
      "filter":{}
  }  })
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      yield put(setClassificationFieldErrors(error.response.data.errors))
    } else {
      yield put(updateClassificationFail(error.response?.data || error.message))
    }
  }
}

function* deleteClassificationSaga(action) {
  try {
    yield call(deleteClassificationApi, action.payload)
    yield put(deleteClassificationSuccess(action.payload))
    showSuccess('Classification deleted successfully!')
    yield put({ type: GET_CLASSIFICATIONS ,payload:{
      "pagesize": 10,
      "currentpage":Number(localStorage.getItem('pageIndex'))+ 1,
      "sortorder": JSON.parse(localStorage.getItem("selectedSortData"))?.value && JSON.parse(localStorage.getItem("selectedSortData"))?.direction
          ? {
              field: JSON.parse(localStorage.getItem("selectedSortData")).value,
              direction: JSON.parse(localStorage.getItem("selectedSortData")).direction,
          }
          : {},
      "searchstring": localStorage.getItem('searchString'),
      "filter":{}
  } })
  } catch (error) {
    yield put(deleteClassificationFail(error.response?.data || error.message))
  }
}

// Watcher saga
function* classificationSaga() {
  yield takeEvery(GET_CLASSIFICATIONS, getClassificationsSaga)
  yield takeEvery(ADD_CLASSIFICATIONS, addClassificationSaga)
  yield takeEvery(UPDATE_CLASSIFICATIONS, updateClassificationSaga)
  yield takeEvery(DELETE_CLASSIFICATIONS, deleteClassificationSaga)
}

export default classificationSaga
