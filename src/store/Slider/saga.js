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
const fetchSlidersApi = (data) =>
  axiosInstance.post('V1/sliders/list',data);

const addSliderApi = ({sliderData}) => axiosInstance.post('V1/sliders/create', sliderData);

const updateSliderApi = ({sliderData,id}) => axiosInstance.put(`V1/sliders/update/${id}`, sliderData);

const deleteSliderApi = (id) =>
  axiosInstance.delete(`V1/sliders/${id}`);

// 🚦 Sagas

function* getSlidersSaga(action) {
  try {
    const { data } = yield call(fetchSlidersApi,action.payload);
    yield put(getSlidersSuccess(data));
  } catch (error) {
    yield put(getSlidersFail(error.response?.data || error.message));
  }
}

function* addSliderSaga(action) {
  try {
    const { data } = yield call(addSliderApi, action.payload);
    action.payload.resetForm();
    action.payload.handleClose();
    yield put(addSliderSuccess(data));
    toast.success('Slider added successfully!');
    yield put({ type: GET_SLIDERS,payload:{
      "pagesize": 10,
      "currentpage": Number(localStorage.getItem('pageIndex'))+1,
      "sortorder": {
      //   "field": "created_at",
      //   "direction": "desc"
      }
    } });
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      yield put(setSliderFieldErrors(error.response.data.errors));
    } else {
      yield put(addSliderFail(error.response?.data || error.message));
    }
  }
}

function* updateSliderSaga(action) {
  try {
    const { data } = yield call(updateSliderApi, action.payload);
    action.payload.resetForm();
    action.payload.handleClose();
    yield put(updateSliderSuccess(data));
    toast.success('Slider updated successfully!');
    yield put({ type: GET_SLIDERS,payload:{
      "pagesize": 10,
      "currentpage": Number(localStorage.getItem('pageIndex'))+1,
      "sortorder": {
      //   "field": "created_at",
      //   "direction": "desc"
      }
    }  });
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      yield put(setSliderFieldErrors(error.response.data.errors));
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
    yield put({ type: GET_SLIDERS ,payload:{
      "pagesize": 10,
      "currentpage": Number(localStorage.getItem('pageIndex'))+1,
      "sortorder": {
      //   "field": "created_at",
      //   "direction": "desc"
      }
    } });
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
