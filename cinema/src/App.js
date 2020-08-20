import React, { useEffect, useCallback } from 'react';
import './css/main.css';
import 'antd/dist/antd.css';
import HeaderComponent from './components/Header/HeaderComponent';
import CarouselComponent from './components/Carousel/CarouselComponent';
import FooterComponent from './components/Footer/FooterComponent';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import SignupComponent from './components/Signup/SignupComponent';
import { connect } from 'react-redux';
import * as action from './redux/Actions';
import HomeComponent from './components/Page/Home';
import DetailMovie from './components/DetailMovie/DetailMovie';
import ProfileComponent from './components/Profile/ProfileComponent';
import BookTicket from './components/BookTicket/BookTicket';
import News from './components/News/News';
import TheatersComponent from './components/Theaters/TheatersComponent';
// import AdminComponent from './components/Admin/AdminComponent';
import { HomeTemplate } from './templates/HomeTemplate';
import { AdminTemplate } from './templates/AdminTemplate';

import ManagerUser from './components/Admin/ManagerUser/ManagerUser';
import ManagerFilm from './components/Admin/ManagerFilm/ManagerFilm';
import ManagerTheaters from './components/Admin/ManagerTheaters/ManagerTheaters';
import InfoTheater from './components/Admin/ManagerTheaters/InfoTheater';
import ManagerShowTimes from './components/Admin/ManagerShowTimes/ManagerShowTimes';
import DashBoard from './components/Admin/DashBoard/DashBoard';
import Swal from 'sweetalert2';


const App = ({ userLogin, showModalLogin, dispatch, messageLogin }) => {

  useEffect(() => {
    if (showModalLogin) {
      dispatch(action.showModalLogin());
    };
  }, [userLogin.taiKhoan]);

  const messageLoginSuccess = useCallback(() => {
    Swal.fire({
      icon: 'success',
      title: 'Đăng nhập thành công',
      showConfirmButton: false,
      timer: 2000
    })
  }, [messageLogin]);

  useEffect(() => {
    if (messageLogin) {
      messageLoginSuccess();
    }
  }, [messageLogin]);

  return (
    <Router>
      <Switch>

        {/* <Route path="/admin">
          <AdminComponent/>
        </Route> */}

        <AdminTemplate exact path={`/admin/infoTheater/:maCumRap`} Component={InfoTheater} />
        <AdminTemplate exact path={`/admin/showTimes/:maLichChieu`} Component={ManagerShowTimes} />
        <AdminTemplate exact path="/admin/managerTheaters" Component={ManagerTheaters} />
        <AdminTemplate exact path="/admin/managerFilm" Component={ManagerFilm} />
        <AdminTemplate exact path="/admin/managerUser" Component={ManagerUser} />
        <AdminTemplate exact path="/admin/dashBoard" Component={DashBoard} />
        <AdminTemplate exact path="/admin" Component={DashBoard} />

        <HomeTemplate exact path={`/theaters/:maHeThongRap`} Component={TheatersComponent} />
        <HomeTemplate exact path={`/news/:id`} Component={News} />
        <HomeTemplate exact path="/profile" Component={ProfileComponent} />
        <HomeTemplate exact path={`/detailMovie/:MaPhim`} Component={DetailMovie} />
        <HomeTemplate exact path={`/bookTicket/:maLichChieu`} Component={BookTicket} />


        <Route exact path="/signup">
          {userLogin.taiKhoan ?
            <Redirect to="/" />
            :
            <>
              <HeaderComponent />
              <SignupComponent />
              <FooterComponent />
            </>
          }
        </Route>
        <Route path="/">
          <HeaderComponent />
          <CarouselComponent />
          <HomeComponent />
          <FooterComponent />
        </Route>
        {/* <Route path={`/theaters/:maHeThongRap`} render={({match}) => {
          return <>
            <HeaderComponent/>
            <TheatersComponent match={match}/>
            <FooterComponent/>
          </>
        }}/> */}
        {/* <Route path={`/news/:id`} render={({match}) => {
          return <>
            <HeaderComponent/>
            <News match={match}/>
            <FooterComponent/>
          </>
        }}/> */}
        {/* <Route path="/profile">
          <HeaderComponent/>
          <ProfileComponent/>
          <FooterComponent/>
        </Route> */}
        {/* <Route path={`/detailMovie/:MaPhim`} render={({match}) => {
          return <>
                  <HeaderComponent/>
                  <DetailMovie match={match}/>
                  <FooterComponent/>
            </>
          }}
        /> */}

        {/* <Route path={`/bookTicket/:maLichChieu`} render={({match}) => {
          return <>
              <HeaderComponent/>
              <BookTicket match={match}/>
              <FooterComponent/>
          </>
        }}/> */}

      </Switch>
    </Router>
  )
}

const mapStateToProps = state => {
  return {
    userLogin: state.userLoginStore.userLogin,
    showModalLogin: state.showModalLogin,
    messageLogin: state.userLoginStore.message
  }
}

export default connect(mapStateToProps)(App);
