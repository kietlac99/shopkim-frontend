import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { 
    productsReducer, 
    productDetailsReducer, 
    newReviewReducer, 
    newProductReducer,
    productReducer,
    productReviewsReducer,
    reviewReducer,
    deletedProductsReducer,
    deletedReviewsReducer
} from './reducers/productReducers';
import { authReducer, userReducer, forgotPasswordReducer, allUsersReducer, userDetailsReducer, deletedUsersReducer } from './reducers/userReducers';
import { cartReducer, locationReducer } from './reducers/cartReducers';
import { newOrderReducer,
     myOrdersReducer, 
     orderDetailsReducer, 
     allOrdersReducer, 
     orderReducer, 
     deletedOrdersReducer,
     statisticsRevenueReducer 
    } from './reducers/orderReducers';

const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    newProduct: newProductReducer,
    product: productReducer,
    deletedProducts: deletedProductsReducer,
    productReviews: productReviewsReducer,
    review: reviewReducer,
    deletedReviews: deletedReviewsReducer,
    auth: authReducer,
    user: userReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    deletedUsers: deletedUsersReducer,
    forgotPassword: forgotPasswordReducer,
    location: locationReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    allOrders: allOrdersReducer,
    orderDetails: orderDetailsReducer,
    order: orderReducer,
    deletedOrders: deletedOrdersReducer,
    newReview: newReviewReducer,
    statisticsRevenue: statisticsRevenueReducer
});

let initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems') 
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingInfo: localStorage.getItem('shippingInfo')
            ? JSON.parse(localStorage.getItem('shippingInfo'))
            : {}
    }
};

const middleware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;