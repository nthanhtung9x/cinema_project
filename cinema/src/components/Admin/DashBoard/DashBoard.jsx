import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { Bar, defaults, Doughnut, HorizontalBar } from "react-chartjs-2";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as action from '../../../redux/Actions';
import { DoubleRightOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom';
import { API } from '../../../configs/configs';

defaults.global.defaultFontFamily = 'Roboto';

const legendOpts = {
    display: true,
    position: 'bottom',
    fullWidth: true,
    reverse: false,
    labels: {
        fontColor: 'rgb(255, 99, 132)',
        padding: 30,
        fontSize: 16
    },
};

const DashBoard = () => {
    const dispatch = useDispatch();
    const theaters = useSelector(state => state.theaters.danhSachRap);

    const [userList, setUserList] = useState({});
    const [theaterListCount, setTheaterListCount] = useState({
        BHDStar: 0,
        CGV: 0,
        CineStar: 0,
        Galaxy: 0,
        LotteCinima: 0,
        MegaGS: 0
    });

    const [showTimesCount, setShowTimesCount] = useState({
        BHDStar: 0,
        CGV: 0,
        CineStar: 0,
        Galaxy: 0,
        LotteCinima: 0,
        MegaGS: 0
    });


    const promiseUserList = async () => {
        await getCountUser('GP01');
        await getCountUser('GP02');
        await getCountUser('GP03');
        await getCountUser('GP04');
        await getCountUser('GP05');
        await getCountUser('GP06');
    };

    const getCountUser = (maNhom) => {
        return axios({
            method: 'GET',
            url: `${API}/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${maNhom}`
        }).then((res) => {
            let count = res.data.length;
            if (count) {
                setUserList((userList) => ({
                    ...userList,
                    [maNhom]: count
                }));
            }
        })
            .catch(err => console.log(err));
    };

    const handleTheaters = () => {
        if (theaters.length <= 0) {
            dispatch(action.getTheatersAPI());
        }
    };

    const renderTheaters = () => {
        return theaters.map((item) => item.maHeThongRap);
    };

    const promiseTheaterCount = async() => {
        for (let i = 0; i < theaters.length; i++) {
            await getCountTheater(theaters[i].maHeThongRap);
        }
    };

    const getCountTheater = (maHeThongRap) => {
        axios({
            method: 'GET',
            url: `${API}/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`
        }).then((res) => {
            let count = res.data.length;
            if (count) {
                setTheaterListCount((theaterList) => ({
                    ...theaterList,
                    [maHeThongRap]: count
                }));
            }
        }).catch(err => console.log(err));
    }

    const renderTheaterCount = () => {
        let result = [];
        for (let key in theaterListCount) {
            result.push(theaterListCount[key]);
        }
        return result;
    }

    const getShowTimesTheater = (maHeThongRap) => {
        axios({
            method: "GET",
            url: `${API}/QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=${maHeThongRap}&maNhom=GP06`
        }).then(res => {
            let count = 0;
            let temp = res.data[0].lstCumRap;
            for(let i = 0; i < temp.length; i++) {
                let item = temp[i].danhSachPhim;
                for(let j = 0; j < item.length; j++) {
                    count += item[j].lstLichChieuTheoPhim.length;
                }
            }
            if(count > 0) {
                setShowTimesCount((showTimesList) => ({
                    ...showTimesList,
                    [maHeThongRap]: count
                }));
            }
        }).catch(err => console.log(err));
    }

    const promiseGetShowtimeTheaters = async() => {
        for (let i = 0; i < theaters.length; i++) {
            await getShowTimesTheater(theaters[i].maHeThongRap);
        }
    }

    const renderShowtimeCount = () => {
        let result = [];
        for (let key in showTimesCount) {
            result.push(showTimesCount[key]);
        }
        return result;
    }

    const handleScrollTop = () => {
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        promiseUserList();
        handleTheaters();
        handleScrollTop();
    }, []);

    useEffect(() => {
        if (theaters.length > 0) {
            async function fetchData() {
                const tempFunc = await promiseTheaterCount();
                const showtimeFunc = await promiseGetShowtimeTheaters();
            }
            fetchData();
        }
    }, [theaters.length]);

    return (
        <div className="dashBoard">
            <div className="dashBoard__wrapper">
                <Row gutter={[16,16]}>
                    <Col span={24} lg={8}>
                        <div className="dashBoard__controls">
                            <Link 
                                className="btn__controls btn__controls-1"
                                to="/admin/managerUser"
                            >
                                Quản Trị Người Dùng
                                <DoubleRightOutlined />
                            </Link>
                        </div>
                    </Col>
                    <Col span={24} lg={8}>
                        <div className="dashBoard__controls">
                            <Link 
                                className="btn__controls btn__controls-2"
                                to="/admin/managerFilm"
                            >
                                Quản Trị Phim
                                <DoubleRightOutlined />
                            </Link>
                        </div>
                    </Col>
                    <Col span={24} lg={8}>
                        <div className="dashBoard__controls">
                            <Link 
                                className="btn__controls btn__controls-3"
                                to="/admin/managerTheaters"
                            >
                                Quản Trị Rạp
                                <DoubleRightOutlined />
                            </Link>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row gutter={[24, 24]}>
                <Col span={24} lg={12}>
                    <div className="map">
                        <Bar
                            className="map__wrapper"
                            height={200}
                            data={{
                                labels: [
                                    "NHÓM 1",
                                    "NHÓM 2",
                                    "NHÓM 3",
                                    "NHÓM 4",
                                    "NHÓM 5",
                                    "NHÓM 6"
                                ],

                                datasets: [
                                    {
                                        label: "TỔNG SỐ LƯỢNG THÀNH VIÊN MỖI NHÓM",
                                        backgroundColor: [
                                            "#3e95cd",
                                            "#8e5ea2",
                                            "#3cba9f",
                                            "#e8c3b9",
                                            "#c45850",
                                            "#001529",
                                        ],
                                        data: [userList.GP01, userList.GP02, userList.GP03, userList.GP04, userList.GP05, userList.GP06]
                                    }
                                ]
                            }}
                            options={{
                                legend: { display: false },
                                title: {
                                    display: true,
                                    text: "THỐNG KÊ SỐ LƯỢNG THÀNH VIÊN",
                                    fontSize: 20,
                                    padding: 24
                                },
                                scales: {
                                    yAxes: [{ticks: {fontSize: 16, fontFamily: "'Roboto', sans-serif", fontColor: '#000', fontStyle: '500'}}],
                                    xAxes: [{ticks: {fontSize: 16, fontFamily: "'Roboto', sans-serif", fontColor: '#000', fontStyle: '500'}}]
                                },
                                responsive: true,
                                maintainAspectRatio:false

                            }}
                        />
                    </div>
                </Col>
                <Col span={24} lg={12}>
                    <div className="map">
                        <h1>THỐNG KÊ SỐ LƯỢNG RẠP</h1>
                        <Doughnut
                            legend={legendOpts}
                            height={200}
                            data={{
                                labels: renderTheaters(),
                                datasets: [
                                    {
                                        label: "Số lượng rạp",
                                        backgroundColor: [
                                            "#3e95cd",
                                            "#8e5ea2",
                                            "#3cba9f",
                                            "#e8c3b9",
                                            "#c45850",
                                            "#001529",
                                        ],
                                        data: renderTheaterCount()
                                    }
                                ]
                            }}
                            option={{
                                responsive: true,
                                maintainAspectRatio:false

                            }}
                        />
                    </div>
                </Col>
            </Row>
            <Row>
                <div className="map">
                    <HorizontalBar
                        className="map__wrapper"
                        height={120}
                        data={{
                            labels:  renderTheaters(),
                            datasets: [
                                {
                                    label: "TỔNG SỐ LƯỢNG SUẤT CHIẾU",
                                    backgroundColor: [
                                        "#3e95cd",
                                        "#8e5ea2",
                                        "#3cba9f",
                                        "#e8c3b9",
                                        "#c45850",
                                        "#001529",
                                    ],
                                    data: renderShowtimeCount()
                                }
                            ]
                        }}
                        options={{
                            legend: { display: false },
                            title: {
                                display: true,
                                text: "THỐNG KÊ SỐ LƯỢNG SUẤT CHIẾU HỆ THỐNG RẠP",
                                fontSize: 24,
                                padding: 24,
                            },
                            scales: {
                                yAxes: [{ticks: {fontSize: 16, fontFamily: "'Roboto', sans-serif", fontColor: '#000', fontStyle: '500'}}],
                                xAxes: [{ticks: {fontSize: 16, fontFamily: "'Roboto', sans-serif", fontColor: '#000', fontStyle: '500'}}]
                            },
                            responsive: true,
                            maintainAspectRatio:false
                        }}
                    />
                </div>
            </Row>
        </div>
    )
}

export default DashBoard;
