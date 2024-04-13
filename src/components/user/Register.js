import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { registerAction, clearErrors } from '../../actions/userActions';

const Register = ({ history }) => {

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setavatarPreview] = useState('/images/default_avatar.png');

  const alert = useAlert();
  const dispatch = useDispatch();

  const { error, loading, message } = useSelector(state => state.auth);

  useEffect(() => {
    if (message) {
      history.push('/login');
      alert.success(message);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error, message, history]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set('name', name);
    formData.set('email', email);
    formData.set('password', password);
    formData.set('avatarImageFile', avatar);

    dispatch(registerAction(formData));
  }

  const onChange = e => {
    if (e.target.name === 'avatar') {

      const reader = new FileReader();
      const img = e.target.files[0];

      reader.onload = () => {
        if (reader.readyState === 2) {
          setavatarPreview(reader.result);
          setAvatar(img);
        }
      }

      reader.readAsDataURL(e.target.files[0]);

    } else {
      setUser({ ...user, [e.target.name]: e.target.value })
    }
  }

  return (
    <Fragment>
      <MetaData title={'Register User'} />

      <div className="row wrapper">
		<div className="col-10 col-lg-5">
        <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
            <h1 className="mb-3">Đăng ký</h1>

          <div className="form-group">
            <label htmlFor="email_field">Tên</label>
            <input 
              type="name" 
              id="name_field" 
              className="form-control" 
              name="name"
              value={name}
              onChange={onChange}
            />
          </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={onChange}
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="password_field">Mật khẩu</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={onChange}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='avatar_upload'>Ảnh đại diện</label>
              <div className='d-flex align-items-center'>
                  <div>
                      <figure className='avatar mr-3 item-rtl'>
                          <img
                              src={avatarPreview}
                              className='rounded-circle'
                              alt='Avatar Preview'
                          />
                      </figure>
                  </div>
                  <div className='custom-file'>
                      <input
                          type='file'
                          name='avatar'
                          className='custom-file-input'
                          id='customFile'
                          accept="images/*"
                          onChange={onChange}
                      />
                      <label className='custom-file-label' htmlFor='customFile'>
                          Chọn ảnh đại diện
                      </label>
                  </div>
              </div>
          </div>
  
            <button
              id="register_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={ loading ? true : false }
            >
              ĐĂNG KÝ
            </button>
          </form>
		  </div>
    </div>
    </Fragment>
  )
}

export default Register