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

// API calls
const fetchClassificationsApi = () => axiosInstance.get('', { params: { sp: 'usp_GetCatalogueClassifications' } })
const addClassificationApi = (classification) => axiosInstance.post('', classification)
const updateClassificationApi = (classification) => axiosInstance.post('', classification)
const deleteClassificationApi = (id) => axiosInstance.post('', { sp: 'usp_DeleteCatalogueClassification', classificationId: id })

// Sagas
function* getClassificationsSaga() {
  try {
    const { data } = yield call(fetchClassificationsApi)
    yield put(getClassificationsSuccess(data))
  } catch (error) {
    yield put(getClassificationsFail(error.response?.data || error.message))
    toast.error('Failed to fetch classifications!')
  }
}

function* addClassificationSaga(action) {
  try {
    const { data } = yield call(addClassificationApi, action.payload)
    yield put(addClassificationSuccess(data))
    toast.success('Classification added successfully!')
    yield put({ type: GET_CLASSIFICATIONS })
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
      yield put(setClassificationFieldErrors(error.response.data.fieldErrors))
    } else {
      yield put(addClassificationFail(error.response?.data || error.message))
    }
  }
}

function* updateClassificationSaga(action) {
  try {
    const { data } = yield call(updateClassificationApi, action.payload)
    yield put(updateClassificationSuccess(data))
    toast.success('Classification updated successfully!')
    yield put({ type: GET_CLASSIFICATIONS })
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
      yield put(setClassificationFieldErrors(error.response.data.fieldErrors))
    } else {
      yield put(updateClassificationFail(error.response?.data || error.message))
    }
  }
}

function* deleteClassificationSaga(action) {
  try {
    yield call(deleteClassificationApi, action.payload)
    yield put(deleteClassificationSuccess(action.payload))
    toast.success('Classification deleted successfully!')
    yield put({ type: GET_CLASSIFICATIONS })
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
