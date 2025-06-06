import { call, put, takeEvery } from 'redux-saga/effects';
import {
  GET_POPULATION,
  ADD_POPULATION,
  UPDATE_POPULATION,
  DELETE_POPULATION,
} from './actionTypes';

import {
  getPopulationSuccess,
  getPopulationFail,
  addPopulationSuccess,
  addPopulationFail,
  updatePopulationSuccess,
  updatePopulationFail,
  deletePopulationSuccess,
  deletePopulationFail,
  setPopulationFieldErrors,
} from './actions';

import axiosInstance from 'pages/Utility/axiosInstance';
import toast from 'react-hot-toast';

// API calls
const fetchPopulationApi = (data) =>
  axiosInstance.post('V1/populations/list',data);

const addPopulationApi = ({data}) =>
  axiosInstance.post('V1/populations/create', data);

const updatePopulationApi = ({data,id}) =>
  axiosInstance.put(`V1/populations/update/${id}`, data);

const deletePopulationApi = (id) =>
  axiosInstance.delete(`V1/populations/${id}`);

// Sagas
function* getPopulationSaga(action) {
  try {
    const { data } = yield call(fetchPopulationApi,action.payload);
    yield put(getPopulationSuccess(data));
  } catch (error) {
    yield put(getPopulationFail(error.response?.data || error.message));
  }
}

function* addPopulationSaga(action) {
  try {
    const { data } = yield call(addPopulationApi, action.payload);
    action.payload.resetForm();
    action.payload.handleClose();
    yield put(addPopulationSuccess(data));
    toast.success('Population record added successfully!');
    yield put({ type: GET_POPULATION });
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      yield put(setPopulationFieldErrors(error.response.data.errors));
    } else {
      yield put(addPopulationFail(error.response?.data || error.message));
    }
  }
}

function* updatePopulationSaga(action) {
  try {
    const { data } = yield call(updatePopulationApi, action.payload);
    yield put(updatePopulationSuccess(data));
    action.payload.resetForm();
    action.payload.handleClose();
    toast.success('Population record updated successfully!');
    yield put({ type: GET_POPULATION });
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      yield put(setPopulationFieldErrors(error.response.data.errors));
    } else {
      yield put(updatePopulationFail(error.response?.data || error.message));
    }
  }
}

function* deletePopulationSaga(action) {
  try {
    yield call(deletePopulationApi, action.payload);
    yield put(deletePopulationSuccess(action.payload));
    toast.success('Population record deleted successfully!');
    yield put({ type: GET_POPULATION });
  } catch (error) {
    yield put(deletePopulationFail(error.response?.data || error.message));
  }
}

// Watcher saga
function* populationSaga() {
  yield takeEvery(GET_POPULATION, getPopulationSaga);
  yield takeEvery(ADD_POPULATION, addPopulationSaga);
  yield takeEvery(UPDATE_POPULATION, updatePopulationSaga);
  yield takeEvery(DELETE_POPULATION, deletePopulationSaga);
}

export default populationSaga;
