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

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) { 
      history.push("/login");
    }
  }, [dispatch, alert, error, isAuthenticated, history, match.params.email]);
};

export default RegisterConfirm;