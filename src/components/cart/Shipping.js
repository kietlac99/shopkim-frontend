import React, { Fragment, useEffect, useState } from 'react';

import MetaData from "../layout/MetaData";
import CheckoutSteps from './CheckoutSteps';

import { useDispatch, useSelector } from "react-redux";
import { clearWardsAction, getDistrictsAction, getProvincesAction, getWardsAction, saveShippingInfoAction } from '../../actions/cartActions';

const Shipping = ({ history }) => {

    const { shippingInfo } = useSelector(state => state.cart);

    const [address, setAddress] = useState(shippingInfo.address);
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);

    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');

    const provinces = useSelector(state => state.location.provinces);
    const districts = useSelector(state => state.location.districts);
    const wards = useSelector(state => state.location.wards);

    const dispatch = useDispatch({ history });

    useEffect(() => {
        dispatch(getProvincesAction());
        return () => {
            dispatch({ type: 'CLEAR_DISTRICTS_AND_WARDS' }); // Dispatch action to clear districts and wards
        };
    }, [dispatch]);

    const handleProvinceChange = (e) => {
        const selectedProvince = e.target.value;
        setProvince(selectedProvince);
        dispatch(clearWardsAction());
        dispatch(getDistrictsAction({ province: selectedProvince }));
    }

    const handleDistrictChange = (e) => {
        const selectedDistrict = e.target.value;
        setDistrict(selectedDistrict);
        dispatch(getWardsAction({ province, district: selectedDistrict}));
    }

    const handleWardChange = (e) => {
        const selectedWard = e.target.value;
        setWard(selectedWard);
    }

    const submitHandler = (e) => {
        e.preventDefault();

        const locationObj = { province, district, ward };

        dispatch(saveShippingInfoAction({ 
            address,
            location: locationObj,
            phoneNo 
        }));
        history.push('/order/confirm');
    };

    return (
        <Fragment>
            
            <MetaData title={'Shipping Info'} />

            <CheckoutSteps shipping />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler} >
                        <h1 className="mb-4">Thông tin giao hàng</h1>
                        <div className="form-group">
                            <label htmlFor="address_field">Địa chỉ</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="province_field">Tỉnh thành</label>
                            <select
                                id="province_field"
                                className="form-control"
                                value={province}
                                onChange={handleProvinceChange}
                                required
                            >
                                <option disabled="true" value="">Chọn tỉnh thành</option>
                                {provinces.map((province) => (
                                    <option key={province} value={province}>
                                        {province}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="district_field">Quận huyện</label>
                            <select
                                id="district_field"
                                className="form-control"
                                value={district}
                                onChange={handleDistrictChange}
                                required
                            >
                                <option disabled="true" value="">Chọn quận huyện</option>
                                {districts.map((district) => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="ward_field">Phường Xã</label>
                            <select
                                id="ward_field"
                                className="form-control"
                                value={ward}
                                onChange={handleWardChange}
                                required
                            >
                                <option disabled="true" value="">Chọn phường xã</option>
                                {wards.map((ward) => (
                                    <option key={ward} value={ward}>
                                        {ward}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone_field">Số điện thoại</label>
                            <input
                                type="phone"
                                id="phone_field"
                                className="form-control"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            id="shipping_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            Tiếp tục
                            </button>
                    </form>
                </div>
            </div>

        </Fragment>
    );
};

export default Shipping;