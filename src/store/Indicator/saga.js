import { call, put, takeEvery } from 'redux-saga/effects';
import {
  GET_INDICATORS,
  ADD_INDICATOR,
  UPDATE_INDICATOR,
  DELETE_INDICATOR,
} from './actionTypes';

import {
  getIndicatorsSuccess,
  getIndicatorsFail,
  addIndicatorSuccess,
  addIndicatorFail,
  updateIndicatorSuccess,
  updateIndicatorFail,
  deleteIndicatorSuccess,
  deleteIndicatorFail,
  setIndicatorFieldErrors,
} from './actions';

import axiosInstance from 'pages/Utility/axiosInstance';
import toast from 'react-hot-toast';

// API calls
const fetchIndicatorsApi = (data) => axiosInstance.post('V1/keyindicators/list',data);
const addIndicatorApi = ({ indicator }) => axiosInstance.post('V1/keyindicators/create', indicator);
const updateIndicatorApi = ({ indicator, id }) => axiosInstance.put(`V1/keyindicators/update/${id}`, indicator);
const deleteIndicatorApi = (id) => axiosInstance.delete(`V1/keyindicators/${id}`);

// Sagas
function* getIndicatorsSaga(action) {
  try {
    const { data } = yield call(fetchIndicatorsApi,action.payload);
    yield put(getIndicatorsSuccess(data));
  } catch (error) {
    yield put(getIndicatorsFail(error.response?.data || error.message));
    toast.error('Failed to fetch indicators!');
  }
}

function* addIndicatorSaga(action) {
  try {
    const { data } = yield call(addIndicatorApi, action.payload);
    yield put(addIndicatorSuccess(data));
    action.payload.resetForm();
    action.payload.handleClose();
    toast.success('Indicator added successfully!');
    yield put({ type: GET_INDICATORS });
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      yield put(setIndicatorFieldErrors(error.response.data.errors));
    } else {
      yield put(addIndicatorFail(error.response?.data || error.message));
    }
  }
}

function* updateIndicatorSaga(action) {
  try {
    const { data } = yield call(updateIndicatorApi, action.payload);
    yield put(updateIndicatorSuccess(data));
    action.payload.resetForm();
    action.payload.handleClose();
    toast.success('Indicator updated successfully!');
    yield put({ type: GET_INDICATORS });
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      yield put(setIndicatorFieldErrors(error.response.data.errors));
    } else {
      yield put(updateIndicatorFail(error.response?.data || error.message));
    }
  }
}

function* deleteIndicatorSaga(action) {
  try {
    yield call(deleteIndicatorApi, action.payload);
    yield put(deleteIndicatorSuccess(action.payload));
    toast.success('Indicator deleted successfully!');
    yield put({ type: GET_INDICATORS });
  } catch (error) {
    yield put(deleteIndicatorFail(error.response?.data || error.message));
  }
}

// Watcher Saga
function* indicatorSaga() {
  yield takeEvery(GET_INDICATORS, getIndicatorsSaga);
  yield takeEvery(ADD_INDICATOR, addIndicatorSaga);
  yield takeEvery(UPDATE_INDICATOR, updateIndicatorSaga);
  yield takeEvery(DELETE_INDICATOR, deleteIndicatorSaga);
}

export default indicatorSaga;
