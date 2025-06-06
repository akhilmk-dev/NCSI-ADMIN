import { call, put, takeEvery } from 'redux-saga/effects';
import {
    GET_EVENTS,
    ADD_EVENT,
    UPDATE_EVENT,
    DELETE_EVENT,
} from './actionTypes';
import {
    getEventsSuccess,
    getEventsFail,
    addEventSuccess,
    addEventFail,
    updateEventSuccess,
    updateEventFail,
    deleteEventSuccess,
    deleteEventFail,
    setEventFieldErrors,
} from './actions';
import axiosInstance from 'pages/Utility/axiosInstance';
import toast from 'react-hot-toast';

// API calls
const fetchEventsApi = (event) => axiosInstance.post('V1/events/list',event);
const addEventApi = ({data}) => axiosInstance.post('V1/events/create', data);
const updateEventApi = ({data,id}) => axiosInstance.put(`V1/events/update/${id}`,data);
const deleteEventApi = (id) => axiosInstance.delete(`V1/events/${id}`);

// Sagas
function* getEventsSaga(action) {
    try {
        const { data } = yield call(fetchEventsApi,action.payload);
        yield put(getEventsSuccess(data));
    } catch (error) {
        yield put(getEventsFail(error.response?.data || error.message));
    }
}

function* addEventSaga(action) {
    try {
        const { data } = yield call(addEventApi, action.payload);
        yield put(addEventSuccess(data));
        action.payload.resetForm();
        action.payload.handleClose();
        toast.success('Event added successfully!');
        yield put({ type: GET_EVENTS });
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.error) {
            yield put(setEventFieldErrors(error.response.data.error));
        } else {
            yield put(addEventFail(error.response?.data || error.message));
        }
    }
}

function* updateEventSaga(action) {
    try {
        const { data } = yield call(updateEventApi, action.payload);
        yield put(updateEventSuccess(data));
        action.payload.resetForm();
        action.payload.handleClose();
        toast.success('Event updated successfully!');
        yield put({ type: GET_EVENTS });
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.error) {
            yield put(setEventFieldErrors(error.response.data.error));
        } else {
            yield put(updateEventFail(error.response?.data || error.message));
        }
    }
}

function* deleteEventSaga(action) {
    try {
        yield call(deleteEventApi, action.payload);
        yield put(deleteEventSuccess(action.payload));
        toast.success('Event deleted successfully!');
        yield put({ type: GET_EVENTS });
    } catch (error) {
        yield put(deleteEventFail(error.response?.data || error.message));
    }
}

// Watcher saga
function* eventSaga() {
    yield takeEvery(GET_EVENTS, getEventsSaga);
    yield takeEvery(ADD_EVENT, addEventSaga);
    yield takeEvery(UPDATE_EVENT, updateEventSaga);
    yield takeEvery(DELETE_EVENT, deleteEventSaga);
}

export default eventSaga;
