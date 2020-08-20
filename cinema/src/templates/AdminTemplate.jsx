import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Route,
    Link,
    useHistory,
    useLocation
} from "react-router-dom";
import { connect } from 'react-redux';
const { Content, Sider } = Layout;




const Admin = ({ userLogin, children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const onCollapse = collapsed => {
        setCollapsed(collapsed);
    };

    const history = useHistory();
    let location = useLocation();
    const { pathname } = location;

    return (
        <>
            <div className="admin">
                <Layout style={{ minHeight: "100vh" }}>
                    <Sider
                        collapsible
                        collapsed={collapsed}
                        onCollapse={onCollapse}
                    >
                        <div className="logo">
                            <Link 
                                to="/" 
                                style={collapsed ? { fontSize: '1.8rem' } : { fontSize: '4rem' }}
                                onClick={() => history.push('/')}
                            >
                                TMOVIE
                            </Link>
                        </div>
                        <Menu theme="dark" defaultSelectedKeys={[pathname]} mode="inline">
                            <Menu.Item key="/admin/dashBoard" icon={<PieChartOutlined />}>
                                <Link to="/admin/dashBoard">
                                    Dashboard
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/managerUser" icon={<UserOutlined />}>
                                <Link to="/admin/managerUser">
                                    Quản lý Người Dùng
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/managerFilm" icon={<DesktopOutlined />}>
                                <Link to="/admin/managerFilm">
                                    Quản lý Phim
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/managerTheaters" icon={<FileOutlined />}>
                                <Link to="/admin/managerTheaters">
                                    Quản lý Rạp
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout className="site-layout">
                        <Content>
                            <div
                                className="site-layout-background"
                            >
                                <div className="name__login">
                                    <span>{userLogin.hoTen}</span>
                                </div>

                                { children }
                                
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
    
        </>
    )
}

const mapStateToProps = state => {
    return {
        userLogin: state.userLoginStore.userLogin,
    }
}
const AdminComponent = connect(mapStateToProps)(Admin);

export const AdminTemplate = ({Component, ...rest}) => {
    return <Route {...rest} render={(props) => {
        return <AdminComponent>
            <Component {...props}/>
        </AdminComponent> 
    }}/>
}