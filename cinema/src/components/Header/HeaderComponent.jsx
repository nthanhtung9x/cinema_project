import React, { useState, useEffect, useCallback } from 'react';
import { Menu, Input, Modal, Button, Form, Popover, message } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Link, Redirect, useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import * as action from '../../redux/Actions';
import Swal from 'sweetalert2';

const { SubMenu } = Menu;
const { Search } = Input;

const HeaderComponent = React.memo(({ visible, userLogin, messageLogin, theaters,  dispatch }) => {
    const [current, setCurrent] = useState('');

    const handleClick = e => {
        setCurrent(e.key);
    };

    // modal login
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };

    const [modalStyle, setModalStyle] = useState({
        confirmLoading: false
    });

    const [form] = Form.useForm();
    const showModal = async() => {
        await dispatch(action.showModalLogin());
        await form.setFieldsValue({
            taiKhoan: "",
            matKhau: ""
        });
        await setModalStyle({
            ...modalStyle
        });
    };

    const handleOk = async(values) => {
        dispatch(action.handleLoginAPI(values));
        setModalStyle({
            confirmLoading: true
        });
        setTimeout(() => {
            setModalStyle({
                confirmLoading: false,
            });
            // message.success('Đăng nhập thành công');
        }, 2000);
    };

    useEffect(() => {
        if(messageLogin === false) {
            message.error('Tài khoản hoặc mật khẩu không đúng');
        }
    },[messageLogin]);

    
    const handleCancel = () => {
        dispatch(action.showModalLogin());
        setModalStyle({
            ...modalStyle
        });
    };

    // after login
    const content = (
        <div>
            <Link to="/profile" onClick={() => {
                // let timerInterval;
                Swal.fire({
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    onBeforeOpen: () => {
                        Swal.showLoading();
                    },
                    // onClose: () => {
                    //     clearInterval(timerInterval)
                    // }
                }).then((result) => {
                    /* Read more about handling dismissals below */
                    if (result.dismiss === Swal.DismissReason.timer) {
                        console.log('I was closed by the timer')
                    }
                })
            }}>Thông tin cá nhân</Link>
            { userLogin.maLoaiNguoiDung === 'QuanTri' ?
                    <Link to="/admin">Quản trị hệ thống</Link>
                :
                    <></>
            }
            <Link to="/logout" onClick={async() => {
                await dispatch(action.login({
                    user: {},
                    message:null
                }));
                localStorage.removeItem('user');
                localStorage.removeItem('message');
                localStorage.removeItem('accessToken');
                await message.warning('Bạn đã đăng xuất');

                return <Redirect to="/"/>;
            }}>Đăng xuất</Link>
        </div>
    );

    // GET LIST THEATERS
    const handleGetTheatersAPI = () => {
        dispatch(action.getTheatersAPI());
    }


    useEffect(() => {
        handleGetTheatersAPI();
    },[]);

    const renderListTheaters = () => {
        return theaters.danhSachRap.map((item, index) => {
            return <Menu.Item key={index}>
                <Link to={`/theaters/${item.maHeThongRap}`} onClick={() => {
                    dispatch(action.reloadTheaters())
                }}>
                    <img src={item.logo} alt={item.logo} />
                    {item.tenHeThongRap}
                </Link>
            </Menu.Item>
        });
    }

    return (
        <header className="header">
            <div className="nav">
                <div className="nav__list">
                    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
                        <Menu.Item key="film">
                            <a href="#film">
                                Phim
                            </a>
                        </Menu.Item>
                        <SubMenu title="Rạp" icon={<DownOutlined />} className="nav__child">
                            <Menu.ItemGroup title="">
                                { renderListTheaters() }
                            </Menu.ItemGroup>
                        </SubMenu> 
                        <Menu.Item key="news">
                            <a href="#newsId">
                                Tin Tức
                            </a>
                        </Menu.Item>
                        <Menu.Item key="contact">
                            <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                                Liên hệ
                            </a>
                        </Menu.Item>
                        {/* {/* <SubMenu icon={<DownOutlined />} title="Phim" className="nav__child">
                            <Menu.ItemGroup title="">
                                <Menu.Item key="1">Option 1</Menu.Item>
                                <Menu.Item key="2">Option 2</Menu.Item>
                            </Menu.ItemGroup>
                        </SubMenu> */}
                        
                    </Menu>
                </div>
                <div className="nav__logo">
                    <Link to="/"><h1>TMOVIE</h1></Link>
                </div>
                <div className="nav__controls">
                    <Search
                        placeholder="Từ khóa tìm kiếm"
                        onSearch={value => console.log(value)}
                        size="large"
                    />
                    { userLogin.taiKhoan ?
                        <Popover className="nav_users" placement="bottom" content={content} trigger="click">
                            <Button>
                                {userLogin.hoTen}
                                <DownOutlined />
                            </Button>
                        </Popover>
                    :
                        <Button 
                            onClick={showModal}
                            title="Đăng nhập"
                            size="large"
                        >  
                            <UserOutlined />
                        </Button>
                    }
                    <Modal
                        title="ĐĂNG NHẬP"
                        name="loginForm"
                        visible={visible}
                        confirmLoading={modalStyle.confirmLoading}
                        className="login__modal"
                        footer=""
                        onCancel={handleCancel}
                    >
                        <Form
                            form={form}
                            {...layout}
                            name="login__form"
                            onFinish={handleOk}
                        >
                            <Form.Item
                                label="Tài khoản"
                                name="taiKhoan"
                                rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
                            >
                                <Input placeholder="Nhập tên tài khoản"/>
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
                                name="matKhau"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                            >
                                <Input.Password placeholder="Nhập mật khẩu"/>
                            </Form.Item>
                            <Form.Item {...tailLayout} style={{margin:'0 0 12px'}}>
                                <Button type="ant-btn" onClick={handleCancel}>
                                    Thoát
                                </Button>
                                <Button type="primary" htmlType="submit" loading={modalStyle.confirmLoading}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                            <Form.Item {...tailLayout}>
                                Hoặc <Link to="/signup" onClick={handleCancel}>Đăng ký ngay!</Link>

                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </header>
    )
});

const mapStateToProps = state => {
    return {
        visible: state.showModalLogin,
        userLogin: state.userLoginStore.userLogin,
        messageLogin: state.userLoginStore.message,
        theaters: state.theaters
    }
}

export default connect(mapStateToProps)(HeaderComponent);
