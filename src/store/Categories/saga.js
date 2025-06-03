import { call, put, takeEvery } from 'redux-saga/effects'
import {
  GET_CATEGORIES,
  ADD_CATEGORIES,
  UPDATE_CATEGORIES,
  DELETE_CATEGORIES,
} from './actionTypes'
import {
  getCategoriesSuccess,
  getCategoriesFail,
  addCategorySuccess,
  addCategoryFail,
  updateCategorySuccess,
  updateCategoryFail,
  deleteCategorySuccess,
  deleteCategoryFail,
  setCategoryFieldErrors,
} from './actions'
import axiosInstance from 'pages/Utility/axiosInstance'
import toast from 'react-hot-toast'

// API calls
const fetchCategoriesApi = () => axiosInstance.get('', { params: { sp: 'usp_GetCatalogueCategories' } })
const addCategoryApi = (category) => axiosInstance.post('', category)
const updateCategoryApi = (category) => axiosInstance.post('', category)
const deleteCategoryApi = (id) => axiosInstance.post('', { sp: 'usp_DeleteCatalogueCategory', categoryId: id })

// Sagas
function* getCategoriesSaga() {
  try {
    const { data } = yield call(fetchCategoriesApi)
    yield put(getCategoriesSuccess(data))
  } catch (error) {
    yield put(getCategoriesFail(error.response?.data || error.message))
    toast.error('Failed to fetch categories!')
  }
}

function* addCategorySaga(action) {
  try {
    const { data } = yield call(addCategoryApi, action.payload)
    yield put(addCategorySuccess(data))
    toast.success('Category added successfully!')
    yield put({ type: GET_CATEGORIES })
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
      yield put(setCategoryFieldErrors(error.response.data.fieldErrors))
    } else {
      yield put(addCategoryFail(error.response?.data || error.message))
    }
  }
}

function* updateCategorySaga(action) {
  try {
    const { data } = yield call(updateCategoryApi, action.payload)
    yield put(updateCategorySuccess(data))
    toast.success('Category updated successfully!')
    yield put({ type: GET_CATEGORIES })
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.fieldErrors) {
      yield put(setCategoryFieldErrors(error.response.data.fieldErrors))
    } else {
      yield put(updateCategoryFail(error.response?.data || error.message))
    }
  }
}

function* deleteCategorySaga(action) {
  try {
    yield call(deleteCategoryApi, action.payload)
    yield put(deleteCategorySuccess(action.payload))
    toast.success('Category deleted successfully!')
    yield put({ type: GET_CATEGORIES })
  } catch (error) {
    yield put(deleteCategoryFail(error.response?.data || error.message))
  }
}

// Watcher saga
function* categorySaga() {
  yield takeEvery(GET_CATEGORIES, getCategoriesSaga)
  yield takeEvery(ADD_CATEGORIES, addCategorySaga)
  yield takeEvery(UPDATE_CATEGORIES, updateCategorySaga)
  yield takeEvery(DELETE_CATEGORIES, deleteCategorySaga)
}

export default categorySaga
