import React, { useState, useEffect, useCallback } from 'react';
import Slider from "react-slick";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";
import "../../../node_modules/slick-carousel/slick/slick.css";
import axios from 'axios';
import { API } from '../../configs/configs';

import { Modal, Spin } from 'antd';

var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
};

const CarouselComponent = () => {
    const [isLoading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const handleGetFirmList = useCallback(() => {
        axios({
            method: 'GET',
            url: `${API}/QuanLyPhim/LayDanhSachPhim?maNhom=GP06`
        }).then(res => {
            setList(res.data);
            setLoading(false);
        }).catch(err => console.log(err));
    }, []);

    useEffect(() => {
        handleGetFirmList();
    }, []);

    const renderCarousel = () => {
        return list.map((item, index) => {
            if (index < 5) {
                return <div key={index} className="carousel__wrapper">
                    <img
                        src={item.hinhAnh}
                        alt={item.tenPhim}
                        onClick={() => {
                            setTrailer(item.trailer)
                            showModal()
                        }}
                    />
                </div>
            }
        })
    }

    // modal
    const [trailer, setTrailer] = useState("");
    const [modalStyle, setModalStyle] = useState({
        visible: false,
        confirmLoading: false
    });

    const showModal = () => {
        setModalStyle({
            ...modalStyle,
            visible: true
        });
    };


    const handleCancel = () => {
        setModalStyle({
            ...modalStyle,
            visible: false
        });
    };

    return (
        <>
            {
                isLoading && <div className="overlay__wrapper">
                    <Spin
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%,-50%)'
                        }}
                        tip="Đang Tải..."
                        size="large"
                    >
                    </Spin>
                </div>
            }
            <Slider {...settings} className="carousel">
                {renderCarousel()}
            </Slider>
            <Modal
                visible={modalStyle.visible}
                confirmLoading={modalStyle.confirmLoading}
                className="trailer__modal"
                footer=""
                onCancel={handleCancel}
            >
                <iframe style={{ width: '100%', height: '400px' }} src={trailer}>
                </iframe>
            </Modal>

        </>
    );
}

export default React.memo(CarouselComponent);
