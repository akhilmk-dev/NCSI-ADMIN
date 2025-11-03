import {
    GET_STATISTICS,
    GET_STATISTICS_SUCCESS,
    GET_STATISTICS_FAIL,
    ADD_STATISTICS,
    ADD_STATISTICS_SUCCESS,
    ADD_STATISTICS_FAIL,
    UPDATE_STATISTICS,
    UPDATE_STATISTICS_SUCCESS,
    UPDATE_STATISTICS_FAIL,
    DELETE_STATISTICS,
    DELETE_STATISTICS_SUCCESS,
    DELETE_STATISTICS_FAIL,
    SET_STATISTICS_FIELD_ERRORS,
} from './actionTypes';

const initialState = {
    statistics: [],
    loading: false,
    error: null,
    fieldErrors: {},
};

const statisticsReducer = (state = initialState, action) => {
    switch (action.type) {
        // Get Statistics
        case GET_STATISTICS:
            return { ...state, loading: true };
        case GET_STATISTICS_SUCCESS:
            return { ...state, loading: false, statistics: action.payload };
        case GET_STATISTICS_FAIL:
            return { ...state, loading: false, error: action.payload };

        // Add Statistics
        case ADD_STATISTICS:
            return { ...state, loading: true };
        case ADD_STATISTICS_SUCCESS:
            return { ...state, loading: false, fieldErrors: {} };
        case ADD_STATISTICS_FAIL:
            return { ...state, loading: false, error: action.payload };

        // Update Statistics
        case UPDATE_STATISTICS:
            return { ...state, loading: true };
        case UPDATE_STATISTICS_SUCCESS:
            return { ...state, loading: false, fieldErrors: {} };
        case UPDATE_STATISTICS_FAIL:
            return { ...state, loading: false, error: action.payload };

        // Delete Statistics
        case DELETE_STATISTICS:
            return { ...state, loading: true };
        case DELETE_STATISTICS_SUCCESS:
            return { ...state, loading: false };
        case DELETE_STATISTICS_FAIL:
            return { ...state, loading: false, error: action.payload };

        // Field Errors
        case SET_STATISTICS_FIELD_ERRORS:
            return { ...state, fieldErrors: action.payload, loading: false };

        default:
            return state;
    }
};

export default statisticsReducer;
