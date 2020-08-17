import React, { useEffect } from 'react';
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
import AdminComponent from './components/Admin/AdminComponent';

const App = ({ userLogin, showModalLogin,  dispatch }) => {

  useEffect(() => {
    if(showModalLogin) {
      dispatch(action.showModalLogin());
    };
  },[userLogin.taiKhoan]);

  return (
    <Router>
      <Switch>

        <Route path="/admin">
          <AdminComponent/>
        </Route>
        <Route path={`/theaters/:maHeThongRap`} render={({match}) => {
          return <>
            <HeaderComponent/>
            <TheatersComponent match={match}/>
            <FooterComponent/>
          </>
        }}/>
        <Route path={`/news/:id`} render={({match}) => {
          return <>
            <HeaderComponent/>
            <News match={match}/>
            <FooterComponent/>
          </>
        }}/>
        <Route path="/profile">
          <HeaderComponent/>
          <ProfileComponent/>
          <FooterComponent/>
        </Route>
        <Route path={`/detailMovie/:MaPhim`} render={({match}) => {
          return <>
                  <HeaderComponent/>
                  <DetailMovie match={match}/>
                  <FooterComponent/>
            </>
          }}
        />
        
        <Route path={`/bookTicket/:maLichChieu`} render={({match}) => {
          return <>
              <HeaderComponent/>
              <BookTicket match={match}/>
              <FooterComponent/>
          </>
        }}/>
        
        <Route path="/signup">
          { userLogin.taiKhoan ?
              <Redirect to="/"/>
            :
              <>
                <HeaderComponent/>
                <SignupComponent/>
                <FooterComponent/>
              </>
          }
        </Route>
        <Route path="/">
          <HeaderComponent/>
          <CarouselComponent/>
          <HomeComponent/>
          <FooterComponent/>
        </Route>
      </Switch>
    </Router>
  )
}

const mapStateToProps = state => {
  return {
    userLogin: state.userLoginStore.userLogin,
    showModalLogin : state.showModalLogin
  }
}

export default connect(mapStateToProps)(App);
