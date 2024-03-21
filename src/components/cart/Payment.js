import React, { Fragment, useEffect } from 'react';

import MetaData from "../layout/MetaData";
import CheckoutSteps from './CheckoutSteps';

import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from "react-redux";

import { createOrderAction, clearErrorsAction } from '../../actions/orderActions';
import { clearCartAction } from '../../actions/cartActions';

import { 
    useStripe, 
    useElements, 
    CardNumberElement, 
    CardExpiryElement, 
    CardCvcElement 
} from '@stripe/react-stripe-js';

import { SHOP_KIM_API } from '../../config';

import axios from 'axios';

const options = {
    style: {
        base: {
            fontSize: '16px'
        },
        invalid: {
            color: '#9e2146'
        }
    }
}

const Payment = ({ history }) => {

    const alert = useAlert();
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const { cartItems, shippingInfo } = useSelector(state => state.cart);
    const { loading, error } = useSelector(state => state.newOrder);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrorsAction());
          }
    }, [dispatch, alert, error]);

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice)
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        document.querySelector('#pay_btn').disabled = true;

        let res;

        try {

            const token = localStorage.getItem('userToken');

            const headers = {
                'Content-Type': 'application/json',
                Authorization: `${token}`
            };   

            res = await axios({
                url: `${SHOP_KIM_API}/api/v1/payment/stripe-process`,
                method: 'POST',
                data: paymentData,
                headers
            });

            const clientSecret = res.data.payload.client_secret;

            if (!stripe || !elements) {
                return;
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email
                    }
                }
            });

            if (result.error) {
                alert.error(result.error.message);
                document.querySelector('#pay_btn').disabled = false;
            } else {

                // The payment is processed or not
                if (result.paymentIntent.status === 'succeeded') {

                    const paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    }

                    const createOrderData = {
                        orderItems: cartItems,
                        shippingInfo,
                        itemsPrice: orderInfo.itemsPrice,
                        taxPrice: orderInfo.taxPrice,
                        shippingPrice: orderInfo.shippingPrice,
                        totalPrice: orderInfo.totalPrice,
                        paymentInfo
                    }
                    dispatch(createOrderAction(createOrderData));
                    dispatch(clearCartAction());

                    history.push('/success');
                } else {
                    alert.error('Có lỗi khi đang thanh toán!')
                }
            }

        } catch (error) {
            document.querySelector('#pay_btn').disabled = false;
            alert.error(error.response.data.errors[0].message);
        }
    };

  return (
    <Fragment>
        <MetaData title={'Payment'} />

        <CheckoutSteps shipping confirmOrder payment />

        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={submitHandler}>
                    <h1 className="mb-4">Thông Tin Thẻ</h1>
                    <div className="form-group">
                        <label htmlFor="card_num_field">Số Thẻ</label>
                        <CardNumberElement
                            type="text"
                            id="card_num_field"
                            className="form-control"
                            options={options}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="card_exp_field">Ngày Hết Hạn Thẻ</label>
                        <CardExpiryElement
                            type="text"
                            id="card_exp_field"
                            className="form-control"
                            options={options}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="card_cvc_field">CVC</label>
                        <CardCvcElement
                            type="text"
                            id="card_cvc_field"
                            className="form-control"
                            options={options}
                        />
                    </div>
        
                
                    <button
                    id="pay_btn"
                    type="submit"
                    className="btn btn-block py-3"
                    disabled= {loading ? true : false}
                    >
                        Thanh Toán {` - ${orderInfo && orderInfo.totalPrice}`}
                    </button>
        
                </form>
			</div>
        </div>
        
    </Fragment>
  )
}

export default Payment