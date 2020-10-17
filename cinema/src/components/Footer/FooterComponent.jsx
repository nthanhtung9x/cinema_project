import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';

const FooterComponent = () => {
    return (
        <footer className="footer">
            <div className="footer__wrap">
                <Link to="/">
                    <h1>TMOVIE</h1>
                </Link>
                <Row>
                    <Col span={24} lg={8}>
                        <div className="f-item">
                            <article>TMOVIE Việt Nam</article>
                            <ul>
                                <li>
                                    <Link to="/">Giới thiệu</Link>
                                </li>
                                <li>
                                    <Link to="/">Tiện ích</Link>
                                </li>
                                <li>
                                    <Link to="/">Tuyển dụng</Link>
                                </li>
                                <li>
                                    <a href="mailto:tcreation.work@gmail.com">Liên hệ quảng cáo TMOVIE</a>
                                </li>
                            </ul>
                        </div>
                    </Col>
                    <Col span={24} lg={8}>
                        <div className="f-item">
                            <article>Đối tác</article>
                            <a href="" className="f-partner">
                                <img src="https://moveek.com/bundles/ornweb/partners/cinestar.png" alt="cinestart"/>
                            </a>
                            <a href="" className="f-partner">
                                <img src="https://moveek.com/bundles/ornweb/partners/dcine.png" alt="cinestart"/>
                            </a>
                            <a href="" className="f-partner">
                                <img src="https://moveek.com/bundles/ornweb/partners/cinemax.png" alt="cinestart"/>
                            </a>
                            <a href="" className="f-partner">
                                <img src="https://moveek.com/bundles/ornweb/partners/mega-gs-cinemas.png" alt="cinestart"/>
                            </a>
                            <a href="" className="f-partner">
                                <img src="https://moveek.com/bundles/ornweb/partners/beta-cineplex.jpg" alt="cinestart"/>
                            </a>
                            <a href="" className="f-partner">
                                <img src="https://moveek.com/bundles/ornweb/partners/rio.png" alt="cinestart"/>
                            </a>
                            <a href="" className="f-partner">
                                <img src="https://moveek.com/bundles/ornweb/partners/momo.png" alt="cinestart"/>
                            </a>
                            <a href="" className="f-partner">
                                <img src="https://moveek.com/bundles/ornweb/partners/starlight.png" alt="cinestart"/>
                            </a>
                        </div>
                    </Col>
                    <Col span={24} lg={8}>
                        <div className="f-item">
                            <article>Chăm sóc khách hàng</article>
                            <p>Hotline: <a href="tel:0921848825">0921848825</a></p>
                            <p>Giờ làm việc: <span>8:00 - 22:00</span></p>
                            <p>Email hỗ trợ: <a href="mailto:tcreation.work@gmail.com">tcreation.work@gmail.com</a></p>
                        </div>
                    </Col>
                </Row>
            </div>
        </footer>
    )
}

export default FooterComponent
