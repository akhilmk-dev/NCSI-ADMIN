import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_SURVEY_LICENSES,
  ADD_SURVEY_LICENSE,
  UPDATE_SURVEY_LICENSE,
  DELETE_SURVEY_LICENSE,
} from "./actionTypes";
import {
  getSurveyLicensesSuccess,
  getSurveyLicensesFail,
  addSurveyLicenseSuccess,
  addSurveyLicenseFail,
  updateSurveyLicenseSuccess,
  updateSurveyLicenseFail,
  deleteSurveyLicenseSuccess,
  deleteSurveyLicenseFail,
  setSurveyLicenseFieldErrors,
} from "./actions";
import axiosInstance from "pages/Utility/axiosInstance";
import toast from "react-hot-toast";

// ============================
// API Calls
// ============================

const fetchSurveyLicensesApi = (filters) =>
  axiosInstance.post("V1/liscences/list", filters);

const addSurveyLicenseApi = ({ license }) =>
  axiosInstance.post("V1/liscences/create", license);

const updateSurveyLicenseApi = ({ license, id }) =>
  axiosInstance.put(`V1/liscences/update/${id}`, license);

const deleteSurveyLicenseApi = (id) =>
  axiosInstance.delete(`V1/liscences/${id}`);

// ============================
// Worker Sagas
// ============================

// GET ALL
function* getSurveyLicensesSaga(action) {
  try {
    const { data } = yield call(fetchSurveyLicensesApi, action.payload);
    yield put(getSurveyLicensesSuccess(data));
  } catch (error) {
    yield put(getSurveyLicensesFail(error.response?.data || error.message));
  }
}

// ADD
function* addSurveyLicenseSaga(action) {
  try {
    const { data } = yield call(addSurveyLicenseApi, action.payload);
    yield put(addSurveyLicenseSuccess(data));

    // Reset form and close modal
    action.payload.resetForm();
    action.payload.handleClose();

    toast.success("Survey license added successfully!");

    // Refresh list
    yield put({
      type: GET_SURVEY_LICENSES,
      payload: {
        pagesize: 10,
        currentpage: Number(localStorage.getItem("pageIndex")) + 1,
        sortorder:
          JSON.parse(localStorage.getItem("selectedSortData"))?.value &&
          JSON.parse(localStorage.getItem("selectedSortData"))?.direction
            ? {
                field: JSON.parse(localStorage.getItem("selectedSortData")).value,
                direction: JSON.parse(localStorage.getItem("selectedSortData"))
                  .direction,
              }
            : {},
        searchstring: localStorage.getItem("searchString"),
        filter: {},
      },
    });
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      yield put(setSurveyLicenseFieldErrors(error.response.data.errors));
    } else {
      yield put(addSurveyLicenseFail(error.response?.data || error.message));
    }
  }
}

// UPDATE
function* updateSurveyLicenseSaga(action) {
  try {
    const { data } = yield call(updateSurveyLicenseApi, action.payload);
    yield put(updateSurveyLicenseSuccess(data));

    // Reset form and close modal
    action.payload.resetForm();
    action.payload.handleClose();

    toast.success("Survey license updated successfully!");

    // Refresh list
    yield put({
      type: GET_SURVEY_LICENSES,
      payload: {
        pagesize: 10,
        currentpage: Number(localStorage.getItem("pageIndex")) + 1,
        sortorder:
          JSON.parse(localStorage.getItem("selectedSortData"))?.value &&
          JSON.parse(localStorage.getItem("selectedSortData"))?.direction
            ? {
                field: JSON.parse(localStorage.getItem("selectedSortData")).value,
                direction: JSON.parse(localStorage.getItem("selectedSortData"))
                  .direction,
              }
            : {},
        searchstring: localStorage.getItem("searchString"),
        filter: {},
      },
    });
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      yield put(setSurveyLicenseFieldErrors(error.response.data.errors));
    } else {
      yield put(updateSurveyLicenseFail(error.response?.data || error.message));
    }
  }
}

// DELETE
function* deleteSurveyLicenseSaga(action) {
  try {
    yield call(deleteSurveyLicenseApi, action.payload);
    yield put(deleteSurveyLicenseSuccess(action.payload));

    toast.success("Survey license deleted successfully!");

    // Refresh list
    yield put({
      type: GET_SURVEY_LICENSES,
      payload: {
        pagesize: 10,
        currentpage: Number(localStorage.getItem("pageIndex")) + 1,
        sortorder:
          JSON.parse(localStorage.getItem("selectedSortData"))?.value &&
          JSON.parse(localStorage.getItem("selectedSortData"))?.direction
            ? {
                field: JSON.parse(localStorage.getItem("selectedSortData")).value,
                direction: JSON.parse(localStorage.getItem("selectedSortData"))
                  .direction,
              }
            : {},
        searchstring: localStorage.getItem("searchString"),
        filter: {},
      },
    });
  } catch (error) {
    yield put(deleteSurveyLicenseFail(error.response?.data || error.message));
  }
}

// ============================
// Watcher Saga
// ============================
function* surveyLicenseSaga() {
  yield takeEvery(GET_SURVEY_LICENSES, getSurveyLicensesSaga);
  yield takeEvery(ADD_SURVEY_LICENSE, addSurveyLicenseSaga);
  yield takeEvery(UPDATE_SURVEY_LICENSE, updateSurveyLicenseSaga);
  yield takeEvery(DELETE_SURVEY_LICENSE, deleteSurveyLicenseSaga);
}

export default surveyLicenseSaga;
