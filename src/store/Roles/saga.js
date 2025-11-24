import { call, put, takeEvery } from 'redux-saga/effects';
import {
  GET_ROLES,
  ADD_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
} from './actionTypes';
import {
  getRolesSuccess,
  getRolesFail,
  addRoleSuccess,
  addRoleFail,
  updateRoleSuccess,
  updateRoleFail,
  deleteRoleSuccess,
  deleteRoleFail,
  setRoleFieldErrors,
} from './actions';
import axiosInstance from 'pages/Utility/axiosInstance';
import toast from 'react-hot-toast';
import { showSuccess } from 'helpers/notification_helper';

// API Calls
const fetchRolesApi = (filters) => axiosInstance.post('V1/roles/list', filters);
const addRoleApi = ({ role, resetForm, handleClose }) => axiosInstance.post('V1/roles/create', role);
const updateRoleApi = ({ role, id, resetForm, handleClose }) => axiosInstance.post(`V1/roles/update/${id}`, role);
const deleteRoleApi = (id) => axiosInstance.post(`V1/roles/${id}`);

// Sagas
function* getRolesSaga(action) {
  try {
    const { data } = yield call(fetchRolesApi, action.payload);
    yield put(getRolesSuccess(data));
  } catch (error) {
    yield put(getRolesFail(error.response?.data || error.message));
  }
}

function* addRoleSaga(action) {
  try {
    const { data } = yield call(addRoleApi, action.payload);
    yield put(addRoleSuccess(data));

    // Reset form and close modal
    action.payload.navigate('/roles');
    showSuccess('Role added successfully!');

    // Refresh list
    yield put({
      type: GET_ROLES,
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
      yield put(setRoleFieldErrors(error.response.data.errors));
    } else {
      yield put(addRoleFail(error.response?.data || error.message));
    }
  }
}

function* updateRoleSaga(action) {
  try {
    const { data } = yield call(updateRoleApi, action.payload);
    yield put(updateRoleSuccess(data));
    // Reset form and close modal
    action.payload.navigate('/roles');
    showSuccess('Role updated successfully!');
    // Refresh list
    yield put({
      type: GET_ROLES,
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
      yield put(setRoleFieldErrors(error.response.data.errors));
    } else {
      yield put(updateRoleFail(error.response?.data || error.message));
    }
  }
}

function* deleteRoleSaga(action) {
  try {
    yield call(deleteRoleApi, action.payload);
    yield put(deleteRoleSuccess(action.payload));
    showSuccess('Role deleted successfully!');

    // Refresh list
    yield put({
      type: GET_ROLES,
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
    yield put(deleteRoleFail(error.response?.data || error.message));
  }
}

// Watcher Saga
function* rolesSaga() {
  yield takeEvery(GET_ROLES, getRolesSaga);
  yield takeEvery(ADD_ROLE, addRoleSaga);
  yield takeEvery(UPDATE_ROLE, updateRoleSaga);
  yield takeEvery(DELETE_ROLE, deleteRoleSaga);
}

export default rolesSaga;
