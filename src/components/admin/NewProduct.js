import React, { Fragment, useState, useEffect } from 'react';

import MetaData from "../layout/MetaData";
import Sidebar from './Sidebar';

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { newProductAction, clearErrors } from '../../actions/productActions';
import { NEW_PRODUCT_RESET } from '../../constants/productConstants';

const NewProduct = ({ history }) => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const categories = [
        "Quần tây", "Đầm", "Áo vest"
    ];

    const alert = useAlert();
    const dispatch = useDispatch();

    const { /*loading,*/ error, success } = useSelector(state => state.newProduct);

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if(success) {
            history.push('/admin/products');
            alert.success('Thêm sản phẩm thành công!');
            dispatch({ type: NEW_PRODUCT_RESET })
        }
    }, [dispatch, alert, error, success, history]);

    const submitHandler = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.set('name', name);
        formData.set('price', price);
        formData.set('description', description);
        formData.set('category', category);
        formData.set('stock', stock);
        formData.set('seller', seller);

        images.forEach(image => {
            formData.append('productImageFiles', image);
        });
    
        dispatch(newProductAction(formData));
    };
    
    const onChange = e => {

        const files = Array.from(e.target.files);

        setImagesPreview([]);
        setImages([]);

        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result]);
                    setImages(oldArray => [...oldArray, file]);
                }
            }

            reader.readAsDataURL(file);
        }) ;
    };

  return (
    <Fragment>
        <MetaData title={'New Product'} />
        <div className='row'>
            <div className='col-12 col-md-2'>
                <Sidebar />
            </div>

            <div className='col-12 col-md-10'>
                <Fragment>
                    <div className="wrapper my-5"> 
                        <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                            <h2 className="mb-4">Thêm Sản Phẩm Mới</h2>

                            <div className="form-group">
                                <label htmlFor="name_field">Tên Sản Phẩm</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price_field">Giá Tiền</label>
                                <input
                                type="text"
                                id="price_field"
                                className="form-control"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description_field">Mô tả</label>
                                <textarea className="form-control" id="description_field" rows="8" 
                                value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="category_field">Danh Mục Sản Phẩm</label>
                                <select className="form-control" id="category_field"
                                value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value='' >Chọn Danh Mục</option>
                                    {categories.map(category => (
                                        <option key={category} value={category} >{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="stock_field">Số Lượng</label>
                                <input
                                type="number"
                                id="stock_field"
                                className="form-control"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="seller_field">Nhà Cung Cấp</label>
                                <input
                                type="text"
                                id="seller_field"
                                className="form-control"
                                value={seller}
                                onChange={(e) => setSeller(e.target.value)}
                                />
                            </div>
                            
                            <div className='form-group'>
                                <label>Hình Ảnh</label>
                                
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='product_images'
                                        className='custom-file-input'
                                        id='customFile'
                                        onChange={onChange}
                                        multiple
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Chọn Hình Ảnh
                                    </label>
                                </div>

                                {imagesPreview.map(img => (
                                    <img src={img} key={img} alt='Images Preview' 
                                    className='mt-3 mr-2' width='55' height='52' />
                                ))}

                            </div>

                
                            <button
                            id="login_button"
                            type="submit"
                            className="btn btn-block py-3"
                            //disabled= {loading ? true : false}
                            >
                                TẠO MỚI
                            </button>

                        </form>
                    </div>

                </Fragment>
            </div>
        </div>
    </Fragment>
  );
};

export default NewProduct;