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
    UPDATE_ORDER_RESET,
    UPDATE_ORDER_FAIL,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_RESET,
    DELETE_ORDER_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    DELETED_ORDERS_REQUEST,
    DELETED_ORDERS_SUCCESS,
    DELETED_ORDERS_FAIL,
    RESTORE_DELETED_ORDER_REQUEST,
    RESTORE_DELETED_ORDER_SUCCESS,
    RESTORE_DELETED_ORDER_RESET,
    RESTORE_DELETED_ORDER_FAIL,
    STATISTICS_REVENUE_REQUEST,
    STATISTICS_REVENUE_SUCCESS,
    STATISTICS_REVENUE_FAIL,
    CLEAR_ERRORS
} from '../constants/orderConstants';

export const newOrderReducer = (state = {}, action) => {
    switch (action.type) {

        case CREATE_ORDER_REQUEST:
            return {
                ...state,
                loading: true
            }

        case CREATE_ORDER_SUCCESS:
            return {
                loading: false,
                order: action.payload
            }

        case CREATE_ORDER_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
};

export const myOrdersReducer = (state = { orders: [] }, action) => {
    switch (action.type) {

        case MY_ORDERS_REQUEST:
            return {
                loading: true
            }

        case MY_ORDERS_SUCCESS:
            return {
                loading: false,
                orders: action.payload
            }

        case MY_ORDERS_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
};

export const orderDetailsReducer = (state = { order: {} }, action) => {
    switch (action.type) {

        case ORDER_DETAILS_REQUEST:
            return {
                loading: true,
                order: { 
                    shippingInfo: { 
                        address: '', 
                        location: { 
                            ward: '',
                            province: '', 
                            district: ''
                        }
                    }, 
                    orderItems: [], 
                    paymentInfo: {
                        id: '',
                        status: ''
                    }, 
                    user: null, 
                    totalPrice: 0, 
                    orderStatus: ''
                } 
            }

        case ORDER_DETAILS_SUCCESS:
            return {
                loading: false,
                order: action.payload
            }

        case ORDER_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
};

export const allOrdersReducer = (state = { orders: [] }, action) => {
    switch (action.type) {

        case ALL_ORDERS_REQUEST:
            return {
                loading: true
            }

        case ALL_ORDERS_SUCCESS:
            return {
                loading: false,
                orders: action.payload.orders,
                totalAmount: action.payload.total
            }

        case ALL_ORDERS_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
};

export const orderReducer = (state = {}, action ) => {
    switch (action.type) {

        case UPDATE_ORDER_REQUEST:
        case DELETE_ORDER_REQUEST:
        case RESTORE_DELETED_ORDER_REQUEST:
            return {
                ...state,
                loading: true
            }

        case UPDATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }

        case DELETE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }
        
        case RESTORE_DELETED_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                isRestored: action.payload
            }
        
        case UPDATE_ORDER_FAIL:
        case DELETE_ORDER_FAIL:
        case RESTORE_DELETED_ORDER_FAIL:
            return {
                ...state,
                error: action.payload
            }
        
        case UPDATE_ORDER_RESET:
            return {
                ...state,
                isUpdated: false
            }

        case DELETE_ORDER_RESET:
            return {
                ...state,
                isDeleted: false
            }  

        case RESTORE_DELETED_ORDER_RESET:
            return {
                ...state,
                isRestored: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

export const deletedOrdersReducer = (state = { orders : [] }, action) => {
    switch (action.type) {
        case DELETED_ORDERS_REQUEST:
            return {
                loading: true
            }

        case DELETED_ORDERS_SUCCESS:
            return {
                loading: false,
                orders: action.payload
            }
        
        case DELETED_ORDERS_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

export const statisticsRevenueReducer = (state = { statistic: {} }, action) => {
    switch(action.type) {
        case STATISTICS_REVENUE_REQUEST:
            return {
                loading: true
            }

        case STATISTICS_REVENUE_SUCCESS:
            return {
                loading: false,
                statistic: action.payload
            }

        case STATISTICS_REVENUE_FAIL:
            return {
                loading: false,
                statistic: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}
