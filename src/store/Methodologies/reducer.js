import {
    GET_METHODOLOGIES,
    GET_METHODOLOGIES_SUCCESS,
    GET_METHODOLOGIES_FAIL,
    ADD_METHODOLOGY,
    ADD_METHODOLOGY_SUCCESS,
    ADD_METHODOLOGY_FAIL,
    UPDATE_METHODOLOGY,
    UPDATE_METHODOLOGY_SUCCESS,
    UPDATE_METHODOLOGY_FAIL,
    DELETE_METHODOLOGY,
    DELETE_METHODOLOGY_SUCCESS,
    DELETE_METHODOLOGY_FAIL,
    SET_METHODOLOGY_FIELD_ERRORS,
} from './actionTypes';

const initialState = {
    methodologies: [],
    loading: false,
    error: null,
    fieldErrors: {},
};

const methodologyReducer = (state = initialState, action) => {
    switch (action.type) {
        // ======== GET ========
        case GET_METHODOLOGIES:
            return { ...state, loading: true };
        case GET_METHODOLOGIES_SUCCESS:
            return { ...state, loading: false, methodologies: action.payload };
        case GET_METHODOLOGIES_FAIL:
            return { ...state, loading: false, error: action.payload };

        // ======== ADD ========
        case ADD_METHODOLOGY:
            return { ...state, loading: true };
        case ADD_METHODOLOGY_SUCCESS:
            return { ...state, loading: false, fieldErrors: {} };
        case ADD_METHODOLOGY_FAIL:
            return { ...state, loading: false, error: action.payload };

        // ======== UPDATE ========
        case UPDATE_METHODOLOGY:
            return { ...state, loading: true };
        case UPDATE_METHODOLOGY_SUCCESS:
            return { ...state, loading: false, fieldErrors: {} };
        case UPDATE_METHODOLOGY_FAIL:
            return { ...state, loading: false, error: action.payload };

        // ======== DELETE ========
        case DELETE_METHODOLOGY:
            return { ...state, loading: true };
        case DELETE_METHODOLOGY_SUCCESS:
            return { ...state, loading: false };
        case DELETE_METHODOLOGY_FAIL:
            return { ...state, loading: false, error: action.payload };

        // ======== FIELD ERRORS ========
        case SET_METHODOLOGY_FIELD_ERRORS:
            return { ...state, fieldErrors: action.payload, loading: false };

        // ======== DEFAULT ========
        default:
            return state;
    }
};

export default methodologyReducer;
