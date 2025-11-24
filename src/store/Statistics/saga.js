import { call, put, takeEvery } from 'redux-saga/effects';
import {
    GET_STATISTICS,
    ADD_STATISTICS,
    UPDATE_STATISTICS,
    DELETE_STATISTICS,
} from './actionTypes';
import {
    getStatisticsSuccess,
    getStatisticsFail,
    addStatisticsSuccess,
    addStatisticsFail,
    updateStatisticsSuccess,
    updateStatisticsFail,
    deleteStatisticsSuccess,
    deleteStatisticsFail,
    setStatisticsFieldErrors,
} from './actions';
import axiosInstance from 'pages/Utility/axiosInstance';
import toast from 'react-hot-toast';
import { showSuccess } from 'helpers/notification_helper';

// API Calls
const fetchStatisticsApi = (statistics) => axiosInstance.post('V1/statistics/list', statistics);
const addStatisticsApi = ({ statistic }) => axiosInstance.post('V1/statistics/create', statistic);
const updateStatisticsApi = ({ statistic, id }) => axiosInstance.post(`V1/statistics/update/${id}`, statistic);
const deleteStatisticsApi = (id) => axiosInstance.post(`V1/statistics/${id}`);

// Sagas
function* getStatisticsSaga(action) {
    try {
        const { data } = yield call(fetchStatisticsApi, action.payload);
        yield put(getStatisticsSuccess(data));
    } catch (error) {
        yield put(getStatisticsFail(error.response?.data || error.message));
    }
}

function* addStatisticsSaga(action) {
    try {
        const { data } = yield call(addStatisticsApi, action.payload);
        yield put(addStatisticsSuccess(data));

        // Reset form and close modal
        action.payload.resetForm();
        action.payload.handleClose();

        showSuccess('Statistics added successfully!');

        // Refresh list
        yield put({
            type: GET_STATISTICS,
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
            yield put(setStatisticsFieldErrors(error.response.data.errors));
        } else {
            yield put(addStatisticsFail(error.response?.data || error.message));
        }
    }
}

function* updateStatisticsSaga(action) {
    try {
        const { data } = yield call(updateStatisticsApi, action.payload);
        yield put(updateStatisticsSuccess(data));

        // Reset form and close modal
        action.payload.resetForm();
        action.payload.handleClose();

        showSuccess('Statistics updated successfully!');

        // Refresh list
        yield put({
            type: GET_STATISTICS,
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
            yield put(setStatisticsFieldErrors(error.response.data.errors));
        } else {
            yield put(updateStatisticsFail(error.response?.data || error.message));
        }
    }
}

function* deleteStatisticsSaga(action) {
    try {
        yield call(deleteStatisticsApi, action.payload);
        yield put(deleteStatisticsSuccess(action.payload));
        showSuccess('Statistics deleted successfully!');

        // Refresh list
        yield put({
            type: GET_STATISTICS,
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
        yield put(deleteStatisticsFail(error.response?.data || error.message));
    }
}

// Watcher Saga
function* statisticsSaga() {
    yield takeEvery(GET_STATISTICS, getStatisticsSaga);
    yield takeEvery(ADD_STATISTICS, addStatisticsSaga);
    yield takeEvery(UPDATE_STATISTICS, updateStatisticsSaga);
    yield takeEvery(DELETE_STATISTICS, deleteStatisticsSaga);
}

export default statisticsSaga;
