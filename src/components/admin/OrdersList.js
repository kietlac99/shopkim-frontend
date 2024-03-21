import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';

import MetaData from "../layout/MetaData";
import Loader from '../layout/Loader';
import Sidebar from './Sidebar';

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { allOrdersAction, deleteOrderAction, clearErrorsAction } from '../../actions/orderActions';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';

const OrdersList = ({ history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, orders } = useSelector(state => state.allOrders);
    const { isDeleted } = useSelector(state => state.order);

    useEffect(() => {
        dispatch(allOrdersAction());

        if (error) {
            alert.error(error);
            dispatch(clearErrorsAction());
        }

        if(isDeleted) {
            alert.success('Đơn hàng xóa thành công!');
            history.push('/admin/orders');
            dispatch({ type: DELETE_ORDER_RESET });
        }
    }, [dispatch, alert, error, isDeleted, history]);

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrderAction(id));
    };

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Số Lượng Loại Sản Phẩm',
                    field: 'numOfItems',
                    sort: 'asc'
                },
                {
                    label: 'Tiền Đơn Hàng',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'Trạng Thái',
                    field: 'status',
                    sort: 'asc'
                },
                {
                    label: 'Thao tác',
                    field: 'actions'
                }
            ],
            rows: []
        };

        orders.forEach(order => {
            const formattedPrice = order?.totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: formattedPrice,
                status: order.orderStatus && String(order.orderStatus).includes('Đã giao')
                        ? <p style={{ color: 'green' }}>{order.orderStatus}</p>
                        : <p style={{ color: 'red' }}>{order.orderStatus}</p>,
                actions: 
                    <Fragment>
                        <Link to={`/admin/order/${order._id}`} className='btn btn-primary py-1 px-2'>
                            <i className='fa fa-eye'></i>
                        </Link>
                        <button className='btn-danger py-1 px-2 ml-2' 
                        onClick={() => deleteOrderHandler(order._id)}>
                            <i className='fa fa-trash'></i>
                        </button>
                    </Fragment>
            })
        });

        return data;
    };

  return (
    <Fragment>
        <MetaData title={'All Orders'} />
        <div className='row'>
            <div className='col-12 col-md-2'>
                <Sidebar />
            </div>

            <div className='col-12 col-md-10'>
                <Fragment>
                    <h1 className='my-5'>Tất Cả Đơn Hàng</h1>

                    {loading ? <Loader /> : (
                        <MDBDataTable 
                            data={setOrders()}
                            className='px-3'
                            bordered
                            striped
                            hover
                        />
                    )}
                </Fragment>
            </div>
        </div>
    </Fragment>
  )
}

export default OrdersList