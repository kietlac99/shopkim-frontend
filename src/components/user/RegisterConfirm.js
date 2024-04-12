import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { registerConfirmAction, clearErrors } from '../../actions/userActions';

const RegisterConfirm = ({ history, match }) => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const [showConfirmation, setShowConfirmation] = useState(true);
  
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

    useEffect(() => {
      return () => {
          setShowConfirmation(false); // Ẩn thông báo xác nhận đăng ký khi component unmounted
      };
  }, []);

  return (
    <Fragment>

    <MetaData title={'Register Confirm'} />

    {showConfirmation && (
        <div className="row justify-content-center">
          <div className="col-6 mt-5 text-center">
              <h2>Xác nhận đăng ký.</h2>
          </div>
        </div>
    )}
      
  </Fragment>
  )
};

export default RegisterConfirm;