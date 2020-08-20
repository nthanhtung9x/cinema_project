import React, { useState, useEffect } from 'react';
import axios from 'axios';

const News = ({ match }) => {
    const [post, setPost] = useState({});

    const getPostAPI = () => {
        axios({
            method: 'GET',
            url: `https://5f34bdac9124200016e18e40.mockapi.io/news/${match.params.id}`
        }).then(res => {
            console.log(res.data);
            setPost(res.data);
        }).catch(err => console.log(err));
    }

    const handleSscrollTop = () => {
        window.scrollTo(0,0);
    }

    useEffect(() => {
        handleSscrollTop();
        getPostAPI()
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
            <div className="news__wrapper">
                { renderPost() }
            </div>
        </div>
    )
}

export default News;
