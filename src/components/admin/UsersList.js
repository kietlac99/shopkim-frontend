import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';

import MetaData from "../layout/MetaData";
import Loader from '../layout/Loader';
import Confirm from '../layout/Confirm';
import Sidebar from './Sidebar';

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { allUsersAction, deleteUserAction, clearErrors } from '../../actions/userActions';
import { DELETE_USER_RESET } from '../../constants/userConstants';
import { CONFIRM_TYPE, CONFIRM_TO } from '../../config';

const UsersList = ({ history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, users = [] } = useSelector(state => state.allUsers);
    const { isDeleted } = useSelector(state => state.user);
    const { user: admin } = useSelector(state => state.auth);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    useEffect(() => {
        dispatch(allUsersAction());

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if(isDeleted) {
            alert.success('Người dùng xóa thành công!');
            history.push('/admin/users');
            dispatch({ type: DELETE_USER_RESET });
        }

    }, [dispatch, alert, error, isDeleted, history]);

    const deleteUserHandler = (id) => {
        setShowConfirmation(true);
        setUserIdToDelete(id);
        //dispatch(deleteUserAction(id));
    };

    const confirmDeleteHandler = () => {
        dispatch(deleteUserAction(userIdToDelete));
        setShowConfirmation(false);
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
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,

                actions: 
                    <Fragment>
                        <Link to={`/admin/user/${user._id}`} className='btn btn-primary py-1 px-2'>
                            <i className='fa fa-pencil'></i>
                        </Link>
                        <button className='btn-danger py-1 px-2 ml-2' 
                        disabled = {admin._id === user._id ? true : false}
                        onClick={() => deleteUserHandler(user._id)}>
                            <i className='fa fa-trash'></i>
                        </button>
                    </Fragment>
            })
        });

        return data;
    };

  return (
    <Fragment>
        <MetaData title={'All Users'} />
        <div className='row'>
            <div className='col-12 col-md-2'>
                <Sidebar />
            </div>

            <div className='col-12 col-md-10'>
                <Fragment>
                    <h1 className='my-5'>Tất Cả Người Dùng</h1>

                    {loading ? <Loader /> : (
                        <MDBDataTable 
                            data={setUsers()}
                            className='px-3'
                            bordered
                            striped
                            hover
                        />
                    )}

                    <Confirm
                        show={showConfirmation}
                        onClose={() => setShowConfirmation(false)}
                        onConfirm={confirmDeleteHandler}
                        confirmType={CONFIRM_TYPE.DELETE}
                        type={CONFIRM_TO.USER}
                    />
                </Fragment>
            </div>
        </div>
    </Fragment>
  )
};

export default UsersList;