import React, { useState } from 'react';
import { Select } from 'antd';
import { connect } from 'react-redux';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const { Option } = Select;


const SelectFilm = ({ filmList }) => {
    const [search, setSearch] = useState({
        maPhim: "",
        maRap: "",
        maLichChieu: "",
        ngayChieu: "",
        suat: ""

    });
    const [theaters, setTheaters] = useState([]);
    // film
    const onChangeFilm = (values) => {
        setSearch({
            ...search,
            maPhim: values
        });
        axios({
            method: 'GET',
            url: `http://movie0706.cybersoft.edu.vn/api/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${values}`
        }).then(res => {
            setTheaters(res.data.heThongRapChieu);
        }).catch(err => console.log(err));
    }

    const renderFilm = () => {
        return filmList.danhSachPhim.map((item, index) => {
            return <Option value={item.maPhim} key={index}>{item.tenPhim}</Option>
        })
    }

    // Theater
    const onChangeTheater = (values) => {
        setSearch({
            ...search,
            maRap: values
        });
    }

    const renderTheater = () => {
        return theaters.map((item) => {
            return item.cumRapChieu.map((item, index) => {
                return <Option value={item.tenCumRap} key={index + Math.random() * 9999}>{item.tenCumRap}</Option>
            })
        })
    }

    // time day
    const onChangeDay = (values) => {
        console.log(values);
        setSearch({
            ...search,
            ngayChieu: values
        })
    }

    const renderDay = () => {
        let result = [];
        if (search.maRap) {
            return theaters.map((item) => {
                return item.cumRapChieu.map((child, index) => {
                    if(child.tenCumRap === search.maRap) {
                        for(let i = 0; i < child.lichChieuPhim.length - 1; i++) {
                            if((i + 1) === (child.lichChieuPhim.length - 1)) {
                                result.push(<Option value={child.lichChieuPhim[i].ngayChieuGioChieu.slice(0, 10)} key={i}>{child.lichChieuPhim[i].ngayChieuGioChieu.slice(0, 10)}</Option>)
                            }

                            if(child.lichChieuPhim[i].ngayChieuGioChieu.slice(0,10) !== child.lichChieuPhim[i + 1].ngayChieuGioChieu.slice(0,10)){
                                result.push(<Option value={child.lichChieuPhim[i].ngayChieuGioChieu.slice(0, 10)} key={i}>{child.lichChieuPhim[i].ngayChieuGioChieu.slice(0, 10)}</Option>)
                            }
                            
                        }
                        return result;
                    }
                })
            })
        }
        return result;
    }

    // Showtime
    const history = useHistory();
    const onChangeShowTime = (values) => {
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

        return history.push(`/bookTicket/${values}`);
    }

    const renderShowTime = () => {
        if (search.ngayChieu) {
            return theaters.map((item) => {
                return item.cumRapChieu.map((child) => {
                    if (child.tenCumRap === search.maRap) {
                        return child.lichChieuPhim.map((item, index) => {
                            if (item.ngayChieuGioChieu.indexOf(search.ngayChieu) !== -1) {
                                return <Option value={item.maLichChieu} key={index}>{item.ngayChieuGioChieu.slice(11, 16)}</Option>
                            }
                        })
                    }
                })
            })
        }
    }

    return (
        <div className="select__film">
            <div className="select__film-row">
                <div className="col">
                    <div className="block-title">
                        <h2>MUA VÉ ONLINE</h2>
                    </div>
                </div>
                <div className="col">
                    <div className="block-list">
                        <div className="item">
                            <Select
                                placeholder="Chọn Phim"
                                onChange={onChangeFilm}
                                size="large"
                            >
                                {renderFilm()}
                            </Select>
                        </div>

                        <div className="item">
                            <Select
                                placeholder="Chọn Rạp"
                                onChange={onChangeTheater}
                                size="large"
                            >
                                {renderTheater()}
                            </Select>
                        </div>

                        <div className="item">
                            <Select
                                placeholder="Chọn Ngày"
                                onChange={onChangeDay}
                                size="large"
                            >
                                {renderDay()}
                            </Select>
                        </div>

                        <div className="item">
                            <Select
                                placeholder="Chọn Suất"
                                onChange={onChangeShowTime}
                                size="large"
                            >
                                {renderShowTime()}
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        filmList: state.filmList
    }
}

export default connect(mapStateToProps)(SelectFilm);
