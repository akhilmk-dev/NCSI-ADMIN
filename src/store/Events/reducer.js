import {
    GET_EVENTS,
    GET_EVENTS_SUCCESS,
    GET_EVENTS_FAIL,
    ADD_EVENT,
    ADD_EVENT_SUCCESS,
    ADD_EVENT_FAIL,
    UPDATE_EVENT,
    UPDATE_EVENT_SUCCESS,
    UPDATE_EVENT_FAIL,
    DELETE_EVENT,
    DELETE_EVENT_SUCCESS,
    DELETE_EVENT_FAIL,
    SET_EVENT_FIELD_ERRORS,
} from './actionTypes';

const initialState = {
    events: [],
    loading: false,
    error: null,
    fieldErrors: {},
};

const eventReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EVENTS:
            return { ...state, loading: true };
        case GET_EVENTS_SUCCESS:
            return { ...state, loading: false, events: action.payload };
        case GET_EVENTS_FAIL:
            return { ...state, loading: false, error: action.payload };

        case ADD_EVENT:
            return { ...state, loading: true };
        case ADD_EVENT_SUCCESS:
            return { ...state, loading: false, fieldErrors: {} };
        case ADD_EVENT_FAIL:
            return { ...state, loading: false, error: action.payload };

        case UPDATE_EVENT:
            return { ...state, loading: true };
        case UPDATE_EVENT_SUCCESS:
            return { ...state, loading: false, fieldErrors: {} };
        case UPDATE_EVENT_FAIL:
            return { ...state, loading: false, error: action.payload };

        case DELETE_EVENT:
            return { ...state, loading: true };
        case DELETE_EVENT_SUCCESS:
            return { ...state, loading: false };
        case DELETE_EVENT_FAIL:
            return { ...state, loading: false, error: action.payload };

        case SET_EVENT_FIELD_ERRORS:
            return { ...state, fieldErrors: action.payload ,loading:false};

        default:
            return state;
    }
};

export default eventReducer;
