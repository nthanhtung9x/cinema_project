import * as types from '../Actions/actionType';
let initialState = false;

const showModalLogin = (state = initialState, action) => {
    switch(action.type) {
        case types.SHOW_MODAL_LOGIN: {
            state = !state;
            return state;
        }
        default:
            return state;
    }
}

export default showModalLogin;