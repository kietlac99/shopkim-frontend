import React, { Fragment, useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';

import MetaData from "../layout/MetaData";
import Loader from '../layout/Loader';
import Sidebar from './Sidebar';
import Confirm from '../layout/Confirm';

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getDeletedOrdersAction, restoreDeletedOrderAction, clearErrorsAction } from '../../actions/orderActions';
import { RESTORE_DELETED_ORDER_RESET } from '../../constants/orderConstants';
import { CONFIRM_TYPE, CONFIRM_TO } from '../../config';

const DeletedOrders = ({ history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, orders } = useSelector(state => state.deletedOrders);
    const { isRestored } = useSelector(state => state.order);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [orderIdToRestore, setOrderIdToRestore] = useState(null);

    useEffect(() => {
        dispatch(getDeletedOrdersAction());

        if (error) {
            alert.error(error);
            dispatch(clearErrorsAction());
        }

        if (isRestored) {
            alert.success('Đơn hàng khôi phục thành công!');
            history.push('/admin/orders/deleted')
            dispatch({ type: RESTORE_DELETED_ORDER_RESET });
        }
    }, [dispatch, alert, error, isRestored, history]);

    const restoreOrderHandler = (id) => {
        setShowConfirmation(true);
        setOrderIdToRestore(id);
    }

    const confirmRestoreHandler = () => {
        dispatch(restoreDeletedOrderAction(orderIdToRestore));
        setShowConfirmation(false);
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
                            <i className='fa fa-history'></i>
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
                    <h2 className='my-5'>Đơn Hàng Trong Thùng Rác</h2>

                    {loading ? <Loader /> : (
                        <MDBDataTable 
                            data={setOrders()}
                            className='px-3'
                            bordered
                            striped
                            hover
                        />
                    )}

                    <Confirm
                        show={showConfirmation}
                        onClose={() => setShowConfirmation(false)}
                        onConfirm={confirmRestoreHandler}
                        confirmType={CONFIRM_TYPE.RESTORE}
                        type={CONFIRM_TO.ORDER}
                    />
                </Fragment>
            </div>
        </div>
    </Fragment>
  )
}

export default DeletedOrders