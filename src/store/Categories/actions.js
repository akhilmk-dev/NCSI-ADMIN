import {
  GET_CATEGORIES,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAIL,
  ADD_CATEGORIES,
  ADD_CATEGORIES_SUCCESS,
  ADD_CATEGORIES_FAIL,
  UPDATE_CATEGORIES,
  UPDATE_CATEGORIES_SUCCESS,
  UPDATE_CATEGORIES_FAIL,
  DELETE_CATEGORIES,
  DELETE_CATEGORIES_SUCCESS,
  DELETE_CATEGORIES_FAIL,
  SET_CATEGORY_FIELD_ERRORS,
} from './actionTypes'

// Get Categories
export const getCategories = () => ({
  type: GET_CATEGORIES,
})

export const getCategoriesSuccess = (categories) => ({
  type: GET_CATEGORIES_SUCCESS,
  payload: categories,
})

export const getCategoriesFail = (error) => ({
  type: GET_CATEGORIES_FAIL,
  payload: error,
})

// Add Category
export const addCategory = (category) => ({
  type: ADD_CATEGORIES,
  payload: category,
})

export const addCategorySuccess = (category) => ({
  type: ADD_CATEGORIES_SUCCESS,
  payload: category,
})

export const addCategoryFail = (error) => ({
  type: ADD_CATEGORIES_FAIL,
  payload: error,
})

// Update Category
export const updateCategory = (category) => ({
  type: UPDATE_CATEGORIES,
  payload: category,
})

export const updateCategorySuccess = (category) => ({
  type: UPDATE_CATEGORIES_SUCCESS,
  payload: category,
})

export const updateCategoryFail = (error) => ({
  type: UPDATE_CATEGORIES_FAIL,
  payload: error,
})

// Delete Category
export const deleteCategory = (id) => ({
  type: DELETE_CATEGORIES,
  payload: id,
})

export const deleteCategorySuccess = (id) => ({
  type: DELETE_CATEGORIES_SUCCESS,
  payload: id,
})

export const deleteCategoryFail = (error) => ({
  type: DELETE_CATEGORIES_FAIL,
  payload: error,
})

// Set Field Errors
export const setCategoryFieldErrors = (errors) => ({
  type: SET_CATEGORY_FIELD_ERRORS,
  payload: errors,
})
