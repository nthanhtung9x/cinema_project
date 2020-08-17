import * as type from '../Actions/actionType';

const initialState = {
    danhSachRap: [],
    reload: false,
    chiTietRap: {
        tenCumRap: "",
        danhSachMaRap: []
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case type.GET_THEATERS: {
            let temp = [...state.danhSachRap];
            temp = action.list;
            state.danhSachRap = temp;
            return {...state};
        }
        case type.RELOAD_THEATERS: {
            state.reload = !state.reload;
            return {...state};
        }
        case type.GET_ID_RAP: {
            let temp = {...state.chiTietRap};
            temp.danhSachMaRap = action.chiTietRap.danhSachMaRap;
            temp.tenCumRap = action.chiTietRap.tenCumRap;
            state.chiTietRap = temp;
            return {...state};
        }
        default:
            return {...state};
        }
}
