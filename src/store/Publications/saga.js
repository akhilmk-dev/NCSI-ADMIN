import { call, put, takeEvery } from 'redux-saga/effects';
import {
    GET_PUBLICATIONS,
    ADD_PUBLICATION,
    UPDATE_PUBLICATION,
    DELETE_PUBLICATION,
} from './actionTypes';
import {
    getPublicationsSuccess,
    getPublicationsFail,
    addPublicationSuccess,
    addPublicationFail,
    updatePublicationSuccess,
    updatePublicationFail,
    deletePublicationSuccess,
    deletePublicationFail,
    setPublicationFieldErrors,
} from './actions';
import axiosInstance from 'pages/Utility/axiosInstance';
import toast from 'react-hot-toast';

// API calls
const fetchPublicationsApi = () => axiosInstance.get('', { params: { sp: 'usp_GetPublication' } });
const addPublicationApi = (publication) => axiosInstance.post('', publication);
const updatePublicationApi = (publication) => axiosInstance.post('', publication);
const deletePublicationApi = (id) => axiosInstance.post('', { sp: 'usp_DeletePublication', publicationId: id });

// Sagas
function* getPublicationsSaga() {
    try {
        const { data } = yield call(fetchPublicationsApi);
        yield put(getPublicationsSuccess(data));
    } catch (error) {
        yield put(getPublicationsFail(error.response?.data || error.message));
    }
}

function* addPublicationSaga(action) {
    try {
        const { data } = yield call(addPublicationApi, action.payload);
        yield put(addPublicationSuccess(data));
        toast.success('Publication added successfully!');
        yield put({ type: GET_PUBLICATIONS });
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
            yield put(setPublicationFieldErrors(error.response.data.fieldErrors));
        } else {
            yield put(addPublicationFail(error.response?.data || error.message));
        }
    }
}

function* updatePublicationSaga(action) {
    try {
        const { data } = yield call(updatePublicationApi, action.payload);
        yield put(updatePublicationSuccess(data));
        toast.success('Publication updated successfully!');
        yield put({ type: GET_PUBLICATIONS });
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
            yield put(setPublicationFieldErrors(error.response.data.fieldErrors));
        } else {
            yield put(updatePublicationFail(error.response?.data || error.message));
        }
    }
}

function* deletePublicationSaga(action) {
    try {
        yield call(deletePublicationApi, action.payload);
        yield put(deletePublicationSuccess(action.payload));
        toast.success('Publication deleted successfully!');
        yield put({ type: GET_PUBLICATIONS });
    } catch (error) {
        yield put(deletePublicationFail(error.response?.data || error.message));
    }
}

// Watcher saga
function* publicationSaga() {
    yield takeEvery(GET_PUBLICATIONS, getPublicationsSaga);
    yield takeEvery(ADD_PUBLICATION, addPublicationSaga);
    yield takeEvery(UPDATE_PUBLICATION, updatePublicationSaga);
    yield takeEvery(DELETE_PUBLICATION, deletePublicationSaga);
}

export default publicationSaga;
