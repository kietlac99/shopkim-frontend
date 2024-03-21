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
            {cartItems.length === 0 ? <h2 className='mt-5'>Giỏ Hàng Của Bạn Đang Trống</h2> : (
                <Fragment>
                    <h2 className="mt-5">Giỏ Hàng Của Bạn: <b>{cartItems.length} sản phẩm</b></h2>
        
                    <div className="row d-flex justify-content-between">
                        <div className="col-12 col-lg-8">
                            
                            {cartItems.map(item => (
                                <div className="cart-item" key={item.product}>
                                <Fragment>
                                    <hr/>
                                        <div className="row">
                                            <div className="col-4 col-lg-3">
                                                <img src={item.image} alt="itemImage" height="90" width="115" />
                                            </div>

                                            <div className="col-5 col-lg-3">
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </div>


                                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                <p id="card_item_price">{formattedVND(item.price)}</p>
                                            </div>

                                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                <div className="stockCounter d-inline">
                                                    <span className="btn btn-danger minus" 
                                                    onClick={() => decreaseQty(item.product, item.quantity)}>-</span>

                                                    <input type="number" className="form-control count d-inline" 
                                                    value={item.quantity} 
                                                    readOnly />

                                                    <span className="btn btn-primary plus"
                                                    onClick={() => increaseQty(item.product, item.quantity, item.stock)}>+</span>
                                                </div>
                                            </div>

                                            <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                                <i id="delete_cart_item" className="fa fa-trash btn btn-danger"
                                                onClick={() => removeCartItemHandler(item.product)}></i>
                                            </div>

                                        </div>                 
                                    <hr />
                                </Fragment>
                                </div>
                            ))}
                            
                        </div>

                        <div className="col-12 col-lg-3 my-4">
                            <div id="order_summary">
                                <h4>Thông tin thanh toán đơn hàng</h4>
                                <hr />
                                <p>Tổng số lượng sản phẩm:  <span className="order-summary-values">
                                    {cartItems.reduce((acc, item) => (acc + Number(item.quantity)), 0)} (Đơn Vị)
                                    </span></p>
                                <p>Tổng tiền: <span className="order-summary-values">
                                    {formattedVND(Number(cartItems.reduce((acc, item) => (acc + item.quantity * item.price), 0).toFixed(2)))}
                                    </span></p>
                
                                <hr />
                                <button id="checkout_btn" className="btn btn-primary btn-block"
                                onClick={checkoutHandler}>Thanh toán</button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Cart