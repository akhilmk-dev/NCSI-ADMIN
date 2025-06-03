// actions.js

import {
  FETCH_CUSTOMERS_REQUEST,
  FETCH_CUSTOMERS_SUCCESS,
  FETCH_CUSTOMERS_FAILURE,
  ADD_CUSTOMER_REQUEST,
  ADD_CUSTOMER_SUCCESS,
  ADD_CUSTOMER_FAILURE,
  UPDATE_CUSTOMER_REQUEST,
  UPDATE_CUSTOMER_SUCCESS,
  UPDATE_CUSTOMER_FAILURE,
  DELETE_CUSTOMER_REQUEST,
  DELETE_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_FAILURE,
} from './actionTypes'

// Fetch customers action creators
export const fetchCustomersRequest = () => ({
  type: FETCH_CUSTOMERS_REQUEST,
})

export const fetchCustomersSuccess = (customers) => ({
  type: FETCH_CUSTOMERS_SUCCESS,
  payload: customers,
})

export const fetchCustomersFailure = (error) => ({
  type: FETCH_CUSTOMERS_FAILURE,
  payload: error,
})

// Add customer action creators
export const addCustomerRequest = (customer, navigate, resetForm) => ({
  type: ADD_CUSTOMER_REQUEST,
  payload: { customer, navigate, resetForm },
})

export const addCustomerSuccess = (customer) => ({
  type: ADD_CUSTOMER_SUCCESS,
  payload: customer,
})

export const addCustomerFailure = (error) => ({
  type: ADD_CUSTOMER_FAILURE,
  payload: error,
})

// Update customer action creators
export const updateCustomerRequest = (customer, navigate, resetForm) => ({
  type: UPDATE_CUSTOMER_REQUEST,
  payload: { customer, navigate, resetForm },
})

export const updateCustomerSuccess = (customer) => ({
  type: UPDATE_CUSTOMER_SUCCESS,
  payload: customer,
})

export const updateCustomerFailure = (error) => ({
  type: UPDATE_CUSTOMER_FAILURE,
  payload: error,
})

// Delete customer action creators
export const deleteCustomerRequest = (customerId) => ({
  type: DELETE_CUSTOMER_REQUEST,
  payload: customerId,
})

export const deleteCustomerSuccess = (customerId) => ({
  type: DELETE_CUSTOMER_SUCCESS,
  payload: customerId,
})

export const deleteCustomerFailure = (error) => ({
  type: DELETE_CUSTOMER_FAILURE,
  payload: error,
})
