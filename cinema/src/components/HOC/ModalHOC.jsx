import React, { useState } from 'react';

import { Row, Input, Col, Modal, Button } from 'antd';
import {
    AppstoreAddOutlined
} from "@ant-design/icons";

export default function (Component, title) {
    return function ({itemUpdate, name, ...rest}) {
        const [modalStyle, setModalStyle] = useState({
            visible: false,
            confirmLoading: false
        })
        const { visible, confirmLoading } = modalStyle;
        const showModal = (values) => {
            console.log(values);
            setModalStyle({
                ...modalStyle,
                visible: true
            });
        };
    
        const handleCancel = () => {
            setModalStyle({
                ...modalStyle,
                visible: false,
            });
        };
        
        const handleToggle = (visible, confirmLoading) => {
            setModalStyle({
                visible,
                confirmLoading
            })
        };

        return <>
                <Button {...rest} className="btn-controls" onClick={() => showModal(itemUpdate)} size="large">
                    {title}
                </Button>
                <Modal
                    title={name ? title + " " + name : title}
                    visible={visible}
                    className="modal__addUser"
                    footer=""
                    onCancel={handleCancel}
                >
                    <Component handleToggle={handleToggle} loading={confirmLoading} itemUpdate={itemUpdate}/>
                </Modal>
            </>
        
    }
};
