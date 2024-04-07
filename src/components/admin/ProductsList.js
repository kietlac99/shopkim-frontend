import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';

import MetaData from "../layout/MetaData";
import Loader from '../layout/Loader';
import Sidebar from './Sidebar';
import DeleteConfirm from '../layout/DeleteConfirm';

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getAdminProductsAction, deleteProductAction, clearErrors } from '../../actions/productActions';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';

const ProductsList = ({ history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, products } = useSelector(state => state.products);
    const { error: deleteError, isDeleted } = useSelector(state => state.product);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);

    useEffect(() => {
        dispatch(getAdminProductsAction());

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if(isDeleted) {
            alert.success('Sản phẩm xóa thành công!');
            history.push('/admin/products');
            dispatch({ type: DELETE_PRODUCT_RESET });
        }
    }, [dispatch, alert, error, deleteError, isDeleted, history]);

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
            const formattedPrice = product?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

            data.rows.push({
                id: product._id,
                name: product.name,
                price: formattedPrice,
                stock: product.stock,
                actions: 
                    <Fragment>
                        <Link to={`/admin/product/${product._id}`} className='btn btn-primary py-1 px-2'>
                            <i className='fa fa-pencil'></i>
                        </Link>
                        <button className='btn-danger py-1 px-2 ml-2' onClick={() => deleteProductHandle(product._id)}>
                            <i className='fa fa-trash'></i>
                        </button>
                    </Fragment>
            })
        });

        return data;
    };

    const deleteProductHandle = (id) => {
        setShowConfirmation(true);
        setProductIdToDelete(id);
        //dispatch(deleteProductAction(id));
    };

    const confirmDeleteHandler = () => {
        dispatch(deleteProductAction(productIdToDelete));
        setShowConfirmation(false);
    }

  return (
    <Fragment>
        <MetaData title={'All Products'} />
        <div className='row'>
            <div className='col-12 col-md-2'>
                <Sidebar />
            </div>

            <div className='col-12 col-md-10'>
                <Fragment>
                    <h1 className='my-5'>Tất Cả Sản Phẩm</h1>

                    {loading ? <Loader /> : (
                        <MDBDataTable 
                            data={setProducts()}
                            className='px-3'
                            bordered
                            striped
                            hover
                        />
                    )}

                    <DeleteConfirm
                        show={showConfirmation}
                        onClose={() => setShowConfirmation(false)}
                        onConfirm={confirmDeleteHandler}
                        deleteType='sản phẩm'
                    />
                </Fragment>
            </div>
        </div>
    </Fragment>
  )
}

export default ProductsList