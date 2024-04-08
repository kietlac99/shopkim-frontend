import React, { Fragment, useState, useEffect } from 'react';
import { MDBDataTable } from 'mdbreact';

import MetaData from "../layout/MetaData";
import Sidebar from './Sidebar';

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getProductReviewsAction, deleteReviewAction, clearErrors } from '../../actions/productActions';
import { DELETE_REVIEW_RESET } from '../../constants/productConstants';
import DeleteConfirm from '../layout/DeleteConfirm';

const ProductReviews = () => {

    const [productId, setProductId]  = useState('');

    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, reviews } = useSelector(state => state.productReviews);
    const { isDeleted } = useSelector(state => state.review);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [reviewIdToDelete, setReviewIdToDelete] = useState(null);

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if(isDeleted) {
            alert.success('Đánh giá xóa thành công!');
            dispatch({ type: DELETE_REVIEW_RESET });
        }

    }, [dispatch, alert, error, isDeleted]);

    const deleteReviewHandler = (id) => {
        //dispatch(deleteReviewAction(id, productId));
        setShowConfirmation(true);
        setReviewIdToDelete(id);
    };

    const confirmDeleteHandler = () => {
        dispatch(deleteReviewAction(reviewIdToDelete, productId));
        setShowConfirmation(false);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(getProductReviewsAction(productId));
    }

    const setReviews = () => {
        const data = {
            columns: [
                {
                    label: 'ID Đánh Giá',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Xếp Hạng',
                    field: 'rating',
                    sort: 'asc'
                },
                {
                    label: 'Bình Luận',
                    field: 'comment',
                    sort: 'asc'
                },
                {
                    label: 'Người Dùng',
                    field: 'user',
                    sort: 'asc'
                },
                {
                    label: 'Thao tác',
                    field: 'actions'
                }
            ],
            rows: []
        };

        reviews.forEach(review => {
            data.rows.push({
                id: review._id,
                rating: review.rating,
                comment: review.comment,
                user: review.name,

                actions: 
                    <button className='btn-danger py-1 px-2 ml-2' 
                    onClick={() => deleteReviewHandler(review._id)}>
                        <i className='fa fa-trash'></i>
                    </button>
            });
        });

        return data;
    };

  return (
    <Fragment>
        <MetaData title={'Product Reviews'} />
        <div className='row'>
            <div className='col-12 col-md-2'>
                <Sidebar />
            </div>

            <div className='col-12 col-md-10'>
                <Fragment>
                    <div className="row justify-content-center mt-5">
                        <div className="col-5">
                            <form onSubmit={submitHandler}>
                                <div className="form-group">
                                    <label htmlFor="productId_field">Nhập ID Sản Phẩm</label>
                                    <input
                                        type="text"
                                        id="productId_field"
                                        className="form-control"
                                        value={productId}
                                        onChange={(e) => setProductId(e.target.value)}
                                    />
                                </div>

                                <button
                                    id="search_button"
                                    type="submit"
                                    className="btn btn-primary btn-block py-2"
                                >
                                    Tìm Kiếm
                                </button>
                            </ form>
                        </div>
                    </div>

                    {reviews && reviews.length > 0 ? (    
                        <MDBDataTable 
                            data={setReviews()}
                            className='px-3'
                            bordered
                            striped
                            hover
                        />
                    ): (
                        <p className='mt-5 text-center'>Không Có Đánh Giá.</p>
                    )}

                    <DeleteConfirm
                        show={showConfirmation}
                        onClose={() => setShowConfirmation(false)}
                        onConfirm={confirmDeleteHandler}
                        deleteType='đánh giá'
                    />
                    
                </Fragment>
            </div>
        </div>
    </Fragment>
  )
}

export default ProductReviews