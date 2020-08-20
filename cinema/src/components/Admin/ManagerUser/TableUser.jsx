import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, Select, message, Tooltip, Popconfirm, Tag } from 'antd';

import { connect } from 'react-redux';
import * as action from '../../../redux/Actions';
import axios from 'axios';
import Swal from 'sweetalert2';

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


const TableUser = ({ userList, messageDelete, dispatch, searchUserName, searchName }) => {

    useEffect(() => {
        dispatch(action.getUserListAPI());
        console.log('he')
    },[]);

    useEffect(() => {
        if(messageDelete === "Xóa thành công!") {
            dispatch(action.getUserListAPI());
            message.success(messageDelete);
        } else if(messageDelete === "Người dùng này đã đặt vé xem phim không thể xóa!") {
            message.error(messageDelete);
        }
    },[messageDelete]);


    const renderData = () => {
        let result = [];
        if(userList.length > 0) {
            for(let i = 0 ; i < userList.length; i++) {
                if(searchUserName && !searchName){
                    if(userList[i].taiKhoan.toLowerCase().trim().indexOf(searchUserName.toLowerCase().trim()) !== -1) {
                        result.push({
                            key: i,
                            taiKhoan: userList[i].taiKhoan,
                            hoTen: userList[i].hoTen,
                            email: userList[i].email,
                            soDt: userList[i].soDt,
                            maLoaiNguoiDung: [userList[i].maLoaiNguoiDung],
                            matKhau: userList[i].matKhau
                        })
                    }
                }
                else if(searchName && !searchUserName){
                    if(userList[i].hoTen.toLowerCase().trim().indexOf(searchName.toLowerCase().trim()) !== -1) {
                        result.push({
                            key: i,
                            taiKhoan: userList[i].taiKhoan,
                            hoTen: userList[i].hoTen,
                            email: userList[i].email,
                            soDt: userList[i].soDt,
                            maLoaiNguoiDung: [userList[i].maLoaiNguoiDung],
                            matKhau: userList[i].matKhau
                        })
                    }
                } else {
                    result.push({
                        key: i,
                        taiKhoan: userList[i].taiKhoan,
                        hoTen: userList[i].hoTen,
                        email: userList[i].email,
                        soDt: userList[i].soDt,
                        maLoaiNguoiDung: [userList[i].maLoaiNguoiDung],
                        matKhau: userList[i].matKhau
                    })
                }
            }
           
        }
        return result;
    }

    const handleDeleteUser = (taiKhoan) => {
        dispatch(action.resetMessageUser());
        dispatch(action.deleteUserAPI(taiKhoan));
    }

    const columns = [
        {
          title: 'Tài Khoản',
          dataIndex: 'taiKhoan',
          key: 'taiKhoan',
          render: text => <a>{text}</a>,
        },
        {
          title: 'Họ Tên',
          dataIndex: 'hoTen',
          key: 'hoTen',
        },
        {
          title: 'Mail',
          dataIndex: 'email',
          key: 'email',
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'soDt',
            key: 'soDt',
        },
        {
          title: 'Loại',
          key: 'maLoaiNguoiDung',
          dataIndex: 'maLoaiNguoiDung',
          render: tags => (
            <>
              {tags.map(tag => {
                let color = 'green';
                if (tag === 'QuanTri') {
                  color = 'volcano';
                  tag = 'Quản Trị';
                } else {
                    tag = 'Khách Hàng';
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          ),
        },
        {
          title: 'Chức Năng',
          key: 'action',
          render: (item) => {
                return  <Space size="middle">
                            <Button type="dashed" onClick={() => showModalHistoryTicket(item.taiKhoan)}>Lịch sử</Button>
                            <Button type="primary" onClick={() => showModalUpdateUser(item)}>Cập nhật</Button>
                            <Popconfirm 
                                className="ant-btn-danger" 
                                title="Bạn muốn xóa người dùng này?" 
                                okText="Có" 
                                cancelText="Hủy"
                                onConfirm={() => handleDeleteUser(item.taiKhoan)}
                            >
                                <Button>Xóa</Button>
                            </Popconfirm>
                        </Space>
          },
        },
      ];
      
    const data = [...renderData()];

     // modal history book ticket
     const [modalStyle, setModalStyle] = useState({
        visible: false,
        loading: false,
    });

    const [historyUser, setHistoryUser] = useState({});
    const showModalHistoryTicket = async(taiKhoan) => {
        axios({
            method:"POST",
            url:'http://movie0706.cybersoft.edu.vn/api/QuanLyNguoiDung/ThongTinTaiKhoan',
            data: {
                taiKhoan
            }
        }).then(res => {
                const temp = res.data.thongTinDatVe.map((item, index) => {
                    return {
                        key:index,
                        ...item
                    }
                });
                setHistoryUser({
                    ...res.data,
                    thongTinDatVe: temp
                });
        }).catch(err => console.log(err));


        setModalStyle({
            ...modalStyle,
            visible: true,
        });
    };

    const dataSource = historyUser.thongTinDatVe;
    


    const columnsHistoryTicket = [
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

    const handleCancel = () => {
        setModalStyle({
            ...modalStyle,
            visible: false,
        });
        setModalUpdateStyle({
            ...modalUpdateStyle,
            visible: false,
        });
    };

    // modal update user
    const [modalUpdateStyle, setModalUpdateStyle] = useState({
        visible: false,
        loading: false,
    });
    const { visible, loading } = modalUpdateStyle;
    const [form] = Form.useForm();

    const showModalUpdateUser = async(item) => {
        await form.setFieldsValue({
            taiKhoan: item.taiKhoan,
            hoTen: item.hoTen,
            matKhau: item.matKhau,
            confirm: item.matKhau,
            email: item.email,
            soDt: item.soDt,
            maLoaiNguoiDung : item.maLoaiNguoiDung[0],
            maNhom: "GP06"
        });
        
        setModalUpdateStyle({
            ...modalStyle,
            visible: true,
        });
    };

    const onFinish = async(values) => {
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
                maLoaiNguoiDung: values.maLoaiNguoiDung,
                hoTen: values.hoTen
            }
        }).then(res => {
            dispatch(action.getUserListAPI());
            setModalUpdateStyle({
                ...modalUpdateStyle,
                loading: true,
            });
            setTimeout(() => {
                setModalUpdateStyle({
                    ...modalUpdateStyle,
                    visible: false,
                    loading: false,
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật thành công',
                    showConfirmButton: false,
                    timer: 1500
                })
            }, 1000);
        }).catch(err => {
            console.log(err.response.data);
            message.error(err.response.data);
        });
    };

    return (
        <>
            <Table pagination={{ pageSize: 10 }} size="middle" columns={columns} dataSource={data} className="table__users"/>

            {/*  modal history */}
            <Modal
                title="Lịch sử đặt vé"
                visible={modalStyle.visible}
                footer=""
                onCancel={handleCancel}
                className="modal__addUser modal__historyBookTicket"
            >
                <Table dataSource={dataSource} columns={columnsHistoryTicket}  pagination={{ pageSize: 6 }} />
            </Modal>
            
            {/* modal Update user */}
            <Modal
                title="Cập nhật người dùng"
                visible={visible}
                footer=""
                onCancel={handleCancel}
                className="modal__addUser"
                >
               <Form
                    {...formItemLayout}
                    form={form}
                    name="update"
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
                            Cập Nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

const mapStateToProps = state => (
    {
        userList: state.userListStore.userList,
        messageDelete: state.userListStore.message
    }
)

export default connect(mapStateToProps)(TableUser);
