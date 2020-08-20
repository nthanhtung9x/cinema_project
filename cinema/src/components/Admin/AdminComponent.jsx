// import React, { useState, useEffect } from "react";
// import { Layout, Menu } from "antd";
// import {
//     DesktopOutlined,
//     PieChartOutlined,
//     FileOutlined,
//     TeamOutlined,
//     UserOutlined,
// } from "@ant-design/icons";
// import {
//     BrowserRouter as Router,
//     Switch,
//     Route,
//     Link,
//     useHistory,
//     useLocation
// } from "react-router-dom";
// import ManagerUser from "./ManagerUser/ManagerUser";
// import ManagerFilm from "./ManagerFilm/ManagerFilm";
// import ManagerTheaters from "./ManagerTheaters/ManagerTheaters";
// import ManagerTicket from "./ManagerTicket/ManagerTicket";
// import { connect } from "react-redux";
// import ManagerShowTimes from "./ManagerShowTimes/ManagerShowTimes";
// import InfoTheater from "./ManagerTheaters/InfoTheater";

// const { Content, Sider } = Layout;

// const AdminComponent = ({ userLogin }) => {
//     const [collapsed, setCollapsed] = useState(false);

//     const onCollapse = collapsed => {
//         setCollapsed(collapsed);
//     };

//     const history = useHistory();
//     let location = useLocation();
//     const { pathname } = location;

//     return (
//         <></>
//         // <Router>
//         //     <div className="admin">
//         //         <Layout style={{ minHeight: "100vh" }}>
//         //             <Sider
//         //                 collapsible
//         //                 collapsed={collapsed}
//         //                 onCollapse={onCollapse}
//         //             >
//         //                 <div className="logo">
//         //                     <Link 
//         //                         to="/" 
//         //                         style={collapsed ? { fontSize: '1.8rem' } : { fontSize: '4rem' }}
//         //                         onClick={() => history.push('/')}
//         //                     >
//         //                         TMOVIE
//         //                     </Link>
//         //                 </div>
//         //                 <Menu theme="dark" defaultSelectedKeys={[pathname]} mode="inline">
//         //                     <Menu.Item key="/admin/managerUser" icon={<PieChartOutlined />}>
//         //                         <Link to="/admin/managerUser">
//         //                             Quản lý Người Dùng
//         //                         </Link>
//         //                     </Menu.Item>
//         //                     <Menu.Item key="/admin/managerFilm" icon={<DesktopOutlined />}>
//         //                         <Link to="/admin/managerFilm">
//         //                             Quản lý Phim
//         //                         </Link>
//         //                     </Menu.Item>
//         //                     <Menu.Item key="/admin/managerTheaters" icon={<PieChartOutlined />}>
//         //                         <Link to="/admin/managerTheaters">
//         //                             Quản lý Rạp
//         //                         </Link>
//         //                     </Menu.Item>
//         //                     {/* <Menu.Item key="/admin/managerTicket" icon={<DesktopOutlined />}>
//         //                         <Link to="/admin/managerTicket">
//         //                             Quản lý Đặt Vé
//         //                         </Link>
//         //                     </Menu.Item> */}
//         //                 </Menu>
//         //             </Sider>
//         //             <Layout className="site-layout">
//         //                 <Content>
//         //                     <div
//         //                         className="site-layout-background"
//         //                     >
//         //                         <div className="name__login">
//         //                             <span>{userLogin.hoTen}</span>
//         //                         </div>

//         //                         { props.children }
//         //                         {/* <Switch> */}
//         //                             {/* <Route path={`/admin/infoTheater/:maCumRap`} render={({match}) => {
//         //                                 return <InfoTheater match={match}/>
//         //                             }}/>
//         //                             <Route path={`/admin/showTimes/:maLichChieu`} render={({match}) => {
//         //                                 return <ManagerShowTimes match={match}/>
//         //                             }}/> */}
//         //                             {/* <Route path="/admin/managerTicket">
//         //                                 <ManagerTicket/>
//         //                             </Route>
//         //                             <Route path="/admin/managerTheaters">
//         //                                 <ManagerTheaters/>
//         //                             </Route>
//         //                             <Route path="/admin/managerFilm">
//         //                                 <ManagerFilm/>
//         //                             </Route>
//         //                             <Route path="/admin/managerUser">
//         //                                 <ManagerUser/>
//         //                             </Route>
//         //                             <Route exact path="/admin">
//         //                                 <ManagerUser/>
//         //                             </Route> */}
//         //                         {/* </Switch> */}
//         //                     </div>
//         //                 </Content>
//         //             </Layout>
//         //         </Layout>
//         //     </div>
//         // </Router>
//     );
// };

// const mapStateToProps = state => {
//     return {
//         userLogin: state.userLoginStore.userLogin,
//     }
// }

// export default connect(mapStateToProps)(AdminComponent);
