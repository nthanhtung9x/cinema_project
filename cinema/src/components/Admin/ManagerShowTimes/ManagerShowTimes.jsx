import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Col, Row } from 'antd';
import axios from 'axios';

const ManagerShowTimes = ({ match }) => {
    const [infoRoom, setInfoRoom] = useState({
        thongTinPhim: {},
        danhSachGhe: []
    });

    let userLogin = useSelector(state => state.userLoginStore.userLogin);

    const getInfoShowTimes = () => {
        axios({
            method: "GET",
            url: `http://movie0706.cybersoft.edu.vn/api/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${match.params.maLichChieu}`
        }).then(res => {
            setInfoRoom({
                thongTinPhim: res.data.thongTinPhim,
                danhSachGhe: res.data.danhSachGhe
            });
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        let timerInterval;
        Swal.fire({
            timer: 2000,
            timerProgressBar: true,
            onBeforeOpen: () => {
                Swal.showLoading();
            },
            onClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer')
            }
        })
        getInfoShowTimes();
    }, []);

    const [danhSachChon, setDanhSachChon] = useState([]);
    const [danhsachVeChon, setDanhSachVeChon] = useState([]);
    const renderRoom = () => {
        if (infoRoom.danhSachGhe.length > 0) {
            return infoRoom.danhSachGhe.map((item, index) => {
                for (let i = 0; i < danhSachChon.length; i++) {
                    if (item.maGhe === danhSachChon[i].maGhe) {
                        return <button className="gheDangChon" key={index} 
                            // onClick={() => {
                            //     let temp = [...danhSachChon];
                            //     let veChon = [...danhsachVeChon];

                            //     veChon.splice(i, 1);
                            //     setDanhSachVeChon(veChon);

                            //     temp.splice(i, 1);
                            //     setDanhSachChon(temp);
                            // }}
                        >{danhSachChon[i].tenGhe}</button>
                    }
                }
                return <button className={item.daDat ? "gheDaChon" : "ghe"} disabled={item.daDat ? true : false} key={index} 
                    // onClick={() => {
                    //     setDanhSachChon([...danhSachChon, {
                    //         maGhe: item.maGhe,
                    //         giaVe: item.giaVe,
                    //         tenGhe: item.tenGhe,
                    //         maLichChieu: infoRoom.thongtinPhim.maLichChieu,
                    //         taikhoanNguoiDung: userLogin.taiKhoan
                    //     }]);
                    //     setDanhSachVeChon([...danhsachVeChon, {
                    //         maGhe: item.maGhe,
                    //         giaVe: item.giaVe
                    //     }]);
                    // }}
                >{item.tenGhe}</button>
            })
        }
    }


    return (
        <div className="manager__showtimes">
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
                            <span className="gheDaChon"></span>
                            Ghế đã đặt
                        </p>
                        {/* <p>
                            <span className="gheDangChon"></span>
                            Ghế đang chọn
                        </p> */}
                        <p>
                            <span className="gheChuaChon"></span>
                            Ghế chưa chọn
                        </p>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default ManagerShowTimes;
