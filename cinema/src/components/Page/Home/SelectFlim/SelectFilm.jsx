import React, { useState } from 'react';
import { Select } from 'antd';
import { connect } from 'react-redux';
import axios from 'axios';
import { API } from '../../../../configs/configs';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import moment from 'moment';

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
            url: `${API}/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${values}`
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
                                result.push(<Option value={moment(child.lichChieuPhim[i].ngayChieuGioChieu).format('YYYY-MM-DD')} key={i}>{moment(child.lichChieuPhim[i].ngayChieuGioChieu).format('DD-MM-YYYY')}</Option>)
                            }

                            if(moment(child.lichChieuPhim[i].ngayChieuGioChieu).format('YYYY-MM-DD') !== moment(child.lichChieuPhim[i + 1].ngayChieuGioChieu).format('YYYY-MM-DD')){
                                result.push(<Option value={moment(child.lichChieuPhim[i].ngayChieuGioChieu).format('YYYY-MM-DD')} key={i}>{moment(child.lichChieuPhim[i].ngayChieuGioChieu).format('DD-MM-YYYY')}</Option>)
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
                                notFoundContent="VUI LÒNG CHỌN PHIM"
                            >
                                {renderTheater()}
                            </Select>
                        </div>

                        <div className="item">
                            <Select
                                placeholder="Chọn Ngày"
                                onChange={onChangeDay}
                                size="large"
                                notFoundContent="VUI LÒNG CHỌN RẠP"
                            >
                                {renderDay()}
                            </Select>
                        </div>

                        <div className="item">
                            <Select
                                placeholder="Chọn Suất"
                                onChange={onChangeShowTime}
                                size="large"
                                notFoundContent="VUI LÒNG CHỌN NGÀY CHIẾU"
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
