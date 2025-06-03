import { call, put, takeEvery } from 'redux-saga/effects';
import {
  GET_SLIDERS,
  ADD_SLIDER,
  UPDATE_SLIDER,
  DELETE_SLIDER,
} from './actionTypes';
import {
  getSlidersSuccess,
  getSlidersFail,
  addSliderSuccess,
  addSliderFail,
  updateSliderSuccess,
  updateSliderFail,
  deleteSliderSuccess,
  deleteSliderFail,
  setSliderFieldErrors,
} from './actions';
import axiosInstance from 'pages/Utility/axiosInstance';
import toast from 'react-hot-toast';

// 🧾 API Calls
const fetchSlidersApi = () =>
  axiosInstance.get('', { params: { sp: 'usp_GetSliders' } });

const addSliderApi = (slider) => axiosInstance.post('', slider);

const updateSliderApi = (slider) => axiosInstance.post('', slider);

const deleteSliderApi = (id) =>
  axiosInstance.post('', { sp: 'usp_DeleteSlider', sliderId: id });

// 🚦 Sagas

function* getSlidersSaga() {
  try {
    const { data } = yield call(fetchSlidersApi);
    yield put(getSlidersSuccess(data));
  } catch (error) {
    yield put(getSlidersFail(error.response?.data || error.message));
  }
}

function* addSliderSaga(action) {
  try {
    const { data } = yield call(addSliderApi, action.payload);
    yield put(addSliderSuccess(data));
    toast.success('Slider added successfully!');
    yield put({ type: GET_SLIDERS });
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
      yield put(setSliderFieldErrors(error.response.data.fieldErrors));
    } else {
      yield put(addSliderFail(error.response?.data || error.message));
    }
  }
}

function* updateSliderSaga(action) {
  try {
    const { data } = yield call(updateSliderApi, action.payload);
    yield put(updateSliderSuccess(data));
    toast.success('Slider updated successfully!');
    yield put({ type: GET_SLIDERS });
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
      yield put(setSliderFieldErrors(error.response.data.fieldErrors));
    } else {
      yield put(updateSliderFail(error.response?.data || error.message));
    }
  }
}

function* deleteSliderSaga(action) {
  try {
    yield call(deleteSliderApi, action.payload);
    yield put(deleteSliderSuccess(action.payload));
    toast.success('Slider deleted successfully!');
    yield put({ type: GET_SLIDERS });
  } catch (error) {
    yield put(deleteSliderFail(error.response?.data || error.message));
  }
}

// 👀 Watcher Saga
function* sliderSaga() {
  yield takeEvery(GET_SLIDERS, getSlidersSaga);
  yield takeEvery(ADD_SLIDER, addSliderSaga);
  yield takeEvery(UPDATE_SLIDER, updateSliderSaga);
  yield takeEvery(DELETE_SLIDER, deleteSliderSaga);
}

export default sliderSaga;
