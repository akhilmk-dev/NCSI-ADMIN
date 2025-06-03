import { call, put, takeEvery } from 'redux-saga/effects'
import {
    GET_BRANCHES,
    ADD_BRANCH,
    UPDATE_BRANCH,
    DELETE_BRANCH,
} from './actionTypes'
import {
    getBranchesSuccess,
    getBranchesFail,
    addBranchSuccess,
    addBranchFail,
    updateBranchSuccess,
    updateBranchFail,
    deleteBranchSuccess,
    deleteBranchFail,
    setBranchFieldErrors,
} from './actions'
import axiosInstance from 'pages/Utility/axiosInstance'
import toast from 'react-hot-toast'

// API calls
const fetchBranchesApi = () => axiosInstance.get('', { params: { sp: 'usp_GetBranch' } })
const addBranchApi = (branch) => axiosInstance.post('', branch)
const updateBranchApi = (branch) => axiosInstance.post('', branch)
const deleteBranchApi = (id) => axiosInstance.post('', { sp: 'usp_DeleteBranch', branchId: id })

// Sagas
function* getBranchesSaga() {
    try {
        const { data } = yield call(fetchBranchesApi)
        yield put(getBranchesSuccess(data))
    } catch (error) {
        yield put(getBranchesFail(error.response?.data || error.message))
    }
}

function* addBranchSaga(action) {
    try {
        const { data } = yield call(addBranchApi, action.payload)
        yield put(addBranchSuccess(data))
        toast.success('Branch added successfully!')
        yield put({ type: GET_BRANCHES })
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
            yield put(setBranchFieldErrors(error.response.data.fieldErrors))
        } else {
            yield put(addBranchFail(error.response?.data || error.message))
        }
    }
}

function* updateBranchSaga(action) {
    try {
        const { data } = yield call(updateBranchApi, action.payload)
        yield put(updateBranchSuccess(data))
        toast.success('Branch updated successfully!')
        yield put({ type: GET_BRANCHES })
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
            yield put(setBranchFieldErrors(error.response.data.fieldErrors))
        } else {
            yield put(updateBranchFail(error.response?.data || error.message))
        }
    }
}

function* deleteBranchSaga(action) {
    try {
        yield call(deleteBranchApi, action.payload)
        yield put(deleteBranchSuccess(action.payload))
        toast.success('Branch deleted successfully!')
        yield put({ type: GET_BRANCHES })
    } catch (error) {
        yield put(deleteBranchFail(error.response?.data || error.message))
    }
}

// Watcher saga
function* branchSaga() {
    yield takeEvery(GET_BRANCHES, getBranchesSaga)
    yield takeEvery(ADD_BRANCH, addBranchSaga)
    yield takeEvery(UPDATE_BRANCH, updateBranchSaga)
    yield takeEvery(DELETE_BRANCH, deleteBranchSaga)
}

export default branchSaga
