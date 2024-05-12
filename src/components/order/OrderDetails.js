import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';

import MetaData from "../layout/MetaData";
import Loader from '../layout/Loader';

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetailsAction, clearErrorsAction } from '../../actions/orderActions';

const OrderDetails = ({ match }) => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, order = {} } = useSelector(state => state.orderDetails);

    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order;

    const formattedTotalPrice = totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    useEffect(() => {     
        dispatch(getOrderDetailsAction(match.params.id));
        
        if (error) {
            alert.error(error);
            dispatch(clearErrorsAction());
        }
    }, [dispatch, alert, error, match.params.id]);

    const shippingDetails = shippingInfo && `${shippingInfo.address}, 
    ${shippingInfo.location.ward}, ${shippingInfo.location.district}, ${shippingInfo.location.province}`;

    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false;

  return (
    <Fragment>
        <MetaData title={'Order Details'} />

        {loading ? <Loader /> : (
            <Fragment>
                <div className="row d-flex justify-content-between">
                    <div className="col-12 col-lg-8 mt-5 order-details">

                        <h3 className="my-5" style={{ whiteSpace: "nowrap" }}>Đơn Hàng # {order._id}</h3>

                        <h4 className="mb-4">Thông Tin Vận Chuyển</h4>
                        <p><b>Tên:</b> {user && user.name}</p>
                        <p><b>Số Điện Thoại:</b> {shippingInfo && shippingInfo.phoneNo}</p>
                        <p className="mb-4"><b>Địa Chỉ: </b>{shippingDetails}</p>
                        <p><b>Tổng tiền:</b> {formattedTotalPrice}</p>

                        <hr />

                        <h4 className="my-4">Thanh Toán</h4>
                        <p className={isPaid ? 'greenColor' : 'redColor'} ><b>
                        {isPaid ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}</b></p>


                        <h4 className="my-4">Trạng Thái Đơn Hàng:</h4>
                        <p className={order.orderStatus && String(order.orderStatus).includes('Đã giao') ? 'greenColor' : 'redColor'} >
                            <b>{orderStatus}</b></p>


                        <h4 className="my-4">Các Sản Phẩm Trong Đơn Hàng:</h4>

                        <hr />
                        <div className="cart-item my-1">
                            {orderItems && orderItems.map(item => (
                                <div key={item.product} className="row my-5">
                                    <div className="col-4 col-lg-2">
                                        <img src={item.image} alt={item.name} height="45" width="65" />
                                    </div>

                                    <div className="col-5 col-lg-5">
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </div>


                                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                        <p>{item?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                    </div>

                                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                        <p>{item.quantity} cái</p>
                                    </div>
                                </div>
                            ))}               
                        </div>
                        <hr />
                    </div>
                </div>
            </Fragment>
        )}

    </Fragment>
  )
}

export default OrderDetails