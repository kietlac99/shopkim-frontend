import React, { Fragment, useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { loginAction, googleLoginAction, clearErrors } from '../../actions/userActions';

import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import FacebookLogin from '@greatsumini/react-facebook-login';

import { FB_CLIENT_ID } from '../../config';


const Login = ({ history, location }) => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);

  const alert = useAlert();
  const dispatch = useDispatch();

  const { isAuthenticated, error, loading } = useSelector(state => state.auth);

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {

    if (isAuthenticated) {
      history.push(redirect);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, isAuthenticated, error, history, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(loginAction(email, password));
  }

  const responseSuccessGoogle = (response) => {
    const credentialDecode = jwtDecode(response.credential);
    const data = {
      name: credentialDecode.name,
      email: credentialDecode.email,
      provider: 'google',
      provideAccountId: credentialDecode.sub
    };
    dispatch(googleLoginAction(data));
  };

  const responseErrorGoogle = () => {
    alert.error('Đăng nhập không thành công!');
  };

  const responseSuccessFacebook = () => {
    alert.success('Đăng nhập thành công!');
  };

  const responseErrorFacebook = (error) => {
    alert.error('Đăng nhập không thành công! ', error);
  };

  const onProfileSuccessFacebook = (response) => {
    const { name, email, id } = response;
    const data = {
      name,
      email,
      provider: 'facebook',
      provideAccountId: id
    };
    dispatch(googleLoginAction(data));
  };

  return (
    <Fragment>
      { loading ? <Loader /> : (
        <Fragment>
          <MetaData title={'Login'}/>

          <div className="row wrapper"> 
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" onSubmit={submitHandler}>
                  <h1 className="mb-3">Đăng nhập</h1>
                  <div className="form-group">
                    <label htmlFor="email_field">Email</label>
                    <input
                      type="email"
                      id="email_field"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
        
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

                  <Link to="/password/forgot" className="float-right mb-4">Quên mật khẩu?</Link>
        
                  <button
                    id="login_button"
                    type="submit"
                    className="btn btn-block py-3"
                  >
                    ĐĂNG NHẬP
                  </button>

                  <div className="text-center mt-3">
                    <p>Hoặc đăng nhập bằng cách khác</p>
                    <div className="social-login-container">
                      <GoogleLogin
                          onSuccess={credentialResponse => {
                              responseSuccessGoogle(credentialResponse);
                          }}
                          onError={() => {
                              responseErrorGoogle();
                          }}
                      />
                      <FacebookLogin
                          appId={FB_CLIENT_ID}
                          onSuccess={() => {
                            responseSuccessFacebook();
                          }}
                          onFail={(error) => {
                            responseErrorFacebook(error);
                          }}
                          onProfileSuccess={(response) => {
                            onProfileSuccessFacebook(response);
                          }}
                          className="facebook-login-button"
                      >
                        <i className="fa fa-facebook-f" />
                      </FacebookLogin>
                    </div>
                  </div>

                  <Link to="/register" className="float-right mt-3">Tài khoản mới?</Link>
                </form>
            </div>
          </div>

        </Fragment>
      )}
    </Fragment>
  )
}

export default Login
