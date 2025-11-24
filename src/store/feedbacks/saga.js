import { call, put, takeEvery } from 'redux-saga/effects';


import {
  getFeedbacksSuccess,
  getFeedbacksFail,
  deleteFeedbackSuccess,
  deleteFeedbackFail,
} from './actions';

import axiosInstance from 'pages/Utility/axiosInstance';
import toast from 'react-hot-toast';
import { DELETE_FEEDBACK, GET_FEEDBACKS } from './actionTypes';

// API calls
const fetchFeedbacksApi = (payload) => axiosInstance.post('V1/feedback/list', payload);
const deleteFeedbackApi = (id) => axiosInstance.post(`V1/feedback/${id}`);

// Sagas
function* getFeedbacksSaga(action) {
  try {
    const { data } = yield call(fetchFeedbacksApi, action.payload);
    yield put(getFeedbacksSuccess(data));
  } catch (error) {
    yield put(getFeedbacksFail(error.response?.data || error.message));
    toast.dismiss();
    toast.error('Failed to fetch feedbacks!');
  }
}

function* deleteFeedbackSaga(action) {
  try {
    yield call(deleteFeedbackApi, action.payload);
    yield put(deleteFeedbackSuccess(action.payload));
    toast.success('Feedback deleted successfully!');

    yield put({
      type: GET_FEEDBACKS,
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
    yield put(deleteFeedbackFail(error.response?.data || error.message));
  }
}

// Watcher saga
function* feedbackSaga() {
  yield takeEvery(GET_FEEDBACKS, getFeedbacksSaga);
  yield takeEvery(DELETE_FEEDBACK, deleteFeedbackSaga);
}

export default feedbackSaga;
