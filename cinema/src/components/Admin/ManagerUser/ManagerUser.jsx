import React, { useState } from 'react';
import { Input, Row, Col, Button, Form, Select, Modal, message } from 'antd';
import {
    AppstoreAddOutlined
} from "@ant-design/icons";
import TableUser from './TableUser';

import axios from 'axios';
import { connect } from 'react-redux';
import * as action from '../../../redux/Actions';

import Swal from 'sweetalert2';

const { Search } = Input;
const { Option } = Select;

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
        span: 24,
        offset: 0,
        },
        sm: {
        span: 16,
        offset: 8,
        },
    },
};


const ManagerUser = ({ dispatch }) => {
    const [searchUserName, setSearchUserName] = useState("");
    const [searchName, setSearchName] = useState("");


    // modal add user
    const [modalStyle, setModalStyle] = useState({
        visible: false,
        loading: false,
    });
    const { visible, loading } = modalStyle;
    const [form] = Form.useForm();

    const showModalAddUser = async() => {
        await form.setFieldsValue({
            taiKhoan: "",
            hoTen: "",
            matKhau: "",
            confirm: "",
            email: "",
            soDt:"",
            maLoaiNguoiDung: "",
            maNhom: "GP06"
        });
        
        setModalStyle({
            ...modalStyle,
            visible: true,
        });
    };

    const handleCancel = () => {
        setModalStyle({
            ...modalStyle,
            visible: false,
        });
    };

    const onFinish = async(values) => {
        axios({
            method:'POST',
            url:'http://movie0706.cybersoft.edu.vn/api/QuanLyNguoiDung/ThemNguoiDung',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
            },
            data: {
                taiKhoan: values.taiKhoan,
                matKhau: values.matKhau,
                email: values.email,
                soDt: values.soDt,
                maNhom: values.maNhom,
                maLoaiNguoiDung: values.maLoaiNguoiDung,
                hoTen: values.hoTen
            }
        }).then(res => {
            dispatch(action.getUserListAPI());
            setModalStyle({
                ...modalStyle,
                loading: true,
            });
            setTimeout(() => {
                setModalStyle({
                    ...modalStyle,
                    visible: false,
                    loading: false,
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Tạo thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
            }, 1000);
        }).catch(err => {
            console.log(err.response.data);
            message.error(err.response.data);
        });
    };


    // end modal add user

    return (
        <div className="users">
            <Row gutter={[16, 16]}>
                <Col lg={8}>
                    <Search
                        placeholder="Tìm kiếm theo Tài Khoản"
                        onSearch={value => {
                            setSearchUserName(value);
                        }}
                        className="users__search"
                        size="large"
                    />
                </Col>
                <Col lg={8}>
                    <Search
                        placeholder="Tìm kiếm theo Tên"
                        onSearch={value => setSearchName(value)}
                        className="users__search"
                        size="large"
                    />
                </Col>
                <Col lg={8}>
                    <Button type="primary" danger shape="round" className="btn-controls" icon={<AppstoreAddOutlined />} size="large" onClick={showModalAddUser}>
                        THÊM NGƯỜI DÙNG
                    </Button>
                </Col>
            </Row>

            <Row gutter={[16,16]}>
                <TableUser searchUserName={searchUserName} searchName={searchName}/>
            </Row>

            <Modal
                title="Thêm người dùng"
                visible={visible}
                footer=""
                onCancel={handleCancel}
                className="modal__addUser"
                >
               <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    initialValues={{
                        prefix: '84',
                    }}
                    scrollToFirstError
                >
                    <Form.Item
                        name="taiKhoan"
                        label="Tên tài khoản"
                        rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên tài khoản',
                        },
                        {
                            min:8,
                            message: 'Tên tài khoản tối thiểu 8 ký tự!'
                        },
                        {
                            max:50,
                            message: 'Tên tài khoản tối đa 50 ký tự'
                        }
                        ]}
                    >
                        <Input placeholder="Nhập tên tài khoản"/>
                    </Form.Item>
                    <Form.Item
                        name="matKhau"
                        label="Mật khẩu"
                        rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu!',
                        },
                        {
                            pattern:new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"),
                            message: 'Mật khẩu có ít nhất 8 ký tự, gồm 1 chữ viết hoa, 1 số và 1 ký tự đặc biệt'
                        }
                        ]}
                        hasFeedback
                    >
                        <Input.Password placeholder="Nhập mật khẩu"/>
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="Xác thực mật khẩu"
                        dependencies={['matKhau']}
                        hasFeedback
                        rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập lại mật khẩu!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                            if (!value || getFieldValue('matKhau') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject('Xác thực không chính xác!');
                            },
                        }),
                        ]}
                    >
                        <Input.Password placeholder="Nhập lại mật khẩu"/>
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="email"
                        rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập email',
                        },
                        {
                            type:'email',
                            message:'Email không hợp lệ'
                        }
                        ]}
                    >
                        <Input placeholder="Nhập email"/>
                    </Form.Item>
                    <Form.Item
                        name="hoTen"
                        label="Họ tên"
                        rules={[
                        {
                            type: 'string',
                            message: 'Vui lòng nhập họ tên!',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập họ tên!',
                        },
                        {
                            min:8,
                            message: 'Họ tên tối thiểu 8 ký tự!'
                        },
                        {
                            max:50,
                            message: 'Họ tên tối đa 50 ký tự'
                        }
                        ]}
                    >
                        <Input placeholder="Nhập họ tên"/>
                    </Form.Item>
                    <Form.Item
                        name="soDt"
                        label="Số điện thoại"
                        rules={[
                            { 
                                required: true, 
                                message: 'Vui lòng nhập số điện thoại!' 
                            },
                            {
                                pattern: new RegExp("^[0-9]+$"),
                                message: "Số điện thoại chỉ được nhập số!"
                            }      
                        ]}
                    >
                        <Input style={{ width: '100%' }} placeholder="Nhập số điện thoại"/>
                        
                    </Form.Item>
                    <Form.Item
                        name="maLoaiNguoiDung"
                        label="Mã loại người dùng"
                        rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn loại người dùng!',
                        }
                        ]}
                        hasFeedback
                    >
                        <Select>
                            <Option value="KhachHang">Khách Hàng</Option>
                            <Option value="QuanTri">Quản Trị</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="maNhom"
                        hidden
                    >
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button key="back" onClick={handleCancel} size="large">
                            Thoát
                        </Button>
                        <Button type="primary" htmlType="submit" size="large" loading={loading}>
                            Tạo
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default connect()(ManagerUser);
