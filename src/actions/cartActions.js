import axios from 'axios';
import {
    ADD_TO_CART, 
    REMOVE_ITEM_CART, 
    SAVE_SHIPPING_INFO,
    FETCH_PROVINCES_REQUEST,
    FETCH_PROVINCES_SUCCESS,
    FETCH_PROVINCES_FAIL,
    FETCH_DISTRICTS_REQUEST,
    FETCH_DISTRICTS_SUCCESS,
    FETCH_DISTRICTS_FAIL,
    FETCH_WARDS_REQUEST,
    FETCH_WARDS_SUCCESS,
    FETCH_WARDS_FAIL, 
    CLEAR_CART,
    CLEAR_WARDS
} from '../constants/cartConstants';

import { SHOP_KIM_API } from '../config';

export const addItemToCartAction = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios({
        url: `${SHOP_KIM_API}/api/v1/product/${id}`,
        method: "GET",
    });
      
    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.payload._id,
            name: data.payload.name,
            price: data.payload.price,
            image: data.payload.images[0].url,
            stock: data.payload.stock,
            quantity
        }
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

export const removeItemFromCartAction = (id) => async (dispatch, getState) => {
    
    dispatch({
        type: REMOVE_ITEM_CART,
        payload: id
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

export const getProvincesAction = () => async (dispatch) => {
    try {
        dispatch({ type: FETCH_PROVINCES_REQUEST })

        const headers = {
            'Content-Type': 'application/json'
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/order/location`,
            method: "POST",
            headers
        });

        dispatch({
            type: FETCH_PROVINCES_SUCCESS,
            payload: data.payload.provinces
        })
    } catch (error) {
        dispatch({
            type: FETCH_PROVINCES_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        });
    }
}

export const getDistrictsAction = (locationData) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_DISTRICTS_REQUEST })

        const headers = {
            'Content-Type': 'application/json'
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/order/location`,
            method: "POST",
            data: locationData,
            headers
        });

        dispatch({
            type: FETCH_DISTRICTS_SUCCESS,
            payload: data.payload.districts
        })
    } catch (error) {
        dispatch({
            type: FETCH_DISTRICTS_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        })
    }
}

export const getWardsAction = (locationData) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_WARDS_REQUEST })

        const headers = {
            'Content-Type': 'application/json'
        };

        const { data } = await axios({
            url: `${SHOP_KIM_API}/api/v1/order/location`,
            method: "POST",
            data: locationData,
            headers
        });

        dispatch({
            type: FETCH_WARDS_SUCCESS,
            payload: data.payload.wards
        })
    } catch (error) {
        dispatch({
            type: FETCH_WARDS_FAIL,
            payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
        })
    }
}

export const saveShippingInfoAction = (data) => async (dispatch) => {
    
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    });

    localStorage.setItem('shippingInfo', JSON.stringify(data));
}

export const clearWardsAction = () => async (dispatch) => {
    dispatch({
      type: CLEAR_WARDS
    });
}

export const clearCartAction = () => (dispatch) => {
    dispatch({
        type: CLEAR_CART
    });
}
