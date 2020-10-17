import * as types from './actionType';
import axios from 'axios';
import { API } from '../../configs/configs';

export const showModalLogin = () => {
    return {
        type: types.SHOW_MODAL_LOGIN
    }
};

export const handleLoginAPI = (data) => {
    return (dispatch) => {
        return axios({
            method:'POST',
            url: `${API}/QuanLyNguoiDung/DangNhap`,
            data
        }).then(res => {
            dispatch(login({
                user: res.data,
                message:true
            }));
            localStorage.setItem('user', JSON.stringify({taiKhoan: data.taiKhoan, hoTen: res.data.hoTen, maLoaiNguoiDung: res.data.maLoaiNguoiDung}));

        }).catch(err => dispatch(login({
            user: "",
            message: false
        })));
    }
}

export const login = (userLogin) => {
    return {
        type: types.LOGIN,
        userLogin
    }
}

// FILM
export const getFilmListAPI = () => {
    return dispatch => {
        return axios({
            method:'GET',
            url: `${API}/QuanLyPhim/LayDanhSachPhimTheoNgay?maNhom=GP06&soTrang=1&soPhanTuTrenTrang=10&tuNgay=01-07-2020&denNgay=30-09-2020`
        }).then(res => {
            dispatch(getFilmList(res.data));
        }).catch(err => console.log(err));
    }
}
export const getFilmList = (list) => {
    return {
        type: types.GET_FILM_LIST,
        list
    }
}

export const getFilmListSoonAPI = () => {
    return dispatch => {
        return axios({
            method:'GET',
            url: `${API}/QuanLyPhim/LayDanhSachPhimTheoNgay?maNhom=GP01&soTrang=1&soPhanTuTrenTrang=10&tuNgay=01-09-2020&denNgay=01-01-2022`
        }).then(res => {
            dispatch(getFilmListSoon(res.data));
        }).catch(err => console.log(err));
    }
}
export const getFilmListSoon = (list) => {
    return {
        type: types.GET_FILM_LIST_SOON,
        list
    }
}


export const getInfoBookTicketAPI = (data) => {
    return dispatch => {
        return axios({
            method:'POST',
            url: `${API}/QuanLyDatVe/DatVe`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
            },
            data
        }).then(res => {
            dispatch(getInfoBookTicket(res.data));
        }).catch(err => console.log(err));
    }
}

export const getInfoBookTicket = (info) => {
    return {
        type: types.BOOK_TICKET,
        info
    }
}

// THEATERS
export const getTheatersAPI = () => {
    return dispatch => {
        return axios({
            method:'GET',
            url:`${API}/QuanLyRap/LayThongTinHeThongRap`
        }).then(res => {
            dispatch(getTheaters(res.data));
        }).catch(err => console.log(err));
    }
}
export const getTheaters = (list) => {
    return {
        type: types.GET_THEATERS,
        list
    }
}
export const reloadTheaters = () => {
    return {
        type: types.RELOAD_THEATERS,
    }
}
export const getIdRapList = (chiTietRap) => {
    return {
        type: types.GET_ID_RAP,
        chiTietRap
    }
}


// USERS
export const getUserListAPI = () => {
    return (dispatch) => {
        return axios({
            method:'GET',
            url:`${API}/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP06`
        }).then(res => dispatch(getUserList(res.data)))
        .catch(err => console.log(err));
    }
}
export const getUserList = (list) => {
    return {
        type: types.GET_USER_LIST,
        list
    }
}

export const deleteUserAPI = (taiKhoan) => {
    return (dispatch) => {
        return axios({
            method:'DELETE',
            url:`${API}/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
            }
        }).then(res => {
            dispatch({
                type: types.DELETE_USER,
                message: res.data
            })
        }).catch(err => {
            dispatch({
                type: types.DELETE_USER,
                message: err.response.data
            })
        });
    }
}

export const resetMessageUser = () => {
    return {
        type: types.RESET_MESSAGE_USER
    }
}