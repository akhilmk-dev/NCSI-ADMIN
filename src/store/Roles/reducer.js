import {
  GET_ROLES,
  GET_ROLES_SUCCESS,
  GET_ROLES_FAIL,
  ADD_ROLE,
  ADD_ROLE_SUCCESS,
  ADD_ROLE_FAIL,
  UPDATE_ROLE,
  UPDATE_ROLE_SUCCESS,
  UPDATE_ROLE_FAIL,
  DELETE_ROLE,
  DELETE_ROLE_SUCCESS,
  DELETE_ROLE_FAIL,
  SET_ROLE_FIELD_ERRORS,
} from './actionTypes';

const initialState = {
  roles: [],
  loading: false,
  error: null,
  fieldErrors: {},
};

const rolesReducer = (state = initialState, action) => {
  switch (action.type) {
    // Get Roles
    case GET_ROLES:
      return { ...state, loading: true };
    case GET_ROLES_SUCCESS:
      return { ...state, loading: false, roles: action.payload };
    case GET_ROLES_FAIL:
      return { ...state, loading: false, error: action.payload };

    // Add Role
    case ADD_ROLE:
      return { ...state, loading: true };
    case ADD_ROLE_SUCCESS:
      return { ...state, loading: false, fieldErrors: {} };
    case ADD_ROLE_FAIL:
      return { ...state, loading: false, error: action.payload };

    // Update Role
    case UPDATE_ROLE:
      return { ...state, loading: true };
    case UPDATE_ROLE_SUCCESS:
      return { ...state, loading: false, fieldErrors: {} };
    case UPDATE_ROLE_FAIL:
      return { ...state, loading: false, error: action.payload };

    // Delete Role
    case DELETE_ROLE:
      return { ...state, loading: true };
    case DELETE_ROLE_SUCCESS:
      return { ...state, loading: false };
    case DELETE_ROLE_FAIL:
      return { ...state, loading: false, error: action.payload };

    // Field Errors
    case SET_ROLE_FIELD_ERRORS:
      return { ...state, fieldErrors: action.payload, loading: false };

    default:
      return state;
  }
};

export default rolesReducer;
