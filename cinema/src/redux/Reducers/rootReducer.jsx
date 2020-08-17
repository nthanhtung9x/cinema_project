import { combineReducers } from 'redux';
import showModalLogin from './showModalLogin';
import userLoginStore from './userLogin';
import filmList from './filmList';
import infoBookTicket from './infoBookTicket';
import theaters from './theaters';
import userListStore from './userList';

const rootReducers = combineReducers({
    showModalLogin,
    userLoginStore,
    filmList,
    infoBookTicket,
    theaters,
    userListStore
});

export default rootReducers;