import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { updatePasswordAction, clearErrors } from '../../actions/userActions';
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";

const UpdatePassword = ({ history }) => {

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, isUpdated, loading } = useSelector(state => state.user);

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success('Password updated successfully');

            history.push('/me');

            dispatch({
                type: UPDATE_PASSWORD_RESET
            });
        }

    }, [dispatch, alert, error, history, isUpdated]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('oldPassword', oldPassword);
        formData.set('password', newPassword);
        formData.set('confirmPassword', confirmNewPassword)

        dispatch(updatePasswordAction(formData));
    }
  return (
    <Fragment>
        <MetaData title={'Change Password'} />

        <div className="row wrapper">
            <div className="col-10 col-lg-5" onSubmit={submitHandler}>
                <form className="shadow-lg">
                    <h3 className="mt-2 mb-5" style={{ whiteSpace: "nowrap" }}>Đổi mật khẩu</h3>
                    <div className="form-group">
                        <label for="old_password_field">Mật khẩu cũ</label>
                        <input
                            type="password"
                            id="old_password_field"
                            className="form-control"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label for="new_password_field">Mật khẩu mới</label>
                        <input
                            type="password"
                            id="new_password_field"
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label for="confirm_new_password_field">Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            id="confirm_new_password_field"
                            className="form-control"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn update-btn btn-block mt-4 mb-3"
                    disabled={ loading ? true : false } >Đổi mật khẩu</button>
                </form>
            </div>
        </div>
    </Fragment>
  )
}

export default UpdatePassword