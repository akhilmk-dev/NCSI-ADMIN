import { call, put, takeEvery } from 'redux-saga/effects';
import {
    GET_NEWS,
    ADD_NEWS,
    UPDATE_NEWS,
    DELETE_NEWS,
} from './actionTypes';
import {
    getNewsSuccess,
    getNewsFail,
    addNewsSuccess,
    addNewsFail,
    updateNewsSuccess,
    updateNewsFail,
    deleteNewsSuccess,
    deleteNewsFail,
    setNewsFieldErrors,
} from './actions';
import axiosInstance from 'pages/Utility/axiosInstance';
import toast from 'react-hot-toast';
import { showSuccess } from 'helpers/notification_helper';

// API Calls
const fetchNewsApi = (news) => axiosInstance.post('V1/news/list', news);
const addNewsApi = ({ news }) => axiosInstance.post('V1/news/create', news);
const updateNewsApi = ({ news, id }) => axiosInstance.post(`V1/news/update/${id}`, news);
const deleteNewsApi = (id) => axiosInstance.post(`V1/news/${id}`);

// Sagas
function* getNewsSaga(action) {
    try {
        const { data } = yield call(fetchNewsApi, action.payload);
        yield put(getNewsSuccess(data));
    } catch (error) {
        yield put(getNewsFail(error.response?.data || error.message));
    }
}

function* addNewsSaga(action) {
    try {
        const { data } = yield call(addNewsApi, action.payload);
        yield put(addNewsSuccess(data));

        // Reset and close modal
        action.payload.resetForm();
        action.payload.handleClose();

        showSuccess('News added successfully!');

        // Refresh list
        yield put({
            type: GET_NEWS,
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
            yield put(setNewsFieldErrors(error.response.data.errors));
        } else {
            yield put(addNewsFail(error.response?.data || error.message));
        }
    }
}

function* updateNewsSaga(action) {
    try {
        const { data } = yield call(updateNewsApi, action.payload);
        yield put(updateNewsSuccess(data));

        action.payload.resetForm();
        action.payload.handleClose();

        showSuccess('News updated successfully!');

        yield put({
            type: GET_NEWS,
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
            yield put(setNewsFieldErrors(error.response.data.errors));
        } else {
            yield put(updateNewsFail(error.response?.data || error.message));
        }
    }
}

function* deleteNewsSaga(action) {
    try {
        yield call(deleteNewsApi, action.payload);
        yield put(deleteNewsSuccess(action.payload));
        showSuccess('News deleted successfully!');

        yield put({
            type: GET_NEWS,
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
        yield put(deleteNewsFail(error.response?.data || error.message));
    }
}

//  Watcher Saga
function* newsSaga() {
    yield takeEvery(GET_NEWS, getNewsSaga);
    yield takeEvery(ADD_NEWS, addNewsSaga);
    yield takeEvery(UPDATE_NEWS, updateNewsSaga);
    yield takeEvery(DELETE_NEWS, deleteNewsSaga);
}

export default newsSaga;
