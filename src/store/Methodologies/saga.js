import { call, put, takeEvery } from 'redux-saga/effects';
import {
    GET_METHODOLOGIES,
    ADD_METHODOLOGY,
    UPDATE_METHODOLOGY,
    DELETE_METHODOLOGY,
} from './actionTypes';
import {
    getMethodologiesSuccess,
    getMethodologiesFail,
    addMethodologySuccess,
    addMethodologyFail,
    updateMethodologySuccess,
    updateMethodologyFail,
    deleteMethodologySuccess,
    deleteMethodologyFail,
    setMethodologyFieldErrors,
} from './actions';
import axiosInstance from 'pages/Utility/axiosInstance';
import toast from 'react-hot-toast';
import { showSuccess } from 'helpers/notification_helper';

// ==================== API CALLS ====================
const fetchMethodologiesApi = (payload) => axiosInstance.post('V1/methodologies/list', payload);
const addMethodologyApi = ({ data }) => axiosInstance.post('V1/methodologies/create', data);
const updateMethodologyApi = ({ id, data }) => axiosInstance.post(`V1/methodologies/update/${id}`, data);
const deleteMethodologyApi = (id) => axiosInstance.post(`V1/methodologies/${id}`);

// ==================== SAGAS ====================

// Get Methodologies
function* getMethodologiesSaga(action) {
    try {
        const { data } = yield call(fetchMethodologiesApi, action.payload);
        yield put(getMethodologiesSuccess(data));
    } catch (error) {
        yield put(getMethodologiesFail(error.response?.data || error.message));
    }
}

// Add Methodology
function* addMethodologySaga(action) {
    try {
        const { data } = yield call(addMethodologyApi, action.payload);
        yield put(addMethodologySuccess(data));
        action.payload.resetForm();
        action.payload.handleClose();
        showSuccess('Methodology added successfully!');
        yield put({
            type: GET_METHODOLOGIES,
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
                filter:
                    localStorage.getItem('selectedFromDate') !== 'undefined'
                        ? {
                              from_date: localStorage.getItem('selectedFromDate'),
                          }
                        : {},
            },
        });
    } catch (error) {
       
        if (error.response?.status === 400 && error.response?.data?.errors) {
            console.log(error.response.data)
            yield put(setMethodologyFieldErrors(error.response.data.errors));
        } else {
            yield put(addMethodologyFail(error.response?.data || error.message));
        }
    }
}

// Update Methodology
function* updateMethodologySaga(action) {
    try {
        const { data } = yield call(updateMethodologyApi, action.payload);
        yield put(updateMethodologySuccess(data));
        action.payload.resetForm();
        action.payload.handleClose();
        showSuccess('Methodology updated successfully!');
        yield put({
            type: GET_METHODOLOGIES,
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
                filter:
                    localStorage.getItem('selectedFromDate') !== 'undefined'
                        ? {
                              from_date: localStorage.getItem('selectedFromDate'),
                          }
                        : {},
            },
        });
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.errors) {
            yield put(setMethodologyFieldErrors(error.response.data.errors));
        } else {
            yield put(updateMethodologyFail(error.response?.data || error.message));
        }
    }
}

// Delete Methodology
function* deleteMethodologySaga(action) {
    try {
        yield call(deleteMethodologyApi, action.payload);
        yield put(deleteMethodologySuccess(action.payload));
        showSuccess('Methodology deleted successfully!');
        yield put({
            type: GET_METHODOLOGIES,
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
                filter:
                    localStorage.getItem('selectedFromDate') !== 'undefined'
                        ? {
                              from_date: localStorage.getItem('selectedFromDate'),
                          }
                        : {},
            },
        });
    } catch (error) {
        yield put(deleteMethodologyFail(error.response?.data || error.message));
    }
}

// ==================== WATCHER SAGA ====================
function* methodologySaga() {
    yield takeEvery(GET_METHODOLOGIES, getMethodologiesSaga);
    yield takeEvery(ADD_METHODOLOGY, addMethodologySaga);
    yield takeEvery(UPDATE_METHODOLOGY, updateMethodologySaga);
    yield takeEvery(DELETE_METHODOLOGY, deleteMethodologySaga);
}

export default methodologySaga;
