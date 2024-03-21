import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import MetaData from "../layout/MetaData";
import CheckoutSteps from './CheckoutSteps';

import { useSelector } from "react-redux";

const ConfirmOrder = ({ history }) => {

    const { cartItems, shippingInfo } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);

    // Calculate Order Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const shippingPrice = itemsPrice > 5000000 ? 0 : 50000;
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice +taxPrice).toFixed(2);

    const formattedItemPrice = itemsPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    const formattedShippingPrice = shippingPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    const formattedTaxPrice = taxPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    const formattedTotalPrice = totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const processToPayment = () => {
        const data = {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice
        }

        sessionStorage.setItem('orderInfo', JSON.stringify(data));
        history.push('/payment');
    }

  return (
    <Fragment>
        
        
        <MetaData title={'Confirm Order'} />

        <CheckoutSteps shipping  confirmOrder/>

        <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8 mt-5 order-confirm">

                <h4 className="mb-3">Thông Tin Giao Hàng</h4>
                <p><b>Tên:</b> {user && user.name}</p>
                <p><b>Số điện thoại:</b> {shippingInfo.phoneNo}</p>
                <p className="mb-4"><b>Địa chỉ:</b> {`${shippingInfo.address}, ${shippingInfo.location.ward}, ${shippingInfo.location.district}, ${shippingInfo.location.province}`}</p>
                
                <hr />
                <h4 className="mt-4">Sản Phẩm Trong Đơn Hàng Của Bạn:</h4>

                {cartItems.map(item => (
                    <Fragment>

                        <hr />
                        <div className="cart-item my-1" key={item.product}>
                            <div className="row">
                                <div className="col-4 col-lg-2">
                                    <img src={item.image} alt="Laptop" height="45" width="65"/>
                                </div>

                                <div className="col-5 col-lg-6">
                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                </div>


                                <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                    <p>{item.quantity} x {item.price} VNĐ = <b>{item.quantity * item.price} VNĐ</b></p>
                                </div>

                            </div>
                        </div>
                        <hr />

                    </Fragment>
                ))}

                

            </div>
			
			<div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4>Tổng Đơn Hàng</h4>
                        <hr />
                        <p>Giá tiền:  <span className="order-summary-values">{formattedItemPrice} VNĐ</span></p>
                        <p>Tiền giao hàng: <span className="order-summary-values">{formattedShippingPrice} VNĐ</span></p>
                        <p>Tiền thuế:  <span className="order-summary-values">{formattedTaxPrice} VNĐ</span></p>

                        <hr />

                        <p>Tổng tiền: <span className="order-summary-values">{formattedTotalPrice} VNĐ</span></p>

                        <hr />
                        <button id="checkout_btn" className="btn btn-primary btn-block"
                        onClick={processToPayment}>Đến Phần Thanh Toán</button>
                    </div>
                </div>
			
			
        </div>

    </Fragment>
  )
}

export default ConfirmOrder