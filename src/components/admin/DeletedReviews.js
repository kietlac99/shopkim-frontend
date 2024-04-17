import React, { Fragment, useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';

import MetaData from "../layout/MetaData";
import Loader from '../layout/Loader';
import Sidebar from './Sidebar';
import Confirm from '../layout/Confirm';

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getDeletedReviewsAction, restoreDeletedReviewAction, clearErrors } from '../../actions/productActions';
import { RESTORE_DELETED_REVIEW_RESET } from '../../constants/productConstants';
import { CONFIRM_TYPE, CONFIRM_TO } from '../../config';

const DeletedReviews = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, reviews } = useSelector(state => state.deletedReviews);
  const { isRestored } = useSelector(state => state.review);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reviewIdToRestore, setReviewIdToRestore] = useState(null);
  const [productId, setProductId] = useState(null);

  useEffect(() => {
      dispatch(getDeletedReviewsAction());

      if (error) {
        alert.error(error);
        dispatch(clearErrors());
      }

      if (isRestored) {
        alert.success('Đánh giá khôi phục thành công!');
        history.push('/admin/reviews/deleted')
        dispatch({ type: RESTORE_DELETED_REVIEW_RESET });
      }
  }, [dispatch, alert, error, isRestored, history]);

  const restoreReviewHandler = (productId, reviewId) => {
      setShowConfirmation(true);
      setProductId(productId);
      setReviewIdToRestore(reviewId);
  }

  const confirmRestoreHandler = () => {
      dispatch(restoreDeletedReviewAction(productId, reviewIdToRestore));
      setShowConfirmation(false);
  }

  const setReviews = () => {
    const data = {
        columns: [
            {
              label: 'ID Sản Phẩm',
              field: 'productId',
              sort: 'asc'
            },
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
            productId: review?.value?.productId,
            id: review?.value?.review?._id,
            rating: review?.value?.review?.rating,
            comment: review?.value?.review?.comment,
            user: review?.value?.review?.name,

            actions: 
              <Fragment>
                    <button className='btn-danger py-1 px-2 ml-2' 
                    onClick={() => restoreReviewHandler(
                      review?.value?.productId, review?.value?.review?._id
                      )}>
                        <i className='fa fa-history'></i>
                    </button>
              </Fragment>
        });
    });

    return data;
  };

  return (
    <Fragment>
        <MetaData title={'Deleted Reviews'} />
        <div className='row'>
            <div className='col-12 col-md-2'>
                <Sidebar />
            </div>

            <div className='col-12 col-md-10'>
                <Fragment>
                    <h1 className='my-5'>Đánh Giá Trong Thùng Rác</h1>

                    {loading ? <Loader /> : (
                        <MDBDataTable 
                            data={setReviews()}
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
                        type={CONFIRM_TO.REVIEW}
                    />
                </Fragment>
            </div>
        </div>
    </Fragment>
  )
}

export default DeletedReviews;