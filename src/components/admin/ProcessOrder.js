import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import MetaData from "../layout/MetaData";
import Loader from '../layout/Loader';
import Sidebar from './Sidebar';

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetailsAction, updateOrderAction, clearErrorsAction } from '../../actions/orderActions';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';

import { formattedVND } from '../../utils/formatedNumber';

const ProcessOrder = ({ match }) => {

    const [status, setStatus] = useState('');

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, order } = useSelector(state => state.orderDetails);
    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order;
    const { error, isUpdated } = useSelector(state => state.order);
    
    const orderId = match.params.id;

    useEffect(() => {

        dispatch(getOrderDetailsAction(orderId));

        if (error) {
            alert.error(error);
            dispatch(clearErrorsAction());
        }

        if(isUpdated) {
            dispatch(getOrderDetailsAction(orderId));
            alert.success('Đơn Hàng cập nhật thành công!');
            dispatch({ type: UPDATE_ORDER_RESET });
        }
    }, [dispatch, alert, error, isUpdated, orderId]);

    const updateOrderHandler = (id) => {
    
        const formData = new FormData();
        formData.set('orderStatus', status);
    
        dispatch(updateOrderAction(id, formData));
    };

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.location.ward}, ${shippingInfo.location.district}, ${shippingInfo.location.province}`;
    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false;

  return (
    <Fragment>
        <MetaData title={`Process Order # ${order && order._id}`} />
        <div className='row'>
            <div className='col-12 col-md-2'>
                <Sidebar />
            </div>

            <div className='col-12 col-md-10'>
                <Fragment>
                    {loading ? <Loader /> : (
                        <div className="row d-flex justify-content-around">
                            <div className="col-12 col-lg-7 order-details">
        
                                <h2 className="my-5">Order # {order._id}</h2>
        
                                <h4 className="mb-4">Thông Tin Giao Hàng</h4>
                                <p><b>Tên:</b> {user && user.name}</p>
                                <p><b>Số Điện Thoại:</b> {shippingInfo && shippingInfo.phoneNo}</p>
                                <p className="mb-4"><b>Địa chỉ:</b>{shippingDetails}</p>
                                <p><b>Tổng Tiền:</b> {totalPrice && formattedVND(totalPrice)} VNĐ</p>
        
                                <hr />
        
                                <h4 className="my-4">Thanh Toán</h4>
                                <p className={isPaid ? 'greenColor' : 'redColor'} ><b>
                                {isPaid ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}</b></p>

                                <h4 className="my-4">Stripe ID</h4>
                                <p><b>{paymentInfo && paymentInfo.id}</b></p>


                                <h4 className="my-4">Trạng Thái Đơn Hàng:</h4>
                                <p className={order.orderStatus && String(order.orderStatus).includes('Đã giao') ? 'greenColor' : 'redColor'} >
                                    <b>{orderStatus}</b></p>
        
                                <h4 className="my-4">Sản Phẩm Trong Đơn Hàng:</h4>
        
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
                                                <p>{formattedVND(item.price)}</p>
                                            </div>

                                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                <p>{item.quantity} cái</p>
                                            </div>
                                        </div>
                                    ))}   
                                </div>
                                <hr />
                            </div>
                        
                            <div className="col-12 col-lg-3 mt-5">
                                <h4 className="my-4">Trạng Thái</h4>

                                <div className="form-group">
                                    <select
                                        className="form-control"
                                        name='status'
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value=''>Chọn Trạng Thái Đơn Hàng</option>
                                        <option value="Đang xử lý">Đang xử lý</option>
                                        <option value="Đang giao">Đang giao</option>
                                        <option value="Đã giao">Đã giao</option>
                                    </select>
                                </div>

                                <button className="btn btn-primary btn-block" onClick={() => 
                                updateOrderHandler(order._id)}>
                                    Cập Nhật Trạng Thái
                                </button>
                            </div>
                        
                        </div>
                    )}
                </Fragment>
            </div>
        </div>
    </Fragment>
  )
}

export default ProcessOrder