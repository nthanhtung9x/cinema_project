import React, { useRef, useEffect, useState } from 'react';
import { Row, Col, Tabs } from 'antd';
import { connect } from 'react-redux';
import axios from 'axios';
import { API } from '../../configs/configs';
import { Link } from 'react-router-dom';
import moment from 'moment';
import * as action from '../../redux/Actions';


const { TabPane } = Tabs;
const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop) 

const TheatersComponent = ({ match, dispatch, userLogin, reload }) => {

    //scroll
    const myRef = useRef(null);
    const executeScroll = async(maRap) => {
        await setToggle(true);
        await setMaCumRap(maRap);
        await scrollToRef(myRef);
    };
    const [toggle, setToggle] = useState(false);

    const [theatersList, setTheatersList] = useState([]);
    const [maCumRap, setMaCumRap] = useState("");

    const handleGetTheaters = () => {
        axios({
            method:"GET",
            url:`${API}/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${match.params.maHeThongRap}`
        }).then(res => {
            setTheatersList(res.data);
        }).catch(err => console.log(err));
    }
    const renderTheatersList = () => {
        return theatersList.map((item, index) => {
            return  <Col span={24} lg={6} key={index}>
                        <div className="theater__item">
                            <a onClick={() => executeScroll(item.maCumRap)}>
                                <p>{item.tenCumRap}</p>
                                <span>{item.diaChi}</span>
                            </a>
                        </div>
                    </Col>
        });
    }

    const [showTimes, setShowTimes] = useState([]);
    const getShowTimes = () => {
        axios({
            method: 'GET',
            url: `${API}/QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=${match.params.maHeThongRap}&maNhom=GP06`
        }).then(res => {
            setShowTimes(res.data[0].lstCumRap);
        }).catch(err => console.log(err));
    } 

    const handleScrollTop = () => {
        window.scrollTo(0,0);
    }

    useEffect(() => {
        handleGetTheaters();
        getShowTimes();
        handleScrollTop();
    },[reload]);

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
                            <p>{moment(formatted_date).format('DD-MM')}</p>
                        </>
                    }
                    key={formatted_date}
                >
                    { renderPhim() }

                </TabPane>
            )
            num++;
        }
        return result;
    };
    
    const renderPhim = () => {
        let result = [];
        if(showTimes.length > 0) {
            for(let i = 0; i < showTimes.length; i++) {
                if(showTimes[i].maCumRap === maCumRap) {
                    let child = showTimes[i].danhSachPhim;
                    for(let j = 0; j < child.length; j++) {
                        result.push(
                            <div className="divide__showtimes" key={j + Math.random() * 999999}>
                                <Row gutter={[16, 16]}>
                                    <Col span={24} lg={8}>
                                        <div className="films">
                                            <img src={child[j].hinhAnh} alt={child[j].hinhAnh}/>
                                        </div>
                                    </Col>
                                    <Col span={24} lg={16}>
                                        <div className="rate">
                                            { renderSuat(j) }
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )
                    }
                    break;
                }
            }
        }
        return result;
    }

    const renderSuat = (num) => {
        let result = [];
        if(showTimes.length > 0) {
            for(let i = 0; i < showTimes.length; i++) {
                if(showTimes[i].maCumRap === maCumRap) {
                    let child = showTimes[i].danhSachPhim;
                    for(let j = 0; j < child.length; j++) {
                        let temp = child[j].lstLichChieuTheoPhim;
                        if(j === num) {
                            for(let k = 0; k < temp.length; k++) {
                                if(temp[k].ngayChieuGioChieu.slice(0,10) === key) {
                                    result.push(
                                        <Link to={`/bookTicket/${temp[k].maLichChieu}`} key={i + Math.random() * 99999} onClick={() => {
                                            dispatch(action.getInfoBookTicket({
                                                taiKhoanNguoiDung: userLogin.taiKhoan,
                                                maLichChieu: temp[k].maLichChieu
                                            }))
                                        }}>
                                            {temp[k].ngayChieuGioChieu.slice(-8, -3)}
                                        </Link>
                                    )
                                }
                            }
                        }

                    }
                    break;
                }
            }
        }
        return result;
    }

    const callback = (key) => {
        setKey(key);
    }

    return (
        <div className="theaters">
            <div className="theaters__wrapper">
                <h1>DANH SÁCH RẠP {match.params.maHeThongRap}</h1>
                <Row gutter={[16, 16]}>
                   { renderTheatersList() }
                </Row>
                
                { toggle ? 
                        <Row gutter={[16, 16]}>
                            <div className="movie__showtimes" ref={myRef}>
                                <h1>Lịch chiếu</h1>
                                <Tabs defaultActiveKey={key} onChange={callback}>
                                    {renderShowTimes()}
                                </Tabs>
                            </div>
                        </Row>
                    :
                        <></>
                }
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        userLogin: state.userLoginStore.userLogin,
        reload: state.theaters.reload
    }
}

export default connect(mapStateToProps)(TheatersComponent);
