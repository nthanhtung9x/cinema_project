import React, { useState, useEffect } from 'react';
import { Table, Tooltip, Space, Button, Popconfirm, message } from 'antd';
import axios from 'axios';
import { API } from '../../../configs/configs';
import Swal from 'sweetalert2';
import FormUpdateFilm from './FormUpdateFilm';
import ModalHOC from '../../HOC/ModalHOC';

let WrappedModalUpdateFilm = ModalHOC(FormUpdateFilm, 'CẬP NHẬT');


const TableFilm = ({ searchName }) => {
    const [filmList, setFilmList] = useState({
        currentPage: 1,
        count: 10,
        totalPages: 2,
        totalCount: 17,
        items: []
    });
    const [numPage, setNumPage] = useState(1);
    const [itemPage, setItemPage] = useState(5);


    const getFilmList = () => {
        if(searchName) {
            axios({
                method: "GET",
                url: `${API}/QuanLyPhim/LayDanhSachPhim?maNhom=GP06&tenPhim=${searchName}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
                }
            }).then(res => {
                setFilmList({
                    ...filmList,
                    items: res.data
                });
            }).catch(err => console.log(err));
        } else {
            axios({
                method: "GET",
                url: `${API}/QuanLyPhim/LayDanhSachPhimPhanTrang?maNhom=GP06&soTrang=${numPage}&soPhanTuTrenTrang=${itemPage}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
                }
            }).then(res => {
                if (res.data.items.length) {
                    setFilmList(res.data);
                }
            }).catch(err => console.log(err));
        }
    }

    const HandleChange = (page) => {
        setNumPage(page.current);
    }

    useEffect(() => getFilmList(), [numPage, searchName]);

    const renderTable = () => {
        return filmList.items.map((child, index) => {
            return {
                key: index,
                ...child
            }
        })
    }

    const columns = [
        {
            title: 'MÃ PHIM',
            dataIndex: 'maPhim',
            key: 'maPhim',
        },
        {
            title: 'TÊN PHIM',
            dataIndex: 'tenPhim',
            key: 'tenPhim',
        },
        {
            title: 'BÍ DANH',
            dataIndex: 'biDanh',
            key: 'biDanh',
        },
        {
            title: 'HÌNH ẢNH',
            dataIndex: 'hinhAnh',
            key: 'hinhAnh',
            render: (item) => {
                return <img src={item} alt={item} />
            }
        },
        {
            title: 'MÔ TẢ',
            dataIndex: 'moTa',
            key: 'moTa',
            render: (item) => {
                return <Tooltip title={item}>{item.substring(0, 50)}...</Tooltip>
            }
        },
        {
            title: 'MÃ NHÓM',
            dataIndex: 'maNhom',
            key: 'maNhom',
        },
        {
            title: 'NGÀY KHỞI CHIẾU',
            dataIndex: 'ngayKhoiChieu',
            key: 'ngayKhoiChieu',
        },
        {
            title: 'ĐÁNH GIÁ',
            dataIndex: 'danhGia',
            key: 'danhGia',
        },
        {
            title: 'ACTION',
            render: (item) => {
                console.log(item)
                return <Space>
                    <WrappedModalUpdateFilm itemUpdate={item} name="PHIM" type="primary" shape="" icon=""/>

                    <Popconfirm 
                        title="Bạn muốn xóa phim này?" 
                        okText="Có" 
                        placement="top"
                        cancelText="Thoát"
                        onConfirm={() => handleDeleteFilm(parseInt(item.maPhim))}
                    >
                        <Button
                            className="ant-btn-danger"
                            size="large"
                        >Xóa</Button>
                    </Popconfirm>
                </Space>
            }
        }
    ];
     
    const handleDeleteFilm = (data) => {
        console.log(data);
        axios({
            method:"DELETE",
            url: `${API}/QuanLyPhim/XoaPhim?MaPhim=${data}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
            }
        }).then(res => {
            Swal.fire({
                position: 'top-center',
                icon: 'success',
                title: res.data,
                showConfirmButton: false,
                timer: 1500
            })
            getFilmList();
        }).catch(err => {
            Swal.fire({
                position: 'top-center',
                icon: 'error',
                title: err.response.data,
                showConfirmButton: false,
                timer: 1500
            })
        })
    }
   

    return (
        <Table
            dataSource={renderTable()}
            columns={columns}
            pagination={{ hideOnSinglePage: false, total: filmList.totalCount, pageSize: itemPage }}
            onChange={HandleChange}
        />
    )
}

export default React.memo(TableFilm);
