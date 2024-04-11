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
    }, []);

    useEffect(() => {
        if (error) {
          alert.error(error);
          dispatch(clearErrors());
        }
    
        if (isAuthenticated) { 
          history.push("/login");
        }
    }, [dispatch, alert, error, isAuthenticated, history]);

  return (
    <Fragment>

    <MetaData title={'Register Confirm'} />

    <div className="row justify-content-center">
      <div className="col-6 mt-5 text-center">

          <h2>Xác nhận đăng ký.</h2>
      </div>
    </div>
      
  </Fragment>
  )
};

export default RegisterConfirm;