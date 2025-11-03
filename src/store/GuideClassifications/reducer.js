import {
    GET_GUIDE_CLASSIFICATIONS,
    GET_GUIDE_CLASSIFICATIONS_SUCCESS,
    GET_GUIDE_CLASSIFICATIONS_FAIL,
    ADD_GUIDE_CLASSIFICATION,
    ADD_GUIDE_CLASSIFICATION_SUCCESS,
    ADD_GUIDE_CLASSIFICATION_FAIL,
    UPDATE_GUIDE_CLASSIFICATION,
    UPDATE_GUIDE_CLASSIFICATION_SUCCESS,
    UPDATE_GUIDE_CLASSIFICATION_FAIL,
    DELETE_GUIDE_CLASSIFICATION,
    DELETE_GUIDE_CLASSIFICATION_SUCCESS,
    DELETE_GUIDE_CLASSIFICATION_FAIL,
    SET_GUIDE_CLASSIFICATION_FIELD_ERRORS,
} from './actionTypes';

const initialState = {
    classifications: [],
    loading: false,
    error: null,
    fieldErrors: {},
};

const guideClassificationReducer = (state = initialState, action) => {
    switch (action.type) {
        // ======== GET ========
        case GET_GUIDE_CLASSIFICATIONS:
            return { ...state, loading: true };
        case GET_GUIDE_CLASSIFICATIONS_SUCCESS:
            return { ...state, loading: false, classifications: action.payload };
        case GET_GUIDE_CLASSIFICATIONS_FAIL:
            return { ...state, loading: false, error: action.payload };

        // ======== ADD ========
        case ADD_GUIDE_CLASSIFICATION:
            return { ...state, loading: true };
        case ADD_GUIDE_CLASSIFICATION_SUCCESS:
            return { ...state, loading: false, fieldErrors: {} };
        case ADD_GUIDE_CLASSIFICATION_FAIL:
            return { ...state, loading: false, error: action.payload };

        // ======== UPDATE ========
        case UPDATE_GUIDE_CLASSIFICATION:
            return { ...state, loading: true };
        case UPDATE_GUIDE_CLASSIFICATION_SUCCESS:
            return { ...state, loading: false, fieldErrors: {} };
        case UPDATE_GUIDE_CLASSIFICATION_FAIL:
            return { ...state, loading: false, error: action.payload };

        // ======== DELETE ========
        case DELETE_GUIDE_CLASSIFICATION:
            return { ...state, loading: true };
        case DELETE_GUIDE_CLASSIFICATION_SUCCESS:
            return { ...state, loading: false };
        case DELETE_GUIDE_CLASSIFICATION_FAIL:
            return { ...state, loading: false, error: action.payload };

        // ======== FIELD ERRORS ========
        case SET_GUIDE_CLASSIFICATION_FIELD_ERRORS:
            return { ...state, fieldErrors: action.payload, loading: false };

        // ======== DEFAULT ========
        default:
            return state;
    }
};

export default guideClassificationReducer;
