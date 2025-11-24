import { call, put, takeEvery } from 'redux-saga/effects';
import {
  GET_SURVEYS,
  DELETE_SURVEY,
} from './actionTypes';
import {
  getSurveysSuccess,
  getSurveysFail,
  deleteSurveySuccess,
  deleteSurveyFail,
  setSurveyFieldErrors,
} from './actions';
import axiosInstance from 'pages/Utility/axiosInstance';
import toast from 'react-hot-toast';
import { showSuccess } from 'helpers/notification_helper';

// API calls
const fetchSurveysApi = (payload) => axiosInstance.post('V1/surveyrequests/list', payload);
const deleteSurveyApi = (id) => axiosInstance.post(`V1/surveyrequests/${id}`);

// Get Surveys Saga
function* getSurveysSaga(action) {
  try {
    const { data } = yield call(fetchSurveysApi, action.payload);
    yield put(getSurveysSuccess(data));
  } catch (error) {
    yield put(getSurveysFail(error.response?.data || error.message));
  }
}

// Delete Survey Saga
function* deleteSurveySaga(action) {
  try {
    yield call(deleteSurveyApi, action.payload);
    yield put(deleteSurveySuccess(action.payload));
    showSuccess('Survey deleted successfully!');
    
    // Reload survey list with persisted filters
    yield put({
      type: GET_SURVEYS,
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
        filter:(localStorage.getItem('selectedSubject') && localStorage.getItem('selectedSubject') !== "undefined" && localStorage.getItem('selectedSubject') !== "null")
        ? { type: JSON.parse(localStorage.getItem('selectedSubject'))?.value }
        : (localStorage.getItem('selectedRequester') && localStorage.getItem('selectedRequester') !== "undefined" && localStorage.getItem('selectedRequester') !== "null")
            ? { classification_id: JSON.parse(localStorage.getItem('selectedRequester'))?.value }
            : {},
      },
    });
  } catch (error) {
    yield put(deleteSurveyFail(error.response?.data || error.message));
  }
}

// Watcher Saga
function* surveySaga() {
  yield takeEvery(GET_SURVEYS, getSurveysSaga);
  yield takeEvery(DELETE_SURVEY, deleteSurveySaga);
}

export default surveySaga;
