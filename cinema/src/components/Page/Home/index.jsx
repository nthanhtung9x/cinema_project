import React from 'react';
import SelectFilm from './SelectFlim/SelectFilm';
import FilmView from './FilmView/FilmView';
import NewsComponent from './News/NewsComponent';

const HomeComponent = () => {
    return (
        <div className="home">
            <SelectFilm/>   
            <FilmView/>
            <NewsComponent/>
        </div>
    )
}

export default HomeComponent;
