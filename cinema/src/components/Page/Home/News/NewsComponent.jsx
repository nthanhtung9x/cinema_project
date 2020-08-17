import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';


const NewsComponent = () => {
    const [listPost, setListPost] = useState([]);
    const getPostAPI = useCallback(() => {
        axios({
            method: 'GET',
            url: 'https://5f34bdac9124200016e18e40.mockapi.io/news'
        }).then(res => {
            setListPost(res.data);
        }).catch(err => console.log(err));
    },[]);

    useEffect(() => {
        getPostAPI();
    }, []);

    const renderPostMain = () => {
        return listPost.map((item, index) => {
            if (index < 2) {
                return <Col lg={12} key={index}>
                    <div className="news__item">
                        <Link to={`/news/${item.id}`} className="news__link">
                            <img src={item.image} alt={item.image} />
                            <article>{item.title}</article>
                            <p>{item.subtitle}</p>
                        </Link>
                    </div>
                </Col>
            }
        })
    };

    const renderPostOther = () => {
        return listPost.map((item, index) => {
            if (index > 1 && index <= 3) {
            return   <Col lg={12} key={index}>
                        <div className="news__item">
                            <Link to={`/news/${item.id}`} className="news__link">
                                <img src={item.image} alt={item.image} />
                                <article>{item.title}</article>
                                <p>{item.subtitle}</p>    
                            </Link>
                        </div>
                    </Col>
            }
        })
    }

    const renderPostList = () => {
        return listPost.map((item, index) => {
            return  <li key={index}>
                        <Link to={`/news/${item.id}`}>
                            <img src={item.image} alt={item.image} />
                            <article>{item.title}</article>
                        </Link>
                    </li>
        })
    }

    return (
        <div className="news" id="newsId">
            <div className="news__wrapper">
                <h1>TIN TỨC</h1>
                <Row gutter={16}>
                    {renderPostMain()}
                </Row>
                <br /><br />
                <Row gutter={16}>
                    <Col lg={16}>
                        <Row gutter={16}>
                            {renderPostOther()}
                        </Row>
                    </Col>
                    <Col lg={8}>
                        <ul className="news__list">
                            { renderPostList() }
                        </ul>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default NewsComponent;
