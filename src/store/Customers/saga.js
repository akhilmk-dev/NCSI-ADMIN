// saga.js

import { call, put, takeLatest } from 'redux-saga/effects'

import {
  FETCH_CUSTOMERS_REQUEST,
  ADD_CUSTOMER_REQUEST,
  UPDATE_CUSTOMER_REQUEST,
  DELETE_CUSTOMER_REQUEST,
} from './actionTypes'
import {
  fetchCustomersSuccess,
  fetchCustomersFailure,
  addCustomerSuccess,
  addCustomerFailure,
  updateCustomerSuccess,
  updateCustomerFailure,
  deleteCustomerSuccess,
  deleteCustomerFailure,
} from './actions'
import axiosInstance from 'pages/Utility/axiosInstance'
import toast from 'react-hot-toast'

// API calls
const fetchCustomersApi = async () => {
  return await axiosInstance.get('', { params: { sp: "usp_GetCustomers" } })
}

const addCustomerApi = async (customer) => {
  return await axiosInstance.post('', customer)
}

const updateCustomerApi = async (customer) => {
  return await axiosInstance.post(``, customer)
}

const deleteCustomerApi = async (customerId) => {
  return await axiosInstance.post(``, {
    "sp": "usp_DeleteCustomer",
    "customerId": customerId

  })
}

// Fetch customers
function* fetchCustomersSaga() {
  try {
    const response = yield call(fetchCustomersApi)
    yield put(fetchCustomersSuccess(response.data))
  } catch (error) {
    yield put(fetchCustomersFailure(error.message))
  }
}

// Add customer
function* addCustomerSaga(action) {
  try {
    const response = yield call(addCustomerApi, action.payload?.customer)
    yield put(addCustomerSuccess(response.data))
    action.payload.navigate(`/customerProfile/${response?.data?.Data?.[0]?.customerId}`)
    action.payload.resetForm()
    toast.success('Customer Created Successfully!')
    yield put({ type: FETCH_CUSTOMERS_REQUEST })
  } catch (error) {
    yield put(addCustomerFailure(error.message))
  }
}

// Update customer
function* updateCustomerSaga(action) {
  try {
    const response = yield call(updateCustomerApi, action.payload?.customer)
    yield put(updateCustomerSuccess(response.data))
    action.payload.navigate('/customers')
    action.payload.resetForm()
    toast.success('Customer Updated Successfully!')
    yield put({ type: FETCH_CUSTOMERS_REQUEST })
  } catch (error) {
    yield put(updateCustomerFailure(error.message))
  }
}

// Delete customer
function* deleteCustomerSaga(action) {
  try {
    yield call(deleteCustomerApi, action.payload)
    yield put(deleteCustomerSuccess(action.payload))
    toast.success('Customer Deleted Successfully!')
    yield put({ type: FETCH_CUSTOMERS_REQUEST })
  } catch (error) {
    yield put(deleteCustomerFailure(error.message))
  }
}

// Watcher saga
export default function* customerSaga() {
  yield takeLatest(FETCH_CUSTOMERS_REQUEST, fetchCustomersSaga)
  yield takeLatest(ADD_CUSTOMER_REQUEST, addCustomerSaga)
  yield takeLatest(UPDATE_CUSTOMER_REQUEST, updateCustomerSaga)
  yield takeLatest(DELETE_CUSTOMER_REQUEST, deleteCustomerSaga)
}
