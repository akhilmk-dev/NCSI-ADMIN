import {
    GET_BRANCHES,
    GET_BRANCHES_SUCCESS,
    GET_BRANCHES_FAIL,
    ADD_BRANCH,
    ADD_BRANCH_SUCCESS,
    ADD_BRANCH_FAIL,
    UPDATE_BRANCH,
    UPDATE_BRANCH_SUCCESS,
    UPDATE_BRANCH_FAIL,
    DELETE_BRANCH,
    DELETE_BRANCH_SUCCESS,
    DELETE_BRANCH_FAIL,
    SET_BRANCH_FIELD_ERRORS,
} from './actionTypes'

// Get Branches
export const getBranches = () => ({ type: GET_BRANCHES })
export const getBranchesSuccess = (branches) => ({ type: GET_BRANCHES_SUCCESS, payload: branches })
export const getBranchesFail = (error) => ({ type: GET_BRANCHES_FAIL, payload: error })

// Add Branch
export const addBranch = (branch) => ({ type: ADD_BRANCH, payload: branch })
export const addBranchSuccess = (branch) => ({ type: ADD_BRANCH_SUCCESS, payload: branch })
export const addBranchFail = (error) => ({ type: ADD_BRANCH_FAIL, payload: error })

// Update Branch
export const updateBranch = (branch) => ({ type: UPDATE_BRANCH, payload: branch })
export const updateBranchSuccess = (branch) => ({ type: UPDATE_BRANCH_SUCCESS, payload: branch })
export const updateBranchFail = (error) => ({ type: UPDATE_BRANCH_FAIL, payload: error })

// Delete Branch
export const deleteBranch = (id) => ({ type: DELETE_BRANCH, payload: id })
export const deleteBranchSuccess = (id) => ({ type: DELETE_BRANCH_SUCCESS, payload: id })
export const deleteBranchFail = (error) => ({ type: DELETE_BRANCH_FAIL, payload: error })

// Set Field Errors
export const setBranchFieldErrors = (errors) => ({ type: SET_BRANCH_FIELD_ERRORS, payload: errors })
