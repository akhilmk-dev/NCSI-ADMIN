import { call, put, takeEvery } from 'redux-saga/effects';
import {
  GET_ORGANIZATION_CHART,
  ADD_ORGANIZATION_CHART,
  UPDATE_ORGANIZATION_CHART,
  DELETE_ORGANIZATION_CHART,
} from './actionTypes';
import {
  getOrganizationChartSuccess,
  getOrganizationChartFail,
  addOrganizationChartSuccess,
  addOrganizationChartFail,
  updateOrganizationChartSuccess,
  updateOrganizationChartFail,
  deleteOrganizationChartSuccess,
  deleteOrganizationChartFail,
  setOrganizationChartFieldErrors,
} from './actions';
import axiosInstance from 'pages/Utility/axiosInstance';
import toast from 'react-hot-toast';

// API Calls
const fetchOrganizationChartApi = (payload) =>
  axiosInstance.post('V1/organizationcharts/list', payload);

const addOrganizationChartApi = ({ chart }) =>
  axiosInstance.post('V1/organizationcharts/create', chart);

const updateOrganizationChartApi = ({ chart, id }) =>
  axiosInstance.put(`V1/organizationcharts/update/${id}`, chart);

const deleteOrganizationChartApi = (id) =>
  axiosInstance.delete(`V1/organizationcharts/${id}`);

// Sagas

// Get Organization Chart
function* getOrganizationChartSaga(action) {
  try {
    const { data } = yield call(fetchOrganizationChartApi, action.payload);
    yield put(getOrganizationChartSuccess(data));
  } catch (error) {
    yield put(getOrganizationChartFail(error.response?.data || error.message));
  }
}

// Add Organization Chart
function* addOrganizationChartSaga(action) {
  try {
    const { data } = yield call(addOrganizationChartApi, action.payload);
    yield put(addOrganizationChartSuccess(data));

    // Reset and close modal
    action.payload.resetForm();
    action.payload.handleClose();

    toast.success('Organization Chart added successfully!');

    // Refresh List
    yield put({
      type: GET_ORGANIZATION_CHART,
      payload: {
        pagesize: 10,
        currentpage: Number(localStorage.getItem('pageIndex')) + 1,
        sortorder:
          JSON.parse(localStorage.getItem('selectedSortData'))?.value &&
          JSON.parse(localStorage.getItem('selectedSortData'))?.direction
            ? {
                field: JSON.parse(localStorage.getItem('selectedSortData')).value,
                direction: JSON.parse(localStorage.getItem('selectedSortData')).direction,
              }
            : {},
        searchstring: localStorage.getItem('searchString'),
        filter: {},
      },
    });
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      yield put(setOrganizationChartFieldErrors(error.response.data.errors));
    } else {
      yield put(addOrganizationChartFail(error.response?.data || error.message));
    }
  }
}

// Update Organization Chart
function* updateOrganizationChartSaga(action) {
  try {
    const { data } = yield call(updateOrganizationChartApi, action.payload);
    yield put(updateOrganizationChartSuccess(data));

    action.payload.resetForm();
    action.payload.handleClose();

    toast.success('Organization Chart updated successfully!');

    yield put({
      type: GET_ORGANIZATION_CHART,
      payload: {
        pagesize: 10,
        currentpage: Number(localStorage.getItem('pageIndex')) + 1,
        sortorder:
          JSON.parse(localStorage.getItem('selectedSortData'))?.value &&
          JSON.parse(localStorage.getItem('selectedSortData'))?.direction
            ? {
                field: JSON.parse(localStorage.getItem('selectedSortData')).value,
                direction: JSON.parse(localStorage.getItem('selectedSortData')).direction,
              }
            : {},
        searchstring: localStorage.getItem('searchString'),
        filter: {},
      },
    });
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      yield put(setOrganizationChartFieldErrors(error.response.data.errors));
    } else {
      yield put(updateOrganizationChartFail(error.response?.data || error.message));
    }
  }
}

// Delete Organization Chart
function* deleteOrganizationChartSaga(action) {
  try {
    yield call(deleteOrganizationChartApi, action.payload);
    yield put(deleteOrganizationChartSuccess(action.payload));
    toast.success('Organization Chart deleted successfully!');

    yield put({
      type: GET_ORGANIZATION_CHART,
      payload: {
        pagesize: 10,
        currentpage: Number(localStorage.getItem('pageIndex')) + 1,
        sortorder:
          JSON.parse(localStorage.getItem('selectedSortData'))?.value &&
          JSON.parse(localStorage.getItem('selectedSortData'))?.direction
            ? {
                field: JSON.parse(localStorage.getItem('selectedSortData')).value,
                direction: JSON.parse(localStorage.getItem('selectedSortData')).direction,
              }
            : {},
        searchstring: localStorage.getItem('searchString'),
        filter: {},
      },
    });
  } catch (error) {
    yield put(deleteOrganizationChartFail(error.response?.data || error.message));
  }
}

// Watcher Saga
function* organizationChartSaga() {
  yield takeEvery(GET_ORGANIZATION_CHART, getOrganizationChartSaga);
  yield takeEvery(ADD_ORGANIZATION_CHART, addOrganizationChartSaga);
  yield takeEvery(UPDATE_ORGANIZATION_CHART, updateOrganizationChartSaga);
  yield takeEvery(DELETE_ORGANIZATION_CHART, deleteOrganizationChartSaga);
}

export default organizationChartSaga;
