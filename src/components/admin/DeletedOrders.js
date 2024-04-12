import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';

import MetaData from "../layout/MetaData";
import Loader from '../layout/Loader';
import Sidebar from './Sidebar';

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getDeletedOrdersAction, clearErrorsAction } from '../../actions/orderActions';

const DeletedOrders = () => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, orders } = useSelector(state => state.deletedOrders);

    useEffect(() => {
        dispatch(getDeletedOrdersAction());

        if (error) {
            alert.error(error);
            dispatch(clearErrorsAction());
        }
    }, [dispatch, alert, error]);

    const restoreOrderHandler = (id) => {

    }

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
            const formattedPrice = order?.value?.totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

            data.rows.push({
                id: order?.value?._id,
                numOfItems: order?.value?.orderItems.length,
                amount: formattedPrice,
                status: order?.value?.orderStatus,
                actions: 
                    <Fragment>
                        <button className='btn-danger py-1 px-2 ml-2' 
                        onClick={() => restoreOrderHandler(order?.value?._id)}>
                            <i className='fa fa-trash-restore'></i>
                        </button>
                    </Fragment>
            })
        });

        return data;
    };

  return (
    <Fragment>
        <MetaData title={'Deleted Orders'} />
        <div className='row'>
            <div className='col-12 col-md-2'>
                <Sidebar />
            </div>

            <div className='col-12 col-md-10'>
                <Fragment>
                    <h1 className='my-5'>Đơn Hàng Trong Thùng Rác</h1>

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

export default DeletedOrders