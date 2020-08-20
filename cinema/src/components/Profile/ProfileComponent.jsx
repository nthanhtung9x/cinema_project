import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Form, Input, Button, Table, Tooltip, message } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};


const ProfileComponent = ({ userLogin }) => {
    const [toggle, setToggle] = useState(true);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [form] = Form.useForm();
    const getProfileUser = useCallback(() => {
        axios({
            method:"POST",
            url:'http://movie0706.cybersoft.edu.vn/api/QuanLyNguoiDung/ThongTinTaiKhoan',
            data: {
                taiKhoan: userLogin.taiKhoan
            }
        }).then(res => {
                form.setFieldsValue({
                    taiKhoan: res.data.taiKhoan,
                    matKhau: res.data.matKhau,
                    hoTen: res.data.hoTen,
                    email: res.data.email,
                    soDt: res.data.soDT,
                    maNhom: res.data.maNhom
                });
                const temp = res.data.thongTinDatVe.map((item, index) => {
                    return {
                        key:index,
                        ...item
                    }
                });
                setUser({
                    ...res.data,
                    thongTinDatVe: temp
                });
        }).catch(err => console.log(err));
    },[userLogin.taiKhoan]);
    
    useEffect(() => getProfileUser(),[]);

    const onFinish = values => {
        axios({
            method:'PUT',
            url:'http://movie0706.cybersoft.edu.vn/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
            },
            data: {
                taiKhoan: values.taiKhoan,
                matKhau: values.matKhau,
                email: values.email,
                soDt: values.soDt,
                maNhom: values.maNhom,
                maLoaiNguoiDung: "QuanTri",
                hoTen: values.hoTen
            }
        }).then(res => {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                getProfileUser();
                Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
            },1000);
        }).catch(err => {
            message.error(err.response.data);
        });
    };

    //table 
    const dataSource = user.thongTinDatVe;

    const columns = [
        {
            title: 'Mã Vé',
            key: 'maVe',
            render: (item) => (
                <Tooltip placement="topLeft" title={item.maVe}>
                    <span>{item.maVe}</span>
                </Tooltip>   
            )
        },
        {
            title: 'Tên Phim',
            key: 'tenPhim',
            render: (item) => (
                <Tooltip placement="topLeft" title={item.tenPhim}>
                    <span>{item.tenPhim}</span>
                </Tooltip>   
            )
        },
        {
            title: 'Ngày Đặt',
            key: 'ngayDat',
            render: (item) => (
                <Tooltip placement="topLeft" title={item.ngayDat}>
                    <span>{item.ngayDat}</span>
                </Tooltip>   
            )
        },
        {
            title: 'Giá Vé',
            key: 'giaVe',
            render: (item) => (
                <Tooltip placement="topLeft" title={item.giaVe.toLocaleString()}>
                    <span>{item.giaVe.toLocaleString()}</span>
                </Tooltip>   
            )
        },
        {
            title: 'Tên Rạp',
            key: 'tenHeThongRap',
            render: (item) => {
                let tenRap = item.danhSachGhe[0].tenHeThongRap;
                return <Tooltip placement="topLeft" title={tenRap}>
                            <span>{tenRap}</span>
                               
                </Tooltip>   
            }
        },
        {
            title: 'Phòng',
            key: 'tenRap',
            render: (item) => {
                let tenRap = item.danhSachGhe[0].tenRap;
                return <Tooltip placement="topLeft" title={tenRap}>
                            <span>{tenRap}</span>
                               
                </Tooltip>   
            }
        },
        {
            title: 'Ghế',
            key: 'danhSachGhe',
            render: (item) => {
                let tenGhe = item.danhSachGhe.map((item) => {
                    return item.tenGhe;
                }).join();
                return <Tooltip placement="topLeft" title={tenGhe}>
                            <span>{tenGhe}</span>        
                </Tooltip>   
            }
        }
    ];

    return (
        <div className="profile">
            <div className="profile__wrapper">
                <Row gutter={16}>
                    <Col lg={6} className="left-col">
                        <img src="https://picsum.photos/200/300" alt="" />
                        <ul className="profile__list">
                            <li>
                                <button className="ant-btn ant-btn-block" onClick={() => setToggle(true)}>Thông tin cá nhân</button>
                            </li>
                            <li>
                                <button className="ant-btn ant-btn-block" onClick={() => setToggle(false)}>Thông tin đặt vé</button>
                            </li>
                        </ul>
                    </Col>
                    <Col lg={18}>
                        {
                            toggle ? <div className="info__user">
                                <Form
                                    {...layout}
                                    form={form}
                                    onFinish={onFinish}
                                    name="info__form"
                                >
                                    <Form.Item
                                        label="Tài Khoản"
                                        name="taiKhoan"
                                        rules={[{ required: true, message: 'Please input your username!' }]}
                                    >
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Mật Khẩu"
                                        name="matKhau"
                                        rules={[{ required: true, message: 'Please input your password!' }]}
                                    >
                                        <Input.Password/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Họ Tên"
                                        name="hoTen"
                                        rules={[{ required: true, message: 'Please input your password!' }]}
                                    >
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[{ required: true, message: 'Please input your password!' }]}
                                    >
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Số Điện Thoại"
                                        name="soDt"
                                        rules={[{ required: true, message: 'Please input your password!' }]}
                                    >
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item
                                        hidden
                                        name="maNhom"
                                    >
                                    </Form.Item>

                                    <Form.Item {...tailLayout}>
                                        <Button type="primary" className="ant-btn-block" htmlType="submit" size="large" loading={loading}>
                                            Chỉnh sửa
                                    </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                                :
                                <div className="info_ticket">
                                    <Table dataSource={dataSource} columns={columns}  pagination={{ pageSize: 6 }} />
                                </div>
                        }
                    </Col>
                </Row>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        userLogin: state.userLoginStore.userLogin
    }
}

export default connect(mapStateToProps)(ProfileComponent);
