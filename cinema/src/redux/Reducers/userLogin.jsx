import * as types from '../Actions/actionType';

const initialState = {
    userLogin: JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : {},
    message: JSON.parse(localStorage.getItem('message')) ? JSON.parse(localStorage.getItem('message')) : null,
};

const userLoginStore = (state = initialState, action) => {
    switch(action.type) {
        case types.LOGIN: {
            let temp = {...state.userLogin};
            if(action.userLogin.user.taiKhoan) {
                localStorage.setItem('accessToken', JSON.stringify(action.userLogin.user.accessToken));
                localStorage.setItem('message', JSON.stringify(action.userLogin.message));
                temp = action.userLogin.user;
                state.message = true;
            } else if(!action.userLogin.user && action.userLogin.message === false) {
                state.message = false;
            } else if(!action.userLogin.user.taiKhoan && !action.userLogin.message) {
                temp = {};
                state.message = null;
            } 
            state.userLogin = temp;
            return {...state};
        }
        default:
            return {...state};
    }
}

export default userLoginStore;