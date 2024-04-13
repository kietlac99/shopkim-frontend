import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { registerConfirmAction, clearErrors } from '../../actions/userActions';

const RegisterConfirm = ({ history, match }) => {

  const alert = useAlert();
  const dispatch = useDispatch();

  const { isAuthenticated, error } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(registerConfirmAction(match.params.email)); 
  }, [match.params.email]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated && !error) { 
      console.log(isAuthenticated);
      history.push("/login");
    }
  }, [dispatch, alert, error, isAuthenticated, history]);

  return (
    <Fragment>
      <div className="register-confirm-container">
        <MetaData title="Xác nhận đăng ký" />

        <div className="register-confirm-content">
          <h1>Xác nhận đăng ký</h1>
          <p>Xin vui lòng đợi trong khi chúng tôi xác nhận đăng ký của bạn...</p>
        </div>
      </div>
    </Fragment>
  );
};

export default RegisterConfirm;