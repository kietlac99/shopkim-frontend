import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileAction, loadUserAction, clearErrors } from '../../actions/userActions';
import { UPDATE_PROFILE_RESET } from "../../constants/userConstants";

const UpdateProfile = ({ history }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setavatarPreview] = useState('/images/default_avatar.png');

    const alert = useAlert();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const { error, isUpdated, loading } = useSelector(state => state.user);

    useEffect(() => {

        if (user) {
            setName(user.name);
            setEmail(user.email);
            setavatarPreview(user.avatar.url);
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success('User updated successfully');
            dispatch(loadUserAction());

            history.push('/me');

            dispatch({
                type: UPDATE_PROFILE_RESET
            })
        }

    }, [dispatch, alert, error, history, isUpdated, user]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('avatarImageFile', avatar);

        dispatch(updateProfileAction(formData));
    }

    const onChange = e => {
        const reader = new FileReader();
        const img = e.target.files[0];

        reader.onload = () => {
            if (reader.readyState === 2) {
            setavatarPreview(reader.result);
            setAvatar(img);
            }
        }

        reader.readAsDataURL(e.target.files[0]);
    }

    return (
        <Fragment>
            <MetaData title={'Update Profile'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                        <h1 className="mt-2 mb-5">Cập nhật thông tin cá nhân</h1>

                        <div className="form-group">
                            <label htmlFor="email_field">Tên</label>
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
                                disabled='true'
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
                                        accept="image/*"
                                        onChange={onChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Chọn ảnh đại diện
                                </label>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3" 
                        disabled={ loading ? true : false }>Cập nhật</button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateProfile