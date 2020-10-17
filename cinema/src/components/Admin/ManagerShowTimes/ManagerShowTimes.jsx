import React, { useState, useEffect } from 'react';
// import Swal from 'sweetalert2';
import { Col, Row, Spin } from 'antd';
import axios from 'axios';
import { API } from '../../../configs/configs';

const ManagerShowTimes = ({ match }) => {
    const [infoRoom, setInfoRoom] = useState({
        thongTinPhim: {},
        danhSachGhe: []
    });

    const [isLoading, setLoading] = useState(true);

    const getInfoShowTimes = () => {
        axios({
            method: "GET",
            url: `${API}/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${match.params.maLichChieu}`
        }).then(res => {
            setInfoRoom({
                thongTinPhim: res.data.thongTinPhim,
                danhSachGhe: res.data.danhSachGhe
            });
            setLoading(false);
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        // let timerInterval;
        // Swal.fire({
        //     timer: 2000,
        //     timerProgressBar: true,
        //     onBeforeOpen: () => {
        //         Swal.showLoading();
        //     },
        //     onClose: () => {
        //         clearInterval(timerInterval)
        //     }
        // }).then((result) => {
        //     /* Read more about handling dismissals below */
        //     if (result.dismiss === Swal.DismissReason.timer) {
        //         console.log('I was closed by the timer')
        //     }
        // })
        getInfoShowTimes();
    }, []);

    // const [danhSachChon, setDanhSachChon] = useState([]);
    // const [danhsachVeChon, setDanhSachVeChon] = useState([]);
    const renderRoom = () => {
        return infoRoom.danhSachGhe?.map((item, index) => {
            // for (let i = 0; i < danhSachChon.length; i++) {
            //     if (item.maGhe === danhSachChon[i].maGhe) {
            //         return <button 
            //             className="gheDangChon" 
            //             key={index} 
            //         >{danhSachChon[i].tenGhe}</button>
            //     }
            // }
            let classLoaiGhe = item.loaiGhe === "Vip" ? "gheVip" : "";

            return <button
                className={item.daDat ? "gheDaChon" : `ghe ${classLoaiGhe}`}
                disabled={item.daDat ? true : false}
                key={index}
            >{item.tenGhe}</button>
        })
    }

    const renderTotal = () => {
        let count = 0;
        for (let i = 0; i < infoRoom.danhSachGhe.length; i++) {
            if (infoRoom.danhSachGhe[i].daDat) {
                count++;
            }
        }
        return count;
    }


    return (
        <div className="manager__showtimes">
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
            {
                !isLoading && <>
                    <h1>{`Thông tin suất(${infoRoom.thongTinPhim.gioChieu}, ${infoRoom.thongTinPhim.ngayChieu}) chiếu phim ${infoRoom.thongTinPhim.tenPhim} của Rạp ${infoRoom.thongTinPhim.tenCumRap}`}</h1>
                    <Row gutter={[16, 16]}>
                        <Col lg={16}>
                            <div className="left__col">
                                {/* <p className="screen">Màn hình</p> */}
                                <div className="list">
                                    {renderRoom()}
                                </div>
                            </div>
                        </Col>
                        <Col lg={8}>
                            <div className="note">
                                <p>
                                    Tổng ghế đã đặt: {`${renderTotal()} / ${infoRoom.danhSachGhe?.length}`}
                                </p>
                                <p>
                                    <span className="gheDaChon"></span>
                            Ghế đã đặt
                        </p>
                                <p>
                                    <span className="gheVip"></span>
                            Ghế Vip
                        </p>
                                <p>
                                    <span className="gheChuaChon"></span>
                            Ghế chưa chọn (ghế thường)
                        </p>
                            </div>
                        </Col>
                    </Row>
                </>
            }


        </div>
    )
}

export default ManagerShowTimes;
