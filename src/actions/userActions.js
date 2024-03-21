import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    NEW_PASSWORD_REQUEST,
    NEW_PASSWORD_SUCCESS,
    NEW_PASSWORD_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    CLEAR_ERRORS
} from '../constants/userConstants';

import { SHOP_KIM_API } from '../config';

import axios from 'axios';

export const getTokenAction = async(email, password) => {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/auth/login`,
            method: 'POST',
            data: {
                email,
                password
            },
            headers
        });
        const token = data.payload;
        localStorage.setItem('userToken', token);
        return token
    } catch (error) {
        return {
            success: false,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        }
    }
}

// Login
export const loginAction = (email, password) => async(dispatch) => {
    try {

        dispatch({ type: LOGIN_REQUEST });

        const token = await getTokenAction(email, password)
        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/auth/me`,
            method: 'GET',
            headers: {
                Authorization: `${token}`
            }
        });

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.payload
        })

    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        })
    }
}

export const getUserProfile = async(token) => {
    try {
        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/auth/me`,
            method: 'GET',
            headers: {
                Authorization: `${token}`
            }
        });

        return {
            success: true,
            data: {
                user: data.payload
            }
        }
    } catch (error) {
        return {
            success: false,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        }
    }
}

// Register user
export const registerAction = (userData) => async(dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST })

        const headers = {
            'Content-Type': 'multipart/form-data'
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/auth/register`,
            method: 'POST',
            data: userData,
            headers
        });

        const token = data.payload;
        
        const userProfile = await getUserProfile(token);
        const user = userProfile.data.user;

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: user
        });
    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        });
    }
}

// Load user
export const loadUserAction = () => async(dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST });

        const token = localStorage.getItem('userToken');

        if (token === null) throw new Error();
        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/auth/me`,
            method: 'GET',
            headers: {
                Authorization: `${token}`
            }
        });

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.payload
        });
    } catch (error) {
        let errorMessage = null;
        if (error.response?.data?.errors[0]?.message || error.response?.data?.errors[0]?.msg) {
            errorMessage = error.response.data.errors[0].message || error.response.data.errors[0].msg;
        }
        dispatch({       
            type: LOAD_USER_FAIL,
            payload: errorMessage
        });
    }
}

// Update profile
export const updateProfileAction = (userData) => async(dispatch) => {
    try {
        dispatch({ type: UPDATE_PROFILE_REQUEST })

        const localToken = localStorage.getItem('userToken');

        const headers = {
            'Content-Type': 'multipart/form-data',
            Authorization: `${localToken}`
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/auth/me/update`,
            method: 'PUT',
            data: userData,
            headers
        });

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        });
    }
}

// Update password
export const updatePasswordAction = (passwords) => async(dispatch) => {
    try {
        dispatch({ type: UPDATE_PASSWORD_REQUEST })

        const localToken = localStorage.getItem('userToken');

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `${localToken}`
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/auth/password/update`,
            method: 'PUT',
            data: passwords,
            headers
        });

        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        });
    }
}

// Forgot password
export const forgotPasswordAction = (email) => async(dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST })

        const headers = {
            'Content-Type': 'application/json'
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/auth/password/forgot`,
            method: 'POST',
            data: email,
            headers
        });

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.payload
        });
    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        });
    }
}

// Reset password
export const resetPasswordAction = (token, passwords) => async(dispatch) => {
    try {
        dispatch({ type: NEW_PASSWORD_REQUEST });

        const headers = {
            'Content-Type': 'application/json'
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/auth/password/reset/${token}`,
            method: 'PUT',
            data: passwords,
            headers
        });

        dispatch({
            type: NEW_PASSWORD_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatch({
            type: NEW_PASSWORD_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        });
    }
}

// Logout user
export const logoutAction = () => async(dispatch) => {
    try {
        const token = localStorage.getItem('userToken');

        await axios({
            url: `${SHOP_KIM_API}/api/v1/auth/logout`,
            method: 'GET',
            headers: {
                Authorization: `${token}`
            }
        });

        localStorage.removeItem('userToken');

        dispatch({
            type: LOGOUT_SUCCESS,
        });
    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        });
    }
}

// Get all users
export const allUsersAction = () => async(dispatch) => {
    try {
        dispatch({ type: ALL_USERS_REQUEST });

        const token = localStorage.getItem('userToken');

        if (token === null) throw new Error();

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/auth/admin/users`,
            method: 'GET',
            headers: {
                Authorization: `${token}`
            }
        });

        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.payload
        });
    } catch (error) {
        let errorMessage = null;
        if (error.response?.data?.errors[0]?.message || error.response.data.errors[0].msg) {
            errorMessage = error.response.data.errors[0].message || error.response.data.errors[0].msg;
        }
        dispatch({       
            type: ALL_USERS_FAIL,
            payload: errorMessage
        });
    }
}

// Update user - ADMIN
export const updateUserAction = (id, userData) => async(dispatch) => {
    try {
        dispatch({ type: UPDATE_USER_REQUEST })

        const token = localStorage.getItem('userToken');

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `${token}`
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/auth/admin/user/${id}`,
            method: 'PUT',
            data: userData,
            headers
        });

        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        });
    }
}

// Get user details - ADMIN
export const getUserDetailsAction = (id) => async(dispatch) => {
    try {
        dispatch({ type: USER_DETAILS_REQUEST })

        const token = localStorage.getItem('userToken');

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `${token}`
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/auth/admin/user/${id}`,
            method: 'GET',
            headers
        });

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.payload
        });
    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        });
    }
}

// Delete user - ADMIN
export const deleteUserAction = (id) => async(dispatch) => {
    try {
        dispatch({ type: DELETE_USER_REQUEST })

        const token = localStorage.getItem('userToken');

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `${token}`
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/auth/admin/user/${id}`,
            method: 'DELETE',
            headers
        });

        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        });
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
      type: CLEAR_ERRORS
    });
  }
