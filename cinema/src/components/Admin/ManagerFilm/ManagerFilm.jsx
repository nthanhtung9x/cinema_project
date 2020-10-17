import React, { useState } from 'react';
import { Row, Input, Col, Modal, Button } from 'antd';
import {
    AppstoreAddOutlined
} from "@ant-design/icons";

import ModalHOC from '../../HOC/ModalHOC';
import FormAddFilm from './FormAddFilm';
import TableFilm from './TableFilm';
const { Search } = Input;

let WrappedModalAddFilm = ModalHOC(FormAddFilm, 'THÊM PHIM');

const ManagerFilm = () => {
    const [searchName, setSearchName] = useState("");
    return (
        <div className="manager__film">
            <Row gutter={[16,16]}>
                <Col lg={16}>
                    <Search
                        placeholder="Tìm kiếm theo tên phim"
                        onSearch={value => setSearchName(value)}
                        size="large"
                    />
                </Col>
                <Col lg={8}>
                    <WrappedModalAddFilm type="primary" danger shape="round" icon={<AppstoreAddOutlined />}/>
                </Col>
            </Row>
            <Row>
                <TableFilm searchName={searchName}/>
            </Row>

            {/* <Modal
                title="Title"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >

            </> */}
        </div>
    )
}

export default ManagerFilm;
