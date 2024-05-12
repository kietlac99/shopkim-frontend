import React, { Fragment, useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';

import MetaData from "../layout/MetaData";
import Loader from '../layout/Loader';
import Sidebar from './Sidebar';
import Confirm from '../layout/Confirm';

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getDeletedProductsAction, restoreDeletedProductAction, clearErrors } from '../../actions/productActions';
import { RESTORE_DELETED_PRODUCT_RESET } from '../../constants/productConstants';
import { CONFIRM_TYPE, CONFIRM_TO } from '../../config';

const DeletedProducts = ({ history }) => {
  const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, products } = useSelector(state => state.deletedProducts);
    const { isRestored } = useSelector(state => state.product);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [productIdToRestore, setProductIdToRestore] = useState(null);

    useEffect(() => {
        dispatch(getDeletedProductsAction());

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isRestored) {
            alert.success('Sản phẩm khôi phục thành công!');
            history.push('/admin/products/deleted')
            dispatch({ type: RESTORE_DELETED_PRODUCT_RESET });
        }
    }, [dispatch, alert, error, isRestored, history]);

    const restoreProductHandler = (id) => {
        setShowConfirmation(true);
        setProductIdToRestore(id);
    }

    const confirmRestoreHandler = () => {
        dispatch(restoreDeletedProductAction(productIdToRestore));
        setShowConfirmation(false);
    }

    const setProducts = () => {
      const data = {
          columns: [
              {
                  label: 'ID',
                  field: 'id',
                  sort: 'asc'
              },
              {
                  label: 'Tên',
                  field: 'name',
                  sort: 'asc'
              },
              {
                  label: 'Giá Tiền',
                  field: 'price',
                  sort: 'asc'
              },
              {
                  label: 'Stock',
                  field: 'stock',
                  sort: 'asc'
              },
              {
                  label: 'Thao tác',
                  field: 'actions'
              }
          ],
          rows: []
      };

      products.forEach(product => {
          const formattedPrice = product?.value?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

          data.rows.push({
              id: product?.value?._id,
              name: product?.value?.name,
              price: formattedPrice,
              stock: product?.value?.stock,
              actions: 
                  <Fragment>
                        <button className='btn-danger py-1 px-2 ml-2' 
                        onClick={() => restoreProductHandler(product?.value?._id)}>
                            <i className='fa fa-history'></i>
                        </button>
                  </Fragment>
          })
      });

      return data;
  };
  return (
    <Fragment>
        <MetaData title={'Deleted Products'} />
        <div className='row'>
            <div className='col-12 col-md-2'>
                <Sidebar />
            </div>

            <div className='col-12 col-md-10'>
                <Fragment>
                    <h2 className='my-5'>Sản Phẩm Trong Thùng Rác</h2>

                    {loading ? <Loader /> : (
                        <MDBDataTable 
                            data={setProducts()}
                            className='px-3'
                            bordered
                            striped
                            hover
                        />
                    )}

                    <Confirm
                        show={showConfirmation}
                        onClose={() => setShowConfirmation(false)}
                        onConfirm={confirmRestoreHandler}
                        confirmType={CONFIRM_TYPE.RESTORE}
                        type={CONFIRM_TO.PRODUCT}
                    />
                </Fragment>
            </div>
        </div>
    </Fragment>
  )
}

export default DeletedProducts;