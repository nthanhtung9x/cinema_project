import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Modal, Tabs, Spin } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import * as action from '../../redux/Actions';
// import Swal from 'sweetalert2';
import { API } from '../../configs/configs';
import moment from 'moment';

const { TabPane } = Tabs;

const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)

const DetailMovie = ({ match, dispatch, userLogin, reload }) => {

    const [isLoading, setLoading] = useState(true);

    //scroll
    const myRef = useRef(null)
    const executeScroll = () => scrollToRef(myRef)

    // modal
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

    const handleScrollTop = () => {
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        handleScrollTop();
        // let timerInterval;
        getFilmAPI();
        getDetailFilm();
        getShowTimes();
        // Swal.fire({
        //     timer: 3000,
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

    }, [reload]);

    const [detail, setDetail] = useState({});
    const [showTimes, setShowTimes] = useState([]);
    const getDetailFilm = () => {
        axios({
            method: 'GET',
            url: `${API}/QuanLyPhim/LayThongTinPhim?MaPhim=${match.params.MaPhim}`
        }).then(res => {
            setDetail(res.data);
            setLoading(false);
        }).catch(err => console.log(err));
    }

    const getShowTimes = () => {
        axios({
            method: 'GET',
            url: `${API}/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${match.params.MaPhim}`
        }).then(res => {
            setShowTimes(res.data.heThongRapChieu);
        }).catch(err => console.log(err));
    }


    function appendLeadingZeroes(n) {
        if (n <= 9) {
            return "0" + n;
        }
        return n;
    }
    // let current_datetime = "2019-01-01";
    let current_datetime = new Date("2019-01-01");
    const [key, setKey] = useState((current_datetime.getFullYear() + "-" + appendLeadingZeroes(current_datetime.getMonth() + 1) + "-" + appendLeadingZeroes(current_datetime.getDate())).toString());
    const renderShowTimes = () => {
        let num = 0;
        let result = [];
        for (let i = 0; i < 10; i++) {
            // let formatted_date = '2019-01-0' + num;
            let formatted_date = (current_datetime.getFullYear() + "-" + appendLeadingZeroes(current_datetime.getMonth() + 1) + "-" + appendLeadingZeroes(current_datetime.getDate() + num)).toString();
            result.push(
                <TabPane
                    tab={
                        <>
                            {/* <p>{formatted_date}</p> */}
                            <p>{moment(formatted_date).format('DD-MM')}</p>
                        </>
                    }
                    key={formatted_date}
                >
                    {renderRap()}

                </TabPane>
            )
            num++;
        }


        return result;
    };
    const renderTime = () => {
        let result = [];
        for (let i = 0; i < showTimes.length; i++) {
            let item = showTimes[i].cumRapChieu;
            for (let j = 0; j < item.length; j++) {
                let child = item[j].lichChieuPhim;
                let arrTime = [];
                let ma = [];
                for (let k = 0; k < child.length; k++) {
                    if (child[k].ngayChieuGioChieu.indexOf(key) !== -1) {
                        arrTime.push(child[k].ngayChieuGioChieu);
                        ma.push(child[k].maLichChieu);
                    }
                }
                if (arrTime.length > 0) {
                    result.push({
                        tenCumRap: item[j].tenCumRap,
                        ngayChieu: key,
                        suatChieu: arrTime,
                        maLichChieu: ma
                    })
                }
            }
        }
        return result;
    }

    const renderSuat = (num) => {
        let result = [];
        let render = renderTime();
        for (let i = 0; i < render.length; i++) {
            let suat = render[i].suatChieu;
            if (i === num) {
                if (suat.length > 0) {
                    for (let j = 0; j < suat.length; j++) {
                        if (suat[j].indexOf(key) !== -1) {
                            result.push(
                                <Link to={`/bookTicket/${render[i].maLichChieu[j]}`} key={i + Math.random() * 99999} onClick={() => {
                                    dispatch(action.getInfoBookTicket({
                                        taiKhoanNguoiDung: userLogin.taiKhoan,
                                        maLichChieu: render[i].maLichChieu[j]
                                    }))
                                }}>
                                    {/* {suat[j].slice(-8, -3)} */}
                                    {moment(suat[j]).format('hh:mm')}
                                </Link>
                            )
                        }
                    }
                }
            }
        }
        return result;
    }

    const renderRap = () => {
        let result = [];
        let render = renderTime();
        for (let i = 0; i < render.length; i++) {
            result.push(
                <div className="divide__showtimes" key={i + Math.random() * 999999}>
                    <Row gutter={[16, 16]}>
                        <Col lg={8}>
                            <div className="theaters">
                                <h4>{render[i].tenCumRap}</h4>
                                <p>Tang 4, TTTM Satra Pham Hung, C6/27 Pham Hung, Binh Chanh,TP.HCM</p>
                            </div>
                        </Col>
                        <Col lg={16}>
                            <div className="rate">
                                {renderSuat(i)}
                            </div>
                        </Col>
                    </Row>
                </div>
            )
        }
        return result;
    }


    const callback = (key) => {
        setKey(key);
    }

    // Kiem tra phim chieu chua
    const [check, setCheck] = useState(null);
    const getFilmAPI = () => {
        axios({
            method: 'GET',
            url: `${API}/QuanLyPhim/LayThongTinPhim?MaPhim=${match.params.MaPhim}`
        }).then(res => {
            // let time = new Date(res.data.ngayKhoiChieu.slice(0, 10));
            let time = new Date(moment(res.data.ngayKhoiChieu).format('YYYY-MM-DD'));

            let now = new Date();
            if (time.getTime() > now.getTime()) {
                setCheck(false);
            } else {
                setCheck(true);
            }
        }).catch(err => console.log(err));
    }


    return (
        <div className="detail__movie">
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
                    <div className="detail__movie__wrapper">
                        <div className="movie">
                            <Row gutter={16}>
                                <Col lg={8}>
                                    <img src={detail.hinhAnh} alt={detail.hinhAnh} height="540px" width="100%" />
                                </Col>
                                <Col lg={16}>
                                    <div className="info">
                                        <article className="title">{detail.tenPhim}</article>
                                        <p className="describe">{detail.moTa}</p>
                                        <div className="divide">
                                            <p>Khởi chiếu:</p>
                                            {/* <p>{detail.ngayKhoiChieu}</p> */}
                                            <p>{moment(detail.ngayKhoiChieu).format('DD-MM-YYYY hh:mm')}</p>
                                        </div>
                                        <div className="divide">
                                            <p>Đánh giá: </p>
                                            <p>{detail.danhGia}</p>
                                        </div>
                                        <div className="controls">
                                            <button className="ant-btn ant-btn-danger" onClick={() => showModal()}>XEM TRAILER</button>
                                            {check ?
                                                <button className="ant-btn ant-btn-primary" onClick={executeScroll}>MUA VÉ NGAY</button>
                                                :
                                                <></>
                                            }
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        {check ?
                            <div className="movie__showtimes" ref={myRef}>
                                <h1>Lịch chiếu</h1>
                                <Tabs defaultActiveKey={key} onChange={callback} >
                                    {renderShowTimes()}
                                </Tabs>
                            </div>
                            :
                            <></>
                        }
                    </div>

                    <Modal
                        visible={modalStyle.visible}
                        confirmLoading={modalStyle.confirmLoading}
                        className="trailer__modal"
                        footer=""
                        onCancel={handleCancel}
                    >
                        <iframe style={{ width: '100%', height: '400px' }} src={detail.trailer}>
                        </iframe>
                    </Modal>
                </>
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        userLogin: state.userLoginStore.userLogin,
        reload: state.theaters.reload
    }
}

export default connect(mapStateToProps)(withRouter(DetailMovie));
