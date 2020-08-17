import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import * as action from '../../redux/Actions';
import { Row, Col, notification } from 'antd';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';

const BookTicket = ({ infoBookTicket, match, userLogin }) => {
    const [infoRoom, setInfoRoom] = useState({
        thongtinPhim: {},
        danhSachGhe: []
    });
    const getInfoShowTimes = () => {
        axios({
            method:"GET",
            url: `http://movie0706.cybersoft.edu.vn/api/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${match.params.maLichChieu}`
        }).then(res => {
            setInfoRoom({
                thongtinPhim: res.data.thongTinPhim,
                danhSachGhe: res.data.danhSachGhe
            });
        }).catch(err => console.log(err));
    };

    const [danhSachChon, setDanhSachChon] = useState([]);
    const [danhsachVeChon, setDanhSachVeChon] = useState([]);
    const renderRoom = () => {
        if(infoRoom.danhSachGhe.length > 0) {
            return infoRoom.danhSachGhe.map((item, index) => {
                for(let i = 0; i < danhSachChon.length; i++) {
                    if(item.maGhe === danhSachChon[i].maGhe) {
                        return <button className="gheDangChon" key={index} onClick={() => {
                            let temp = [...danhSachChon];
                            let veChon = [...danhsachVeChon];

                            veChon.splice(i, 1);
                            setDanhSachVeChon(veChon);

                            temp.splice(i, 1);
                            setDanhSachChon(temp);
                        }}>{danhSachChon[i].tenGhe}</button>
                    }
                }
                return <button className={item.daDat ? "gheDaChon" : "ghe"} disabled={item.daDat ? true : false} key={index} onClick={() => {
                    setDanhSachChon([...danhSachChon,{
                        maGhe: item.maGhe,
                        giaVe: item.giaVe,
                        tenGhe: item.tenGhe,
                        maLichChieu: infoRoom.thongtinPhim.maLichChieu,
                        taikhoanNguoiDung: userLogin.taiKhoan
                    }]);
                    setDanhSachVeChon([...danhsachVeChon,{
                        maGhe: item.maGhe,
                        giaVe: item.giaVe
                    }]);
                }}>{item.tenGhe}</button>
            })
        }
    }

    const renderOrder = () => {
        if(danhSachChon.length > 0) {
            return danhSachChon.map((item, index) => {
                return <tr key={index}>
                    <td>{item.tenGhe}</td>
                    <td colSpan="3">{item.giaVe.toLocaleString()}đ</td>
                </tr>
            })
        }
    }

    const totalOrder = () => {
        if(danhSachChon.length > 0) {
            return danhSachChon.reduce((total, item) => {
                return total += item.giaVe;
            },0).toLocaleString();
        }
    }

    const handleScrollTop = () => {
        window.scrollTo(0,0);
    }

    useEffect(() => {
        handleScrollTop();
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


    // time giữ ghế
    const [time, setTime] = useState('');
    function CountDown(duration) {
        if (!isNaN(duration)) {
            var timer = duration, minutes, seconds;
    
            var interVal = setInterval(function () {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);
    
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
    
                setTime(`${minutes}:${seconds}`);
                if (--timer < 0) {
                    timer = duration;
                    clearInterval(interVal)
                    Swal.fire({
                        title: 'Hết thời gian đặt vé',
                        icon: 'warning',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Đặt Vé Lại'
                      }).then((result) => {
                        if (result.value) {
                            window.location.reload(true);
                        } else {
                            window.location.reload(true);
                        }
                      })
                }
            }, 1000);
        }
    }

    useEffect(() => CountDown(300), []);

    const history = useHistory();
    // đặt vé
    const handleBookTicket = (danhSach) => {
        if(danhSach.length > 0) {
            const data = {
                maLichChieu: danhSach[0].maLichChieu,
                danhSachVe: [...danhsachVeChon],
                taikhoanNguoiDung: danhSach[0].taikhoanNguoiDung
            }
            return axios({
                method:'POST',
                url:'http://movie0706.cybersoft.edu.vn/api/QuanLyDatVe/DatVe',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                    'Content-Type': 'application/json'
                },
                data
            }).then(res => {
                getInfoShowTimes();
                Swal.fire({
                    title: 'Đặt Vé Thành Công',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Đặt vé tiếp',
                    cancelButtonText: 'Thoát'
                }).then((result) => {
                    if (result.value) {
                        window.location.reload(true);
                    } else {
                        return history.push("/");
                    }
                })
            }).catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Vui lòng đăng nhập để đặt vé',
                    showConfirmButton: false,
                    timer: 1500
                })
            });
        }
        return notification.info({
            message: `Đặt vé không thành công !!!`,
            description:
              'Danh sách đặt ghế của bạn đang trống, bạn vui lòng chọn ghế.',
            placement:'topLeft',
            duration:3
          });
    }

    return (
        <div className="bookTicket">
            <div className="bookTicket__wrapper">
                <Row gutter={16}>
                    <Col lg={16}>
                        <div className="left__col">
                            <p className="screen">Màn hình</p>
                            <div className="list">
                                { renderRoom() }
                            </div>
                        </div>
                    </Col>
                    <Col lg={8}>
                        <div className="info">
                            <p>
                                Tên Phim:
                                <span> {infoRoom.thongtinPhim.tenPhim}</span>
                            </p>
                            <p>
                                Tên Rạp:
                                <span> {infoRoom.thongtinPhim.tenCumRap}</span>
                            </p>
                            <p>
                                Suất:
                                <span>{infoRoom.thongtinPhim.gioChieu}</span>
                                - 
                                <span> {infoRoom.thongtinPhim.ngayChieu}</span>
                            </p>
                            <p>
                                Phòng chiếu:
                                <span> {infoRoom.thongtinPhim.tenRap}</span>
                            </p>
                            <p>
                                Thời gian giữ ghế: 
                                <span> {time}</span>
                            </p>
                        </div>
                        <div className="order">
                            <table className="order__table">
                                <thead>
                                    <tr>
                                        <th>MÃ GHẾ</th>
                                        <th colSpan="2">GIÁ VÉ</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { renderOrder() }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td>TỔNG ĐƠN HÀNG:</td>
                                        <td colSpan="3">{ totalOrder() }đ</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                            <button className="ant-btn ant-btn-primary ant-btn-block" size="large" onClick={() => {
                                handleBookTicket(danhSachChon);
                            }}>ĐẶT VÉ</button>
                        </div>
                        <div className="note">
                            <p>
                                <span className="gheDaChon"></span>
                                Ghế đã đặt
                            </p>
                            <p>
                                <span className="gheDangChon"></span>
                                Ghế đang chọn
                            </p>
                            <p>
                                <span className="gheChuaChon"></span>
                                Ghế chưa chọn
                            </p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        infoBookTicket: state.infoBookTicket,
        userLogin: state.userLoginStore.userLogin
    }
}

export default connect(mapStateToProps)(BookTicket);
