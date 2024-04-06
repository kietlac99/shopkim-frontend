import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';

import MetaData from "../layout/MetaData";
import Loader from '../layout/Loader';

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { myOrdersAction, clearErrorsAction } from '../../actions/orderActions';

const ListOrders = () => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, orders } = useSelector(state => state.myOrders);

    useEffect(() => {
        dispatch(myOrdersAction());

        if (error) {
            alert.error(error);
            dispatch(clearErrorsAction());
        }
    }, [dispatch, alert, error]);

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Mã Đơn Đặt Hàng',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Số lượng loại sản phẩm',
                    field: 'numOfItems',
                    sort: 'asc'
                },
                {
                    label: 'Giá Tiền',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'Trạng thái',
                    field: 'status',
                    sort: 'asc'
                },
                {
                    label: 'Thao tác',
                    field: 'actions',
                    sort: 'asc'
                },
            ],
            rows: []
        };

        orders.forEach(order => {
            const formattedPrice = order?.totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: formattedPrice,
                status: order.orderStatus,
                actions: 
                    <Link to={`/order/details/${order._id}`} className='btn btn-primary'>
                        <i className='fa fa-eye'></i>
                    </Link>
            })
        });

        return data;
    }

  return (
    <Fragment>

        <MetaData title={'My Orders'} />

        <h1 className='my-5'>Đơn Hàng Của Tôi</h1>

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
  )
}

export default ListOrders