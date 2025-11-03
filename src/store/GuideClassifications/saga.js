import { call, put, takeEvery } from 'redux-saga/effects';
import {
    GET_GUIDE_CLASSIFICATIONS,
    ADD_GUIDE_CLASSIFICATION,
    UPDATE_GUIDE_CLASSIFICATION,
    DELETE_GUIDE_CLASSIFICATION,
} from './actionTypes';
import {
    getGuideClassificationsSuccess,
    getGuideClassificationsFail,
    addGuideClassificationSuccess,
    addGuideClassificationFail,
    updateGuideClassificationSuccess,
    updateGuideClassificationFail,
    deleteGuideClassificationSuccess,
    deleteGuideClassificationFail,
    setGuideClassificationFieldErrors,
} from './actions';
import axiosInstance from 'pages/Utility/axiosInstance';
import toast from 'react-hot-toast';

// ==================== API CALLS ====================
const fetchGuideClassificationsApi = (payload) => axiosInstance.post('V1/guideclassifications/list', payload);
const addGuideClassificationApi = ({ data }) => axiosInstance.post('V1/guideclassifications/create', data);
const updateGuideClassificationApi = ({ id, data }) => axiosInstance.put(`V1/guideclassifications/update/${id}`, data);
const deleteGuideClassificationApi = (id) => axiosInstance.delete(`V1/guideclassifications/${id}`);

// ==================== SAGAS ====================

// Get Guide Classifications
function* getGuideClassificationsSaga(action) {
    try {
        const { data } = yield call(fetchGuideClassificationsApi, action.payload);
        yield put(getGuideClassificationsSuccess(data));
    } catch (error) {
        yield put(getGuideClassificationsFail(error.response?.data || error.message));
    }
}

// Add Guide Classification
function* addGuideClassificationSaga(action) {
    try {
        const { data } = yield call(addGuideClassificationApi, action.payload);
        yield put(addGuideClassificationSuccess(data));
        action.payload.resetForm();
        action.payload.handleClose();
        toast.success('Guide Classification added successfully!');
        yield put({
            type: GET_GUIDE_CLASSIFICATIONS,
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
            yield put(setGuideClassificationFieldErrors(error.response.data.errors));
        } else {
            yield put(addGuideClassificationFail(error.response?.data || error.message));
        }
    }
}

// Update Guide Classification
function* updateGuideClassificationSaga(action) {
    try {
        const { data } = yield call(updateGuideClassificationApi, action.payload);
        yield put(updateGuideClassificationSuccess(data));
        action.payload.resetForm();
        action.payload.handleClose();
        toast.success('Guide Classification updated successfully!');
        yield put({
            type: GET_GUIDE_CLASSIFICATIONS,
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
            yield put(setGuideClassificationFieldErrors(error.response.data.errors));
        } else {
            yield put(updateGuideClassificationFail(error.response?.data || error.message));
        }
    }
}

// Delete Guide Classification
function* deleteGuideClassificationSaga(action) {
    try {
        yield call(deleteGuideClassificationApi, action.payload);
        yield put(deleteGuideClassificationSuccess(action.payload));
        toast.success('Guide Classification deleted successfully!');
        yield put({
            type: GET_GUIDE_CLASSIFICATIONS,
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
        yield put(deleteGuideClassificationFail(error.response?.data || error.message));
    }
}

// ==================== WATCHER SAGA ====================
function* guideClassificationSaga() {
    yield takeEvery(GET_GUIDE_CLASSIFICATIONS, getGuideClassificationsSaga);
    yield takeEvery(ADD_GUIDE_CLASSIFICATION, addGuideClassificationSaga);
    yield takeEvery(UPDATE_GUIDE_CLASSIFICATION, updateGuideClassificationSaga);
    yield takeEvery(DELETE_GUIDE_CLASSIFICATION, deleteGuideClassificationSaga);
}

export default guideClassificationSaga;
