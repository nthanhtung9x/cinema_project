import React, { useState, useEffect } from 'react';
import { Menu, Input, Modal, Button, Form, Popover, message, List, Avatar } from 'antd';
import { DownOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons';
import { Link, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import * as action from '../../redux/Actions';
import Swal from 'sweetalert2';
import axios from 'axios';
import { API } from '../../configs/configs';

const { SubMenu } = Menu;
const { Search } = Input;

const HeaderComponent = React.memo(({ visible, userLogin, messageLogin, theaters, dispatch }) => {
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
        wrapperCol: { span: 16 },
    };

    const [modalStyle, setModalStyle] = useState({
        confirmLoading: false
    });

    const [form] = Form.useForm();
    const showModal = async () => {
        setCollapse(false);
        await dispatch(action.showModalLogin());
        await form.setFieldsValue({
            taiKhoan: "",
            matKhau: ""
        });
        await setModalStyle({
            ...modalStyle
        });
    };

    const handleOk = async (values) => {
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
        if (messageLogin === false) {
            message.error('Tài khoản hoặc mật khẩu không đúng');
        }
    }, [messageLogin]);


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
                setCollapse(false);
                // Swal.fire({
                //     timer: 1500,
                //     timerProgressBar: true,
                //     showConfirmButton: false,
                //     onBeforeOpen: () => {
                //         Swal.showLoading();
                //     },
                // }).then((result) => {
                //     /* Read more about handling dismissals below */
                //     if (result.dismiss === Swal.DismissReason.timer) {
                //         console.log('I was closed by the timer')
                //     }
                // })
            }}>Thông tin cá nhân</Link>
            {userLogin.maLoaiNguoiDung === 'QuanTri' ?
                <Link to="/admin" onClick={() => setCollapse(false)}>Quản trị hệ thống</Link>
                :
                <></>
            }
            <Link to="/logout" onClick={async () => {
                setCollapse(false);
                await dispatch(action.login({
                    user: {},
                    message: null
                }));
                localStorage.removeItem('user');
                localStorage.removeItem('message');
                localStorage.removeItem('accessToken');
                await message.warning('Bạn đã đăng xuất');

                return <Redirect to="/" />;
            }}>Đăng xuất</Link>
        </div>
    );

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

    // theaters mobile
    const renderListTheatersMobile = () => {
        return theaters.danhSachRap.map((item, index) => {
            return <Link key={index} to={`/theaters/${item.maHeThongRap}`} onClick={() => {
                    setCollapse(false);
                    dispatch(action.reloadTheaters())
                }}>
                    <img src={item.logo} alt={item.logo} />
                    {item.tenHeThongRap}
                </Link>
        });
    }
    const contentTheaters = (
        <div>
            { renderListTheatersMobile() }
        </div>
    )

    // GET LIST THEATERS
    const handleGetTheatersAPI = () => {
        dispatch(action.getTheatersAPI());
    }


    useEffect(() => {
        handleGetTheatersAPI();
    }, []);

    // search
    const [listSearch, setListSearch] = useState([]);
    const [visibleSearch, setVisibleSearch] = useState(false);

    const handleSearch = (tenPhim) => {
        setVisibleSearch(true);
        if (!tenPhim) {
            return;
        }
        axios({
            method: "GET",
            url: `${API}/QuanLyPhim/LayDanhSachPhim?maNhom=GP06&tenPhim=${tenPhim}`
        }).then(res => {
            setListSearch(res.data);
        }).catch(err => console.log(err));
    }

    const [collapse, setCollapse] = useState(false);

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
                                {renderListTheaters()}
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
                    </Menu>
                </div>
                <div className="nav__logo">
                    <Link to="/"><h1>TMOVIE</h1></Link>
                </div>
                <div className="nav__controls">
                    <Search
                        placeholder="Từ khóa tìm kiếm"
                        onSearch={value => handleSearch(value)}
                        size="large"
                    />
                    {visibleSearch ?
                        <div className="search__header__wrap">
                            <List
                                onMouseLeave={() => setVisibleSearch(false)}
                                itemLayout="horizontal"
                                dataSource={listSearch}
                                loading={listSearch?.length ? false : true}
                                renderItem={item => (
                                    <List.Item>
                                        <Link to={`/detailMovie/${item.maPhim}`} onClick={() => {
                                            dispatch(action.reloadTheaters())
                                            setVisibleSearch(false);
                                        }}>
                                            <List.Item.Meta
                                                avatar={<Avatar src={item.hinhAnh} />}
                                                title={item.tenPhim}
                                            />
                                        </Link>
                                    </List.Item>
                                )}
                            />
                        </div>
                        :
                        <></>
                    }


                    {userLogin.taiKhoan ?
                        <Popover className="nav_users" placement="bottom" content={content} trigger="click">
                            <Button size="large">
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
                                <Input placeholder="Nhập tên tài khoản" />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
                                name="matKhau"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                            >
                                <Input.Password placeholder="Nhập mật khẩu" />
                            </Form.Item>
                            <Form.Item {...tailLayout} style={{ margin: '0 0 12px' }}>
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
                <div className="nav__mobile">
                    <label htmlFor="collapse" className="btn-menu-mobile">
                        <MenuOutlined />
                    </label>
                    <input type="checkbox" id="collapse" onClick={() => setCollapse(true)} hidden></input>
                    <label className="bg-collapse" onClick={() => setCollapse(false)} style={collapse ? { transform: 'translateX(0%)' } : { transform: 'translateX(110%)' }}></label>
                    <div className="mobile__nav" style={collapse ? { transform: 'translateX(0%)' } : { transform: 'translateX(110%)' }}>
                        <ul className="mobile__list">
                            <li>
                                <Link to="/" onClick={() => setCollapse(false)}>Trang chủ</Link>
                            </li>
                            <li>
                                <a href="#film" onClick={() => setCollapse(false)}>Phim</a>
                            </li>
                            <li>
                                <a href="#newsId" onClick={() => setCollapse(false)}>Tin tức</a>
                            </li>
                            <li>
                                <Popover className="nav_users" placement="bottom" content={contentTheaters} trigger="click">
                                    <Button>
                                        Rạp
                                        <DownOutlined />
                                    </Button>
                                </Popover>
                            </li>

                            {userLogin.taiKhoan ?
                                <li>
                                    <Popover className="nav_users" placement="bottom" content={content} trigger="click">
                                        <Button>
                                            {userLogin.hoTen}
                                            <DownOutlined />
                                        </Button>
                                    </Popover>
                                </li>
                                :
                                <li>
                                    <Button
                                        className="nav_users"
                                        onClick={showModal}
                                        title="Đăng nhập"
                                        size="large"
                                    >
                                        Đăng nhập
                                    </Button>
                                </li>
                            }
                        </ul>
                    </div>

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
