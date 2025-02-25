import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordAction, clearErrors } from '../../actions/userActions';

const NewPassword = ({ history, match }) => {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, success} = useSelector(state => state.forgotPassword);

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success('Mật khẩu mới đã được cập nhật thành công!');
            history.push('/login');
        }

    }, [dispatch, alert, error, success, history]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('password', password);
        formData.set('confirmPassword', confirmPassword);

        dispatch(resetPasswordAction(match.params.token, formData));
    }

  return (
    <Fragment>

        <MetaData title={'New Password Reset'} />

        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={submitHandler}>
                    <h1 className="mb-3">Mật Khẩu Mới</h1>

                    <div className="form-group">
                        <label htmlFor="password_field">Mật khẩu</label>
                        <input
                            type="password"
                            id="password_field"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm_password_field">Xác Nhận Mật Khẩu</label>
                        <input
                            type="password"
                            id="confirm_password_field"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        id="new_password_button"
                        type="submit"
                        className="btn btn-block py-3">
                        Cập Nhật Mật Khẩu
                    </button>

                </form>
            </div>
        </div>
        
    </Fragment>
  )
}

export default NewPassword