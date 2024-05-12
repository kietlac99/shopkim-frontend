import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
import Sidebar from './Sidebar';

import { useDispatch, useSelector } from "react-redux";
import { MDBDataTable } from 'mdbreact';

import { getAdminProductsAction } from '../../actions/productActions';
import { allOrdersAction, statisticsRevenueAction } from '../../actions/orderActions';
import { allUsersAction } from '../../actions/userActions';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const Dashboard = () => {

    const dispatch = useDispatch();

    const { products } = useSelector(state => state.products);
    const { users } = useSelector(state => state.allUsers);
    const { statistic } = useSelector(state => state.statisticsRevenue);
    const { orders, totalAmount, loading } = useSelector(state => state.allOrders);
    const formattedAmount = totalAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [filterType, setFilterType] = useState('');

    let outOfStock = 0;
    products.forEach(product => {
        if (product.stock === 0) {
            outOfStock += 1;
        }
    })

    useEffect(() => {
        dispatch(getAdminProductsAction());
        dispatch(allOrdersAction());
        dispatch(allUsersAction());
    }, [dispatch]);

    const filterOrdersByYear = (year) => {
        const formattedYear = year.getFullYear().toString();
        dispatch(statisticsRevenueAction({ year: formattedYear }));
    };

    // Function to filter orders based on selected month and year
    const filterOrdersByMonth = (monthYear) => {
        const formattedMonthYear = moment(monthYear).format('YYYY-MM');
        dispatch(statisticsRevenueAction({ monthYear: formattedMonthYear }));
    };

    // Function to filter orders based on specific date range
    const filterOrdersByDateRange = (fromDate, toDate) => {
        const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
        const formattedToDate = moment(toDate).format('YYYY-MM-DD');
        dispatch(statisticsRevenueAction({ fromDate: formattedFromDate, toDate: formattedToDate }));
    };

    const setStatisticsRevenue = () => {
        const data = {
            columns: [
                {
                    label: 'Thời gian',
                    field: 'date',
                    sort: 'asc'
                },
                {
                    label: 'Tổng tiền',
                    field: 'totalMoney',
                    sort: 'asc'
                }
            ],
            rows: []
        };

        statistic.revenue.forEach(revenue => {
            data.rows.push({
                date: revenue._id,
                totalMoney: revenue.totalMoney,
            });
        });

        return data;
    };

  return (
    <Fragment>
        <div className='row'>
            <div className='col-12 col-md-2'>
                <Sidebar />
            </div>

            <div className="col-12 col-md-10">
                <h2 className="my-4">Thống kê</h2>

                {loading ? <Loader /> : (
                    <Fragment>
                        <MetaData title={'Admin Dashboard'} />

                        <div className="row pr-4">
                            <div className="col-xl-12 col-sm-12 mb-3">
                                <div className="card text-white bg-primary o-hidden h-100">
                                    <div className="card-body">
                                        <div className="text-center card-font-size">Tổng thu<br /> <b>{formattedAmount}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row pr-4">
                            <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="card text-white bg-success o-hidden h-100">
                                    <div className="card-body">
                                        <div className="text-center card-font-size">
                                            Sản phẩm<br /> <b>{products && products.length}</b>
                                        </div>
                                    </div>
                                    <Link className="card-footer text-white clearfix small z-1" to="/admin/products">
                                        <span className="float-left">Xem Chi Tiết</span>
                                        <span className="float-right">
                                            <i className="fa fa-angle-right"></i>
                                        </span>
                                    </Link>
                                </div>
                            </div>


                            <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="card text-white bg-danger o-hidden h-100">
                                    <div className="card-body">
                                        <div className="text-center card-font-size">Đơn Hàng<br /> <b>
                                            {orders && orders.length}</b>
                                        </div>
                                    </div>
                                    <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
                                        <span className="float-left">Xem Chi Tiết</span>
                                        <span className="float-right">
                                            <i className="fa fa-angle-right"></i>
                                        </span>
                                    </Link>
                                </div>
                            </div>


                            <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="card text-white bg-info o-hidden h-100">
                                    <div className="card-body">
                                        <div className="text-center card-font-size">Người Dùng<br /> <b>{users && users.length}</b></div>
                                    </div>
                                    <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                                        <span className="float-left">Xem Chi Tiết</span>
                                        <span className="float-right">
                                            <i className="fa fa-angle-right"></i>
                                        </span>
                                    </Link>
                                </div>
                            </div>


                            <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="card text-white bg-warning o-hidden h-100">
                                    <div className="card-body">
                                        <div className="text-center card-font-size">
                                            Hết Hàng<br /> <b>{outOfStock}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Date Filter */}
                        <div className="row pr-4">
                                <div className="col-md-6 mb-3">
                                    <h4>Thống kê doanh thu:</h4>
                                    <select className="form-control mb-2" onChange={(e) => setFilterType(e.target.value)}>
                                        <option value="">Chọn loại thời gian</option>
                                        <option value="year">Theo Năm</option>
                                        <option value="month">Theo Tháng Năm</option>
                                        <option value="dateRange">Ngày Tháng Cụ Thể</option>
                                    </select>
                                    <div className='mb-2'>
                                        {filterType === 'year' && (                                           
                                            <DatePicker
                                                selected={fromDate}
                                                onChange={date => setFromDate(date)}
                                                showYearPicker
                                                dateFormat="yyyy"
                                                placeholderText="Chọn năm"
                                            />                                           
                                        )}
                                        {filterType === 'month' && (                                        
                                            <DatePicker
                                                selected={fromDate}
                                                onChange={date => setFromDate(date)}
                                                showMonthYearPicker
                                                dateFormat="MM/yyyy"                                               
                                                placeholderText="Chọn tháng năm"
                                            />                                                                           
                                        )}
                                        {filterType === 'dateRange' && (
                                            <>
                                                <DatePicker
                                                    selected={fromDate}
                                                    onChange={date => setFromDate(date)}
                                                    selectsStart
                                                    startDate={fromDate}
                                                    endDate={toDate}
                                                    dateFormat="dd/MM/yyyy"
                                                    placeholderText="Từ ngày"
                                                />
                                                <DatePicker
                                                    selected={toDate}
                                                    onChange={date => setToDate(date)}
                                                    selectsEnd
                                                    startDate={fromDate}
                                                    endDate={toDate}
                                                    minDate={fromDate}
                                                    dateFormat="dd/MM/yyyy"
                                                    placeholderText="Đến ngày"
                                                />
                                            </>
                                        )}
                                    </div>                                  
                                    <button className="btn btn-primary mt-2" onClick={() => {
                                        if (filterType === 'year') {
                                            filterOrdersByYear(fromDate);
                                        } else if (filterType === 'month') {
                                            filterOrdersByMonth(fromDate);
                                        } else if (filterType === 'dateRange') {
                                            filterOrdersByDateRange(fromDate, toDate);
                                        }
                                    }}>Lọc</button>
                                </div>
                                {statistic?.revenue && statistic?.revenue?.length > 0 ? (
                                    <div className="col-md-12">
                                        <MDBDataTable 
                                            data={setStatisticsRevenue()}
                                            className='px-3'
                                            bordered
                                            striped
                                            hover
                                        />
                                        <p className="mt-3">
                                            Tổng doanh thu theo thống kê: {statistic.totalRevenue}
                                        </p>
                                    </div>
                                ) : (
                                    <p className='mt-5 text-center'>Không có thời gian thống kê doanh thu!</p>
                                )}
                            </div>
                    </Fragment>
                )}             
            </div>
        </div>
        
    </Fragment>
  )
}

export default Dashboard