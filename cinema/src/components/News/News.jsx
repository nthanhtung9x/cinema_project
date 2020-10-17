import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_NEWS } from '../../configs/configs';
import { Spin } from 'antd';

const News = ({ match }) => {
    const [isLoading, setLoading] = useState(true);

    const [post, setPost] = useState({});

    const getPostAPI = () => {
        axios({
            method: 'GET',
            url: `${API_NEWS}/${match.params.id}`
        }).then(res => {
            setPost(res.data);
            setLoading(false);
        }).catch(err => console.log(err));
    }

    const handleSscrollTop = () => {
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        handleSscrollTop();
        getPostAPI();
    }, []);

    const renderPost = () => {
        return <>
            <article>{post.title}</article>
            <p>{new Date(post.createdAt).toLocaleString()}</p>
            <b>{post.subtitle}</b>
            <div className="post__img">
                <img src={post.image} alt={post.iamge} />
            </div>
            <p>{post.content}</p>
        </>;
    }
    return (
        <div className="news">
            {
                isLoading && <div className="overlay__wrapper">
                    <Spin
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%,-50%)'
                        }}
                        tip="Đang Tải..."
                        size="large"
                    >
                    </Spin>
                </div>
            }
            <div className="news__wrapper">
                {renderPost()}
            </div>
        </div>
    )
}

export default News;
