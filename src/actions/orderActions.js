import axios from 'axios';

import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_FAIL,
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    ALL_ORDERS_FAIL,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
    UPDATE_ORDER_FAIL,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    DELETED_ORDERS_REQUEST,
    DELETED_ORDERS_SUCCESS,
    DELETED_ORDERS_FAIL,
    RESTORE_DELETED_ORDER_REQUEST,
    RESTORE_DELETED_ORDER_SUCCESS,
    RESTORE_DELETED_ORDER_FAIL,
    STATISTICS_REVENUE_REQUEST,
    STATISTICS_REVENUE_SUCCESS,
    STATISTICS_REVENUE_FAIL,
    CLEAR_ERRORS,
} from '../constants/orderConstants';

import { SHOP_KIM_API, DELETED_TYPE } from '../config';

export const createOrderAction = (order) => async (dispatch, getState) => {
    try {

        dispatch({ type: CREATE_ORDER_REQUEST });

        const token = localStorage.getItem('userToken');

        if (token === null) throw new Error();

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/order/new`,
            method: "POST",
            data: order,
            headers
        });

        dispatch({
            type: CREATE_ORDER_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: CREATE_ORDER_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        });
    }
};

// Get currently logged in user orders
export const myOrdersAction = () => async (dispatch) => {
    try {

        dispatch({ type: MY_ORDERS_REQUEST });

        const token = localStorage.getItem('userToken');

        if (token === null) throw new Error();

        const headers = {
            'Authorization': `${token}`
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/order/orders/me`,
            method: "GET",
            headers
        });

        dispatch({
            type: MY_ORDERS_SUCCESS,
            payload: data.payload
        })
    } catch (error) {
        dispatch({
            type: MY_ORDERS_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        })
    }
}

// Get order details
export const getOrderDetailsAction = (id) => async (dispatch) => {
    try {

        dispatch({ type: ORDER_DETAILS_REQUEST });
        
        const token = localStorage.getItem('userToken');

        if (token === null) throw new Error();

        const headers = {
            'Authorization': `${token}`
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/order/${id}`,
            method: "GET",
            headers
        });

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data.payload
        })
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        })
    }
}

// Get all orders - ADMIN
export const allOrdersAction = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_ORDERS_REQUEST });
        
        const token = localStorage.getItem('userToken');

        if (token === null) throw new Error();

        const headers = {
            'Authorization': `${token}`
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/order/admin/orders`,
            method: "GET",
            headers
        });

        dispatch({
            type: ALL_ORDERS_SUCCESS,
            payload: data.payload
        })
    } catch (error) {
        dispatch({
            type: ALL_ORDERS_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        })
    }
}

// Update order
export const updateOrderAction = (id, orderData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_ORDER_REQUEST });

        const token = localStorage.getItem('userToken');

        if (token === null) throw new Error();

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/order/admin/order/${id}`,
            method: "PUT",
            data: orderData,
            headers
        });

        dispatch({
            type: UPDATE_ORDER_SUCCESS,
            payload: data.success
        });

    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        });
    }
};

// Delete order
export const deleteOrderAction = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_ORDER_REQUEST });

        const token = localStorage.getItem('userToken');

        if (token === null) throw new Error();

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/order/admin/order/${id}`,
            method: "DELETE",
            headers
        });

        dispatch({
            type: DELETE_ORDER_SUCCESS,
            payload: data.success
        });

    } catch (error) {
        dispatch({
            type: DELETE_ORDER_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        });
    }
};

export const getDeletedOrdersAction = () => async (dispatch) => {
    try {
        dispatch({ type: DELETED_ORDERS_REQUEST });

        const token = localStorage.getItem('userToken');

        if (token === null) throw new Error();

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/redis/scan`,
            method: 'POST',
            data: { 
                scanType: DELETED_TYPE.DELETED_ORDER, 
                keyword: ''
            },
            headers
        });

        dispatch({
            type: DELETED_ORDERS_SUCCESS,
            payload: data.payload
        })

    } catch (error) {
        dispatch({
            type: DELETED_ORDERS_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        })
    }
}

export const restoreDeletedOrderAction = (orderId) => async (dispatch) => {
    try {
        dispatch({ type: RESTORE_DELETED_ORDER_REQUEST });

        const token = localStorage.getItem('userToken');

        if (token === null) throw new Error();

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/order/restore-deleted-orders`,
            method: 'POST',
            data: { 
                keyword: orderId
            },
            headers
        });

        dispatch({ 
            type: RESTORE_DELETED_ORDER_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: RESTORE_DELETED_ORDER_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        })
    }
}

export const statisticsRevenueAction = (filterType) => async (dispatch) => {
    try {
        dispatch({ type: STATISTICS_REVENUE_REQUEST });
        const token = localStorage.getItem('userToken');

        if (token === null) throw new Error();

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/order/admin/revenue-statistics`,
            method: 'POST',
            data: filterType,
            headers
        });

        dispatch({ 
            type: STATISTICS_REVENUE_SUCCESS,
            payload: data.payload
        });
    } catch (error) {
        dispatch({
            type: STATISTICS_REVENUE_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        });
    }
}

// Clear Errors
export const clearErrorsAction = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
};
