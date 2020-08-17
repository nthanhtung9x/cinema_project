import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";
import "../../../node_modules/slick-carousel/slick/slick.css";
import axios from 'axios';
import { Modal } from 'antd';


const CarouselComponent = () => {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const [list, setList] = useState([]);
    const handleGetFirmList = () => {
        axios({
            method:'GET',
            url:'http://movie0706.cybersoft.edu.vn/api/QuanLyPhim/LayDanhSachPhim?maNhom=GP06'
        }).then(res => {
            setList(res.data);
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        handleGetFirmList();
    },[]);

    const renderCarousel = () => {
        return list.map((item, index) => {
            if(index < 5) {
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
            <Slider {...settings} className="carousel">
                { renderCarousel() }
            </Slider>
            <Modal
                visible={modalStyle.visible}
                confirmLoading={modalStyle.confirmLoading}
                className="trailer__modal"
                footer=""
                onCancel={handleCancel}
            >
               <iframe style={{width:'100%', height:'400px'}} src={trailer}>
               </iframe>
            </Modal>
        </>
    );
}

export default CarouselComponent
