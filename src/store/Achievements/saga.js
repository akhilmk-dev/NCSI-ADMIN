import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_ACHIEVEMENTS,
  ADD_ACHIEVEMENT,
  UPDATE_ACHIEVEMENT,
  DELETE_ACHIEVEMENT,
} from "./actionTypes";
import {
  getAchievementsSuccess,
  getAchievementsFail,
  addAchievementSuccess,
  addAchievementFail,
  updateAchievementSuccess,
  updateAchievementFail,
  deleteAchievementSuccess,
  deleteAchievementFail,
  setAchievementFieldErrors,
} from "./actions";
import axiosInstance from "pages/Utility/axiosInstance";
import toast from "react-hot-toast";

// API Calls
const fetchAchievementsApi = (payload) => axiosInstance.post("V1/achievments/list", payload);
const addAchievementApi = ({ achievement }) =>
  axiosInstance.post("V1/achievments/create", achievement);
const updateAchievementApi = ({ achievement, id }) =>
  axiosInstance.put(`V1/achievments/update/${id}`, achievement);
const deleteAchievementApi = (id) => axiosInstance.delete(`V1/achievments/${id}`);

// Get Achievements
function* getAchievementsSaga(action) {
  try {
    const { data } = yield call(fetchAchievementsApi, action.payload);
    yield put(getAchievementsSuccess(data));
  } catch (error) {
    yield put(getAchievementsFail(error.response?.data || error.message));
  }
}

// Add Achievement
function* addAchievementSaga(action) {
  try {
    const { data } = yield call(addAchievementApi, action.payload);
    yield put(addAchievementSuccess(data));

    // Reset and close modal
    action.payload.resetForm();
    action.payload.handleClose();

    toast.success("Achievement added successfully!");

    // Refresh list
    yield put({
      type: GET_ACHIEVEMENTS,
      payload: {
        pagesize: 10,
        currentpage: Number(localStorage.getItem("pageIndex")) + 1,
        sortorder:
          JSON.parse(localStorage.getItem("selectedSortData"))?.value &&
          JSON.parse(localStorage.getItem("selectedSortData"))?.direction
            ? {
                field: JSON.parse(localStorage.getItem("selectedSortData")).value,
                direction: JSON.parse(localStorage.getItem("selectedSortData")).direction,
              }
            : {},
        searchstring: localStorage.getItem("searchString"),
        filter: {},
      },
    });
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      yield put(setAchievementFieldErrors(error.response.data.errors));
    } else {
      yield put(addAchievementFail(error.response?.data || error.message));
    }
  }
}

// Update Achievement
function* updateAchievementSaga(action) {
  try {
    const { data } = yield call(updateAchievementApi, action.payload);
    yield put(updateAchievementSuccess(data));

    action.payload.resetForm();
    action.payload.handleClose();

    toast.success("Achievement updated successfully!");

    // Refresh list
    yield put({
      type: GET_ACHIEVEMENTS,
      payload: {
        pagesize: 10,
        currentpage: Number(localStorage.getItem("pageIndex")) + 1,
        sortorder:
          JSON.parse(localStorage.getItem("selectedSortData"))?.value &&
          JSON.parse(localStorage.getItem("selectedSortData"))?.direction
            ? {
                field: JSON.parse(localStorage.getItem("selectedSortData")).value,
                direction: JSON.parse(localStorage.getItem("selectedSortData")).direction,
              }
            : {},
        searchstring: localStorage.getItem("searchString"),
        filter: {},
      },
    });
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      yield put(setAchievementFieldErrors(error.response.data.errors));
    } else {
      yield put(updateAchievementFail(error.response?.data || error.message));
    }
  }
}

// Delete Achievement
function* deleteAchievementSaga(action) {
  try {
    yield call(deleteAchievementApi, action.payload);
    yield put(deleteAchievementSuccess(action.payload));

    toast.success("Achievement deleted successfully!");

    // Refresh list
    yield put({
      type: GET_ACHIEVEMENTS,
      payload: {
        pagesize: 10,
        currentpage: Number(localStorage.getItem("pageIndex")) + 1,
        sortorder:
          JSON.parse(localStorage.getItem("selectedSortData"))?.value &&
          JSON.parse(localStorage.getItem("selectedSortData"))?.direction
            ? {
                field: JSON.parse(localStorage.getItem("selectedSortData")).value,
                direction: JSON.parse(localStorage.getItem("selectedSortData")).direction,
              }
            : {},
        searchstring: localStorage.getItem("searchString"),
        filter: {},
      },
    });
  } catch (error) {
    yield put(deleteAchievementFail(error.response?.data || error.message));
  }
}

//  Watcher Saga
function* achievementSaga() {
  yield takeEvery(GET_ACHIEVEMENTS, getAchievementsSaga);
  yield takeEvery(ADD_ACHIEVEMENT, addAchievementSaga);
  yield takeEvery(UPDATE_ACHIEVEMENT, updateAchievementSaga);
  yield takeEvery(DELETE_ACHIEVEMENT, deleteAchievementSaga);
}

export default achievementSaga;
