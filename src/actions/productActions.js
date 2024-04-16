import axios from "axios";

import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  ADMIN_PRODUCTS_REQUEST,
  ADMIN_PRODUCTS_SUCCESS,
  ADMIN_PRODUCTS_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  GET_REVIEWS_REQUEST,
  GET_REVIEWS_SUCCESS,
  GET_REVIEWS_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  CLEAR_ERRORS,
  DELETED_PRODUCTS_REQUEST,
  DELETED_PRODUCTS_FAIL,
  DELETED_PRODUCTS_SUCCESS
} from '../constants/productConstants';

import { SHOP_KIM_API, DELETED_TYPE } from '../config';

export const getProducts = (keyword = '', currentPage = 1, price, category, rating = 0) => async (dispatch) => {
  try {

    dispatch({ type: ALL_PRODUCTS_REQUEST });

    let link = `${SHOP_KIM_API}/api/v1/product/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${rating}`;

    if (category) {
      link = `${SHOP_KIM_API}/api/v1/product/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}`;
    }

    const { data } = await axios({
      url: link,
      method: 'GET'
    });

    dispatch({ 
      type: ALL_PRODUCTS_SUCCESS,
      payload: data.payload
    });

  } catch (error) {
    dispatch({
      type: ALL_PRODUCTS_FAIL,
      payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
    })
  }
};

// Delete product (Admin)
export const deleteProductAction = (id) => async (dispatch) => {
  try {

    dispatch({ type: DELETE_PRODUCT_REQUEST });   

    const token = localStorage.getItem('userToken');

    if (token === null) throw new Error();

    const headers = {
        'Authorization': `${token}`
    };

    const { data } = await axios({
      url: `${SHOP_KIM_API}/api/v1/product/admin/${id}`,
      method: "DELETE",
      headers
    });

    dispatch({ 
      type: DELETE_PRODUCT_SUCCESS,
      payload: data.success
    });

  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
    });
  }
};

// Update Product (ADMIN)
export const updateProductAction = (id, productData) => async (dispatch) => {
  try {

    dispatch({ type: UPDATE_PRODUCT_REQUEST });   

    const token = localStorage.getItem('userToken');

    if (token === null) throw new Error();

    const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `${token}`
    };

    const { data } = await axios({
      url: `${SHOP_KIM_API}/api/v1/product/admin/${id}`,
      method: "PUT",
      data: productData,
      headers
    });

    dispatch({ 
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data.success
    });

  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
    });
  }
};

export const getProductDetails = (id) => async (dispatch) => {
  try {

    dispatch({ type: PRODUCT_DETAILS_REQUEST });   

    const { data } = await axios({
      url: `${SHOP_KIM_API}/api/v1/product/${id}`,
      method: "GET",
    });

    dispatch({ 
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.payload
    });

  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
    });
  }
};

export const newReviewAction = (reviewData) => async (dispatch) => {
  try {

    dispatch({ type: NEW_REVIEW_REQUEST });   

    const token = localStorage.getItem('userToken');

    if (token === null) throw new Error();

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
    };

    const { data } = await axios({
      url: `${SHOP_KIM_API}/api/v1/product/review`,
      method: "PUT",
      data: reviewData,
      headers
    });

    dispatch({ 
      type: NEW_REVIEW_SUCCESS,
      payload: data.success
    });

  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
    });
  }
};

export const newProductAction = (productData) => async (dispatch) => {
  try {

    dispatch({ type: NEW_PRODUCT_REQUEST });   

    const token = localStorage.getItem('userToken');

    if (token === null) throw new Error();

    const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `${token}`
    };

    const { data } = await axios({
      url: `${SHOP_KIM_API}/api/v1/product/admin/new`,
      method: "POST",
      data: productData,
      headers
    });

    dispatch({ 
      type: NEW_PRODUCT_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
    });
  }
};

export const getAdminProductsAction = () => async (dispatch) => {
  try {

    dispatch({ type: ADMIN_PRODUCTS_REQUEST });  
    
    const token = localStorage.getItem('userToken');

    if (token === null) throw new Error();

    const headers = {
        'Authorization': `${token}`
    };

    const { data } = await axios({
      url: `${SHOP_KIM_API}/api/v1/product/admin/products`,
      method: "GET",
      headers
    });

    dispatch({ 
      type: ADMIN_PRODUCTS_SUCCESS,
      payload: data.payload.products
    });

  } catch (error) {
    dispatch({
      type: ADMIN_PRODUCTS_FAIL,
      payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
    });
  }
};

// Get product reviews
export const getProductReviewsAction = (id) => async (dispatch) => {
  try {

    dispatch({ type: GET_REVIEWS_REQUEST });  
    
    const token = localStorage.getItem('userToken');

    if (token === null) throw new Error();

    const headers = {
        'Authorization': `${token}`
    };

    const { data } = await axios({
      url: `${SHOP_KIM_API}/api/v1/product/review/reviews?productId=${id}`,
      method: "GET",
      headers
    });

    dispatch({ 
      type: GET_REVIEWS_SUCCESS,
      payload: data.payload
    });

  } catch (error) {
    dispatch({
      type: GET_REVIEWS_FAIL,
      payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
    });
  }
};

// Delete product reviews
export const deleteReviewAction = (id, productId) => async (dispatch) => {
  try {

    dispatch({ type: DELETE_REVIEW_REQUEST });  
    
    const token = localStorage.getItem('userToken');

    if (token === null) throw new Error();

    const headers = {
        'Authorization': `${token}`
    };

    const { data } = await axios({
      url: `${SHOP_KIM_API}/api/v1/product/review/reviews?reviewId=${id}&productId=${productId}`,
      method: "DELETE",
      headers
    });

    dispatch({ 
      type: DELETE_REVIEW_SUCCESS,
      payload: data.success
    });

  } catch (error) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
    });
  }
};

export const getDeletedProductsAction = () => async (dispatch) => {
  try {
      dispatch({ type: DELETED_PRODUCTS_REQUEST });

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
              scanType: DELETED_TYPE.DELETED_PRODUCT, 
              keyword: ''
          },
          headers
      });

      dispatch({
          type: DELETED_PRODUCTS_SUCCESS,
          payload: data.payload
      })

  } catch (error) {
      dispatch({
          type: DELETED_PRODUCTS_FAIL,
          payload: error.response.data.errors[0].message || error.response.data.errors[0].msg
      })
  }
}

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS
  });
};
