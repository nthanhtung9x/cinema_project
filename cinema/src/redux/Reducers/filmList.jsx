import * as type from '../Actions/actionType';

const initialState = {
    danhSachPhim: [],
    danhSachPhimSapChieu: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case type.GET_FILM_LIST: {
            let temp = [...state.danhSachPhim];
            temp = action.list;
            state.danhSachPhim = temp;
            return {...state};
        }
        case type.GET_FILM_LIST_SOON: {
            let temp = [...state.danhSachPhimSapChieu];
            temp = action.list;
            state.danhSachPhimSapChieu = temp;
            return {...state};
        }
    default:
        return {...state};
    }
}
