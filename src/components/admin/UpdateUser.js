import React, { Fragment, useEffect, useState } from "react";

import MetaData from "../layout/MetaData";
import Sidebar from './Sidebar';

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { updateUserAction, clearErrors, getUserDetailsAction } from '../../actions/userActions';
import { UPDATE_USER_RESET } from "../../constants/userConstants";

const UpdateUser = ({ history, match }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, isUpdated } = useSelector(state => state.user);
    const { user } = useSelector(state => state.userDetails);

    const userId = match.params.id;

    useEffect(() => {

        if (user && user._id !== userId) {
            dispatch(getUserDetailsAction(userId));
        } else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success('User updated successfully');
            dispatch(getUserDetailsAction(userId));
            history.push('/admin/users');

            dispatch({
                type: UPDATE_USER_RESET
            });
        }

    }, [dispatch, alert, error, history, isUpdated, userId, user]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('role', role);

        dispatch(updateUserAction(user._id, formData));
    }

  return (
    <Fragment>
        <MetaData title={`Update User`} />
        <div className='row'>
            <div className='col-12 col-md-2'>
                <Sidebar />
            </div>

            <div className='col-12 col-md-10'>
                <div className="row wrapper">
                    <div className="col-10 col-lg-5">
                        <form className="shadow-lg" onSubmit={submitHandler}>
                            <h1 className="mt-2 mb-5">Cập Nhật Người Dùng</h1>

                            <div className="form-group">
                                <label htmlFor="name_field">Tên</label>
                                <input 
                                    type="name" 
                                    id="name_field" 
                                    className="form-control"
                                    name='name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email_field">Email</label>
                                <input
                                    type="email"
                                    id="email_field"
                                    className="form-control"
                                    name='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                        <label htmlFor="role_field">Quyền</label>

                                        <select
                                            id="role_field"
                                            className="form-control"
                                            name='role'
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </div>

                            <button type="submit" className="btn update-btn btn-block mt-4 mb-3" >Cập Nhật</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Fragment>
  )
};

export default UpdateUser;