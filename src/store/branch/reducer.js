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

const initialState = {
    branches: [],
    loading: false,
    error: null,
    fieldErrors: {},
}

const branchReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_BRANCHES:
            return { ...state, loading: true }
        case GET_BRANCHES_SUCCESS:
            return { ...state, loading: false, branches: action.payload }
        case GET_BRANCHES_FAIL:
            return { ...state, loading: false, error: action.payload }

        case ADD_BRANCH:
            return { ...state, loading: true }
        case ADD_BRANCH_SUCCESS:
            return { ...state, loading: false, fieldErrors: {} }
        case ADD_BRANCH_FAIL:
            return { ...state, loading: false, error: action.payload }

        case UPDATE_BRANCH:
            return { ...state, loading: true }
        case UPDATE_BRANCH_SUCCESS:
            return { ...state, loading: false, fieldErrors: {} }
        case UPDATE_BRANCH_FAIL:
            return { ...state, loading: false, error: action.payload }

        case DELETE_BRANCH:
            return { ...state, loading: true }
        case DELETE_BRANCH_SUCCESS:
            return { ...state, loading: false }
        case DELETE_BRANCH_FAIL:
            return { ...state, loading: false, error: action.payload }

        case SET_BRANCH_FIELD_ERRORS:
            return { ...state, fieldErrors: action.payload }

        default:
            return state
    }
}

export default branchReducer
