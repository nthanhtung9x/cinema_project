import React, { useEffect } from 'react';

import Slider from "react-slick";
import "../../../../../node_modules/slick-carousel/slick/slick-theme.css";
import "../../../../../node_modules/slick-carousel/slick/slick.css";

import { Tabs } from 'antd';
import { AppstoreAddOutlined, PaperClipOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as action from '../../../../redux/Actions';

const { TabPane } = Tabs;

const FilmView = ({ dispatch , filmList, filmListSoon }) => {
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1
    };

    useEffect(() => {
        dispatch(action.getFilmListAPI());
        dispatch(action.getFilmListSoonAPI());
    },[]);

    const renderFilmNow = () => {
        console.log(filmList);
        return filmList.map((item, index) => {
            return  <div className="item" key={index}>
                        <Link to={`/detailMovie/${item.maPhim}`} className="img__film">
                            <img
                                src={item.hinhAnh}
                                alt={item.hinhAnh}
                            />
                        </Link>
                        <article>
                            <Link to={`/detailMovie/${item.maPhim}`}>
                                {item.tenPhim}
                            </Link>
                        </article>
                        <Link to={`/detailMovie/${item.maPhim}`} className="ant-btn ant-btn-primary ant-btn-block" size="large">
                            <AppstoreAddOutlined />
                            MUA VÉ
                        </Link>
                    </div>
        })
    }

    const renderFilmSoon = () => {
        return filmListSoon.map((item, index) => {
            return  <div className="item" key={index}>
                        <Link to={`/detailMovie/${item.maPhim}`} className="img__film">
                            <img
                                src={item.hinhAnh}
                                alt={item.hinhAnh}
                            />
                        </Link>
                        <article>
                            <Link to={`/detailMovie/${item.maPhim}`}>
                                {item.tenPhim}
                            </Link>
                        </article>
                        <Link to={`/detailMovie/${item.maPhim}`} className="ant-btn ant-btn-danger ant-btn-block" size="large">
                            <AppstoreAddOutlined />
                            Sắp Chiếu
                        </Link>
                    </div>
        })
    }

    return (
        <div className="film__view" id="film">
            <div className="film__view__wrapper">
                <Tabs defaultActiveKey="1">
                    <TabPane
                        tab={
                            <span>
                                <PaperClipOutlined />
                    PHIM ĐANG CHIẾU
                    </span>
                        }
                        key="1"
                    >
                        <Slider {...settings} className="carousel">
                           { renderFilmNow() }

                        </Slider>
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <ThunderboltOutlined />
                    PHIM SẮP CHIẾU
                    </span>
                        }
                        key="2"
                    >
                         <Slider {...settings} className="carousel">
                            { renderFilmSoon() }    
                        </Slider>                     
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}

const mapStateToProps = state => (
    {
        filmList: state.filmList.danhSachPhim,
        filmListSoon: state.filmList.danhSachPhimSapChieu
    }
)

export default connect(mapStateToProps)(FilmView);
