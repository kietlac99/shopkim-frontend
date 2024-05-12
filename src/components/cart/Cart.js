import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import MetaData from "../layout/MetaData";

//import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCartAction, removeItemFromCartAction } from '../../actions/cartActions';

import { formattedVND } from '../../utils/formatedNumber';

const Cart = ({ history }) => {

    const dispatch = useDispatch();

    const { cartItems } = useSelector(state => state.cart);

    const removeCartItemHandler = (id) => {
        dispatch(removeItemFromCartAction(id));
    }

    const increaseQty = (id, quantity, stock) => {
        const newQty = quantity + 1;
    
        if (newQty > stock) return;

        dispatch(addItemToCartAction(id, newQty));
    };
    
    const decreaseQty = (id, quantity) => {
        const newQty = quantity - 1;
    
        if (newQty <= 0) return;

        dispatch(addItemToCartAction(id, newQty));
    };

    const checkoutHandler = () => {
        history.push('/login?redirect=shipping');
    }

    return (
        <Fragment>
            <MetaData title={'Giỏ Hàng Của Bạn'} />
            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4>Giỏ hàng</h4>
                                <div className="breadcrumb__links">
                                    <Link to="/">Home</Link>
                                    <Link to="/search">Shop</Link>
                                    <span>Giỏ hàng</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {cartItems.length === 0 ? <h2 className='mt-5'>Giỏ Hàng Của Bạn Đang Trống</h2> : (
                <Fragment>
                    <section className="shopping-cart spad">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8">
                                    <div className="shopping__cart__table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Sản phẩm</th>
                                                    <th>Số lượng</th>
                                                    <th>Tổng tiền</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {cartItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="product__cart__item">
                                                        <div className="product__cart__item__pic">
                                                            <img src={item.image} alt={item._id} style={{ width: '90px', height: '90px' }}/>
                                                        </div>
                                                        <div className="product__cart__item__text">
                                                            <Link to={`/product/${item.product}`}><h6>{item.name}</h6></Link>     
                                                            <h5>{formattedVND(item.price)}</h5>
                                                        </div>
                                                    </td>
                                                    <td className="quantity__item">
                                                        <div className="quantity">
                                                            <div className="pro-qty-2">
                                                                <span className="fa fa-angle-left dec qtybtn" onClick={() => decreaseQty(item.product, item.quantity)}></span>
                                                                <input type="text" value={item.quantity} readOnly/>
                                                                <span className="fa fa-angle-right inc qtybtn" onClick={() => increaseQty(item.product, item.quantity, item.stock)}></span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="cart__price">{formattedVND(item.price * item.quantity)}</td>
                                                    <td className="cart__close"><i className="fa fa-close" onClick={() => removeCartItemHandler(item.product)} style={{ cursor: 'pointer' }}></i></td>
                                                </tr>
                                            ))}  
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6">
                                            <div className="continue__btn">
                                                <Link to="/search">Tiếp tục mua hàng</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="cart__total">
                                        <h6>Thông tin giỏ hàng</h6>
                                        <ul>
                                            <li>Tổng số lượng sản phẩm <span>{cartItems.reduce((acc, item) => (acc + Number(item.quantity)), 0)} (Đơn Vị)</span></li>
                                            <li>Total <span>{formattedVND(Number(cartItems.reduce((acc, item) => (acc + item.quantity * item.price), 0).toFixed(2)))}</span></li>
                                        </ul>
                                        <div onClick={checkoutHandler}>
                                            <Link to="#" className="primary-btn" >Thanh Toán</Link>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Cart