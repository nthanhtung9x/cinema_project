import React, { useEffect, useState, useCallback } from 'react';


import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import * as action from '../../../redux/Actions';

import { Table, Menu, Dropdown, Space, Row, Button } from 'antd';

import { DownOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import { useHistory } from 'react-router-dom';



const TableTheaters = () => {
    const dispatch = useDispatch();
    const danhSachRap = useSelector(state => state.theaters.danhSachRap);
    const [danhSachLichChieuRap, setDanhSachLichChieuRap] = useState([]);

    const [expandedRow, setExpandedRow] = useState(null);

    const handleExpand = (expanded, record) => {
        if (expanded) {
            setExpandedRow(record.key);
            return axios({
                method: "GET",
                url: `http://movie0706.cybersoft.edu.vn/api/QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=${record.maHeThongRap}&maNhom=GP06`
            }).then(res => {
                setDanhSachLichChieuRap([...res.data[0].lstCumRap]);
            }).catch(err => console.log(err));
        } else {
            setExpandedRow(undefined);
        }
    }

    const renderExpanded = () => {
        console.log(danhSachLichChieuRap);

        return danhSachLichChieuRap.map((item, index) => {
            return {
                key: index,
                maCumRap: item.maCumRap,
                tenCumRap: item.tenCumRap,
                diaChi: item.diaChi,
                danhSachPhim: item.danhSachPhim
            }
        });
    }

    const danhSachMaRap = (tenCumRap) => {
        let list = [];
        for(let i = 0; i < danhSachLichChieuRap.length; i++) {
            let item = danhSachLichChieuRap[i].danhSachPhim;
            for(let j = 0; j < item.length; j++) {
                let child = item[j].lstLichChieuTheoPhim;
                for(let k = 0; k < child.length; k++) {
                    list.push({
                        maRap: child[k].maRap,
                        tenRap: child[k].tenRap
                    })
                }
            }
        }

        let result = [];
        for(let i = 0; i < list.length - 1; i++) {
            if(list[i].maRap !== list[i+1].maRap) {
                result.push(list[i]);
            }
            if((i+1) === (list.length -1)) {
                result.push(list[i+1])
            }
        }
        return {
            tenCumRap,
            danhSachMaRap: result
        };
    }

    const expandedRowRender = (item, index) => {

        const columns = [
            { title: 'TÊN CỤM RẠP', dataIndex: 'tenCumRap', key: 'tenCumRap' },
            { title: 'ĐỊA CHỈ', dataIndex: 'diaChi', key: 'diaChi' },
            {
                title: 'ACTION',
                render: (item) => {
                    console.log(item);
                    return <Space size="middle">
                        <Button
                            className="ant-btn-primary"
                            size="large"
                            onClick={() => {
                                setDanhSachPhim(item.danhSachPhim)
                                showModal()
                            }}
                        >
                            Phim Chiếu
                        </Button>
                        <Button
                            className="ant-btn-danger"
                            size="large"
                            onClick={() => {
                                dispatch(action.getIdRapList(danhSachMaRap(item.tenCumRap)))
                                history.push(`/admin/infoTheater/${item.maCumRap}`);
                            }}
                        >
                            Thông Tin Rạp
                        </Button>
                    </Space>
                },
            },
        ];
        return <Table 
                    columns={columns} 
                    dataSource={renderExpanded()} 
                    pagination={false} 
                    
                />;
    };

    const columns = [
        {
            title: 'LOGO',
            dataIndex: 'logo',
            key: 'logo',
            render: (item) => <img src={item} alt={item} />
        },
        { title: 'MÃ HỆ THỐNG RẠP', dataIndex: 'maHeThongRap', key: 'maHeThongRap' },
        { title: 'TÊN HỆ THỐNG RẠP', dataIndex: 'tenHeThongRap', key: 'tenHeThongRap' },
        { title: 'BÍ DANH', dataIndex: 'biDanh', key: 'biDanh' },
    ];

    const getTheatersList = () => {
        dispatch(action.getTheatersAPI());
    };

    useEffect(() => {
        getTheatersList();
    }, []);

    const renderTheaters = () => {
        return danhSachRap.map((item, index) => {
            return {
                key: index,
                logo: item.logo,
                maHeThongRap: item.maHeThongRap,
                tenHeThongRap: item.tenHeThongRap,
                biDanh: item.biDanh
            }
        })
    };


    // modal showtimes
    const [expandedFilmRow, setExpandedFilmRow] = useState(null);

    const [modalShowTimes, setModalShowTimes] = useState({
        visible: false
    })

    const [danhSachPhim, setDanhSachPhim] = useState([]);
    const [maPhim, setMaPhim] = useState(null);

    const columnsFilm = [
        {
            title: 'HÌNH ẢNH',
            dataIndex: 'hinhAnh',
            key: 'hinhAnh',
            render: (item) => <img src={item} alt={item} />
        },
        { title: 'MÃ PHIM', dataIndex: 'maPhim', key: 'maPhim' },
        { title: 'TÊN PHIM', dataIndex: 'tenPhim', key: 'tenPhim' },
    ];

    const handleExpandFilm = (expanded, record) => {
        if(expanded) {
            setMaPhim(record.maPhim);
            setExpandedFilmRow(record.key);
        } else {
            setExpandedFilmRow(undefined);
        }
    }

    const renderExpandedFilm = () => {
        let result = [];
        for(let i = 0; i < danhSachPhim.length; i++) {
            if(danhSachPhim[i].maPhim === maPhim) {
                let temp = danhSachPhim[i].lstLichChieuTheoPhim;
                for(let j = 0; j < temp.length; j++) {
                    result.push({
                        key: j,
                        maLichChieu: temp[j].maLichChieu,
                        maRap: temp[j].maRap,
                        tenRap: temp[j].tenRap,
                        ngayChieuGioChieu: temp[j].ngayChieuGioChieu,
                        giaVe: temp[j].giaVe
                    })
                }
            } 
        }
        return result;
    }

    const history = useHistory();
    const handleChangeShomeTimes = (record) => {
        return history.push(`/admin/showTimes/${record.maLichChieu}`);
    }


    const expandedRowRenderFilm = (item, index) => {
        const columns = [
            { title: 'MÃ LỊCH CHIẾU', dataIndex: 'maLichChieu', key: 'maLichChieu' },
            { title: 'MÃ RẠP', dataIndex: 'maRap', key: 'maRap' },
            { title: 'TÊN RẠP', dataIndex: 'tenRap', key: 'tenRap' },
            { title: 'NGÀY CHIẾU', dataIndex: 'ngayChieuGioChieu', key: 'ngayChieuGioChieu' },
            { 
                title: 'GIÁ VÉ', 
                dataIndex: 'giaVe', 
                key: 'giaVe',
                render: (giaVe) => giaVe.toLocaleString() + 'đ'
            },
        ];
        return <Table 
                    columns={columns} 
                    dataSource={renderExpandedFilm()} 
                    pagination={{ pageSize: 5 }} 
                    onRow={(record, rowIndex) => {
                        return {
                        onClick: () => handleChangeShomeTimes(record)
                        };
                    }}
                />;
    };

    const renderTheatersFilm = () => {
        return danhSachPhim.map((item, index) => {
            return {
                key: index,
                hinhAnh: item.hinhAnh,
                maPhim: item.maPhim,
                tenPhim: item.tenPhim,
            }
        })
    };

    const showModal = () => {
        setModalShowTimes({
            visible: true,
        });
    };

    const handleCancel = () => {
        setModalShowTimes({
          visible: false,
        });
    };


    return (
        <>
            <Row gutter={[16, 16]}>
                <Table
                    className="components-table-demo-nested"
                    columns={columns}
                    expandable={{ expandedRowRender }}
                    dataSource={renderTheaters()}
                    onExpand={handleExpand}
                    expandedRowKeys={[expandedRow]}
                />

                <Modal
                    title="PHIM ĐANG CHIẾU"
                    visible={modalShowTimes.visible}
                    footer=""
                    className="modal__historyBookTicket"
                    // confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                >
                    <Table
                        className="components-table-demo-nested"
                        columns={columnsFilm}
                        expandable={{ expandedRowRender: expandedRowRenderFilm }}
                        dataSource={renderTheatersFilm()}
                        onExpand={handleExpandFilm}
                        pagination={{ pageSize: 5 }}
                        expandedRowKeys={[expandedFilmRow]}
                    />
                </Modal>
            </Row>
        </>
    )
}

export default React.memo(TableTheaters);
