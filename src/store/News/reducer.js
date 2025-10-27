import {
    GET_NEWS,
    GET_NEWS_SUCCESS,
    GET_NEWS_FAIL,
    ADD_NEWS,
    ADD_NEWS_SUCCESS,
    ADD_NEWS_FAIL,
    UPDATE_NEWS,
    UPDATE_NEWS_SUCCESS,
    UPDATE_NEWS_FAIL,
    DELETE_NEWS,
    DELETE_NEWS_SUCCESS,
    DELETE_NEWS_FAIL,
    SET_NEWS_FIELD_ERRORS,
} from './actionTypes';

const initialState = {
    news: [],
    loading: false,
    error: null,
    fieldErrors: {},
};

const newsReducer = (state = initialState, action) => {
    switch (action.type) {
        // Get News
        case GET_NEWS:
            return { ...state, loading: true };
        case GET_NEWS_SUCCESS:
            return { ...state, loading: false, news: action.payload };
        case GET_NEWS_FAIL:
            return { ...state, loading: false, error: action.payload };

        // Add News
        case ADD_NEWS:
            return { ...state, loading: true };
        case ADD_NEWS_SUCCESS:
            return { ...state, loading: false, fieldErrors: {} };
        case ADD_NEWS_FAIL:
            return { ...state, loading: false, error: action.payload };

        // Update News
        case UPDATE_NEWS:
            return { ...state, loading: true };
        case UPDATE_NEWS_SUCCESS:
            return { ...state, loading: false, fieldErrors: {} };
        case UPDATE_NEWS_FAIL:
            return { ...state, loading: false, error: action.payload };

        // Delete News
        case DELETE_NEWS:
            return { ...state, loading: true };
        case DELETE_NEWS_SUCCESS:
            return { ...state, loading: false };
        case DELETE_NEWS_FAIL:
            return { ...state, loading: false, error: action.payload };

        // Field Errors
        case SET_NEWS_FIELD_ERRORS:
            return { ...state, fieldErrors: action.payload, loading: false };

        default:
            return state;
    }
};

export default newsReducer;
