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
const fetchEventsApi = () => axiosInstance.get('', { params: { sp: 'usp_GetEvent' } });
const addEventApi = (event) => axiosInstance.post('', event);
const updateEventApi = (event) => axiosInstance.post('', event);
const deleteEventApi = (id) => axiosInstance.post('', { sp: 'usp_DeleteEvent', eventId: id });

// Sagas
function* getEventsSaga() {
    try {
        const { data } = yield call(fetchEventsApi);
        yield put(getEventsSuccess(data));
    } catch (error) {
        yield put(getEventsFail(error.response?.data || error.message));
    }
}

function* addEventSaga(action) {
    try {
        const { data } = yield call(addEventApi, action.payload);
        yield put(addEventSuccess(data));
        toast.success('Event added successfully!');
        yield put({ type: GET_EVENTS });
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
            yield put(setEventFieldErrors(error.response.data.fieldErrors));
        } else {
            yield put(addEventFail(error.response?.data || error.message));
        }
    }
}

function* updateEventSaga(action) {
    try {
        const { data } = yield call(updateEventApi, action.payload);
        yield put(updateEventSuccess(data));
        toast.success('Event updated successfully!');
        yield put({ type: GET_EVENTS });
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
            yield put(setEventFieldErrors(error.response.data.fieldErrors));
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
