import * as type from '../Actions/actionType';

const initialState = {
    userList: [],
    message: ""
}

export default (state = initialState, action) => {
    switch (action.type) {
        case type.GET_USER_LIST:{
            let temp = [...state.userList];
            temp = action.list;
            state.userList = temp;
            return {...state};
        }
        case type.DELETE_USER: {
            state.message = action.message;
            return {...state};
        }
        case type.RESET_MESSAGE_USER: {
            state.message = "";
            return {...state};
        }
        default:
            return {...state};
    }
}
