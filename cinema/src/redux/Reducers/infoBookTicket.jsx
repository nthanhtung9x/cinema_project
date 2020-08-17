import * as type from '../Actions/actionType';

const initialState = {
    maLichChieu: "",
    danhSachVe: [],
    taiKhoanNguoiDung: ""
}

export default (state = initialState, action) => {
    switch (action.type) {
        case type.BOOK_TICKET: {
            let temp = {...state};
            temp.maLichChieu = action.info.maLichChieu;
            temp.taiKhoanNguoiDung = action.info.taiKhoanNguoiDung;
            state = temp;
            return {...state};
        }

        default:
            return {...state};
        }
}
