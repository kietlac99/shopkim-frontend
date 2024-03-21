import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import MetaData from "../layout/MetaData";

const OrderSuccess = () => {
  return (
    <Fragment>

      <MetaData title={'Order Success'} />

      <div className="row justify-content-center">
        <div className="col-6 mt-5 text-center">
            <img className="my-5 img-fluid d-block mx-auto" src="https://freepngimg.com/thumb/success/6-2-success-png-image.png" alt="Order Success" width="200" height="200" />

            <h2>Đơn hàng của bạn đã đặt thành công.</h2>

            <Link to="/orders/me">Đến trang đơn hàng của bạn.</Link>
        </div>
      </div>
        
    </Fragment>
  )
}

export default OrderSuccess