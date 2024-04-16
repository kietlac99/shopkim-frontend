import React, { Fragment, useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';

import MetaData from "../layout/MetaData";
import Loader from '../layout/Loader';
import Sidebar from './Sidebar';
import Confirm from '../layout/Confirm';

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getDeletedUsersAction, clearErrors } from '../../actions/userActions';
//import { RESTORE_DELETED_ORDER_RESET } from '../../constants/orderConstants';
import { CONFIRM_TYPE, CONFIRM_TO } from '../../config';

const DeletedUsers = ({ history }) => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, users } = useSelector(state => state.deletedUsers);
    //const { isRestored } = useSelector(state => state.order);

    // const [showConfirmation, setShowConfirmation] = useState(false);
    // const [orderIdToRestore, setOrderIdToRestore] = useState(null);

    useEffect(() => {
        dispatch(getDeletedUsersAction());

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        // if (isRestored) {
        //     alert.success('Đơn hàng khôi phục thành công!');
        //     history.push('/admin/orders/deleted')
        //     dispatch({ type: RESTORE_DELETED_ORDER_RESET });
        // }
    }, [dispatch, alert, error, /*isRestored*/, history]);

    const restoreUserHandler = (id) => {
        // setShowConfirmation(true);
        // setOrderIdToRestore(id);
    }

    const confirmRestoreHandler = () => {
        // dispatch(restoreDeletedOrderAction(orderIdToRestore));
        // setShowConfirmation(false);
    }

    const setUsers = () => {
        const data = {
            columns: [
                {
                    label: 'ID Người Dùng',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Tên',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc'
                },
                {
                    label: 'Quyền',
                    field: 'role',
                    sort: 'asc'
                },
                {
                    label: 'Thao tác',
                    field: 'actions'
                }
            ],
            rows: []
        };

        users.forEach(user => {
            data.rows.push({
                id: user?.value?._id,
                name: user?.value?.name,
                email: user?.value?.email,
                role: user?.value?.role,
                actions: 
                    <Fragment>
                        <button className='btn-danger py-1 px-2 ml-2' 
                        onClick={() => restoreUserHandler(user?.value?._id)}>
                            <i className='fa fa-history'></i>
                        </button>
                    </Fragment>
            })
        });

        return data;
    };
  return (
    <Fragment>
        <MetaData title={'Deleted Users'} />
        <div className='row'>
            <div className='col-12 col-md-2'>
                <Sidebar />
            </div>

            <div className='col-12 col-md-10'>
                <Fragment>
                    <h1 className='my-5'>Người Dùng Trong Thùng Rác</h1>

                    {loading ? <Loader /> : (
                        <MDBDataTable 
                            data={setUsers()}
                            className='px-3'
                            bordered
                            striped
                            hover
                        />
                    )}

                    {/* <Confirm
                        show={showConfirmation}
                        onClose={() => setShowConfirmation(false)}
                        onConfirm={confirmRestoreHandler}
                        confirmType={CONFIRM_TYPE.RESTORE}
                        type={CONFIRM_TO.ORDER}
                    /> */}
                </Fragment>
            </div>
        </div>
    </Fragment>
  )
}

export default DeletedUsers