import { useEffect, useState } from "react";
import { HashRouter as Router, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";

// Admin Imports
import Dashboard from "./components/admin/Dashboard";
import ProductsList from "./components/admin/ProductsList";
import NewProduct from "./components/admin/NewProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import OrdersList from "./components/admin/OrdersList";
import ProcessOrder from "./components/admin/ProcessOrder";
import UsersList from "./components/admin/UsersList";
import UpdateUser from "./components/admin/UpdateUser";
import ProductReviews from "./components/admin/ProductReviews";
import DeletedOrders from './components/admin/DeletedOrders';
import DeletedUsers from "./components/admin/DeletedUsers";
import DeletedProducts from "./components/admin/DeletedProducts";
import DeletedReviews from "./components/admin/DeletedReviews";

// Cart Imports
import Cart from "./components/cart/Cart";
import Shipping from './components/cart/Shipping';
import ConfirmOrder from "./components/cart/ConfirmOrder";
import Payment from "./components/cart/Payment";

// Auth or User Imports
import Login from './components/user/Login';
import Register from './components/user/Register';
import RegisterConfirm from './components/user/RegisterConfirm';
import Profile from './components/user/Profile';
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";

// Order Imports
import ListOrders from "./components/order/ListOrders";
import OrderDetails from "./components/order/OrderDetails";
import OrderSuccess from "./components/cart/OrderSuccess";

import ProtectedRoute from './components/route/ProtectedRoute';
import { loadUserAction } from "./actions/userActions";
import { useSelector } from 'react-redux';
import store from './store';
import axios from "axios";

// Payment
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";

import { SHOP_KIM_API } from './config';

function App() {

  const [stripeApiKey, setStripeApiKey] = useState('');
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    store.dispatch(loadUserAction());
    
    async function getStripeApiKey() {
      const { data } = await axios({
        url: `${SHOP_KIM_API}/api/v1/payment/stripeapi`,
        method: 'GET',
        headers: {
            Authorization: `${token}`
        }
      });

      setStripeApiKey(data.payload.stripeApiKey);
    }
    if (token) getStripeApiKey();
  }, [token]);

  const { user, isAuthenticated, loading } = useSelector(state => state.auth);

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path="/" component={Home} exact />
          <Route path="/search/:keyword" component={Home} />
          <Route path="/product/:id" component={ProductDetails} exact />

          <Route path="/cart" component={Cart} exact />
          <ProtectedRoute path="/shipping" component={Shipping} />
          <ProtectedRoute path="/order/confirm" component={ConfirmOrder} />
          <ProtectedRoute path="/success" component={OrderSuccess} />
          {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path='/payment' component={Payment} />
            </Elements>
          }

          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} exact/>
          <Route path='/register/confirm/:email' component={RegisterConfirm} exact/>
          <Route path="/password/forgot" component={ForgotPassword} exact />
          <Route path="/password/reset/:token" component={NewPassword} exact />
          <ProtectedRoute path="/me" component={Profile} exact />
          <ProtectedRoute path="/me/update" component={UpdateProfile} exact />
          <ProtectedRoute path="/password/update" component={UpdatePassword} exact />

          <ProtectedRoute path="/orders/me" component={ListOrders} exact />
          <ProtectedRoute path="/order/details/:id" component={OrderDetails} exact />

        </div>

        <ProtectedRoute path="/dashboard" isAdmin={true} component={Dashboard} exact />
        <ProtectedRoute path="/admin/products" isAdmin={true} component={ProductsList} exact />
        <ProtectedRoute path="/admin/products/deleted" isAdmin={true} component={DeletedProducts} exact />
        <ProtectedRoute path="/admin/product" isAdmin={true} component={NewProduct} exact />
        <ProtectedRoute path="/admin/product/:id" isAdmin={true} component={UpdateProduct} exact />
        <ProtectedRoute path="/admin/orders" isAdmin={true} component={OrdersList} exact />
        <ProtectedRoute path="/admin/order/:id" isAdmin={true} component={ProcessOrder} exact />
        <ProtectedRoute path="/admin/orders/deleted" isAdmin={true} component={DeletedOrders} exact />
        <ProtectedRoute path="/admin/users" isAdmin={true} component={UsersList} exact />
        <ProtectedRoute path="/admin/user/:id" isAdmin={true} component={UpdateUser} exact />
        <ProtectedRoute path="/admin/users/deleted" isAdmin={true} component={DeletedUsers} exact />
        <ProtectedRoute path="/admin/reviews" isAdmin={true} component={ProductReviews} exact />
        <ProtectedRoute path="/admin/reviews/deleted" isAdmin={true} component={DeletedReviews} exact />

        {!loading && (!isAuthenticated || user.role !== 'admin') && (
          <Footer />
        )} 
      </div>
    </Router>
  );
}

export default App;
