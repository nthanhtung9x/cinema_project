import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Space, Button, Select, TimePicker, DatePicker, Input, Modal, Form, message } from 'antd';
import * as action from '../../../redux/Actions';
import axios from 'axios';
import { API } from '../../../configs/configs';
import Swal from 'sweetalert2';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const config = {
    rules: [{ type: 'object', required: true, message: 'Vui lòng chọn thời gian!' }],
};

const InfoTheater = () => {
    const chiTietRap = useSelector(state => state.theaters.chiTietRap);
    const filmList = useSelector(state => state.filmList.danhSachPhim);
    const dispatch = useDispatch();

    const columns = [
        {
            title: "MÃ RẠP",
            dataIndex: "maRap",
            key: "maRap"
        },
        {
            title: "TÊN RẠP",
            dataIndex: "tenRap",
            key: "tenRap"
        },
        {
            title: 'ACTON',
            render: (item) => (
                <Space size="middle">
                    <Button
                        className="ant-btn-danger"
                        size="large"
                        onClick={() => showModal(item.maRap)}
                    >Tạo Lịch Chiếu</Button>
                </Space>
            )
        }
    ];

    const renderTable = () => {
        return chiTietRap.danhSachMaRap.map((item, index) => {
            return {
                key: index,
                maRap: item.maRap,
                tenRap: item.tenRap
            }
        })
    }

    // modal tạo lịch chiếu
    const [modalStyle, setModalStyle] = useState({
        visible: false,
        confirmLoading: false
    })
    const { visible, confirmLoading } = modalStyle;
    const [form] = Form.useForm();

    const showModal = async(maRap) => {
        await dispatch(action.getFilmListAPI());

        await form.setFieldsValue({
            maPhim: "",
            maRap: maRap,
            ngayChieu: "",
            gioChieu: "",
            giaVe: null
          });


        await setModalStyle({
            ...modalStyle,
            visible: true
        });
    };

    const handleCancel = () => {
        setModalStyle({
            ...modalStyle,
            visible: false
        });
    };

    const renderFilmList = () => {
        return filmList.map((item, index) => {
            return <Select.Option value={item.maPhim} key={index}>{item.tenPhim}</Select.Option>
        })
    }

    const onFinish = values => {
        let ngayChieu = values['ngayChieu'].format('DD/MM/YYYY');
        let gioChieu = values['gioChieu'].format('HH:mm:ss');
        let ngayChieuGioChieu = ngayChieu + " " + gioChieu;
        axios({
            method:"POST",
            url:`${API}/QuanLyDatVe/TaoLichChieu`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
            },
            data: {
                maPhim: values.maPhim,
                ngayChieuGioChieu,
                maRap: values.maRap,
                giaVe: values.giaVe
            }
        }).then(res => {
            setModalStyle({
                ...modalStyle,
                confirmLoading: true
            });
            setTimeout(() => {
                setModalStyle({
                    ...modalStyle,
                    visible: false,
                    confirmLoading: false
                });
                Swal.fire({
                    icon: 'success',
                    title: res.data,
                    showConfirmButton: false,
                    timer: 1500
                })
            }, 2000);
        }).catch(err => message.error('Tạo lịch chiếu thất bại!'));

    };

    return (
        <div className="info__theater">
            <h1>{`THÔNG TIN CHI TIẾT RẠP ${chiTietRap.tenCumRap}`}</h1>
            <Table columns={columns} dataSource={renderTable()} pagination={{ pageSize: 8 }} />
            <Modal
                title="TẠO LỊCH CHIẾU"
                visible={visible}
                footer=""
                className="modal__addShowTimes"
                // confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Form 
                    {...layout} 
                    name="nest-messages" 
                    onFinish={onFinish}
                    form={form}
                >
                    <Form.Item 
                        name="maPhim" 
                        label="Tên Phim" 
                        rules={[
                            { 
                                required: true,
                                message:"Vui lòng chọn phim!"
                            }
                        ]}
                    >
                        <Select>
                            { renderFilmList() }   
                        </Select>
                    </Form.Item>
                    <Form.Item 
                        name="maRap" 
                        label="Mã Rạp" 
                        rules={[
                            { 
                                required: true
                            }
                        ]}
                    >
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item 
                        name="ngayChieu" 
                        label="Ngầy Chiếu" 
                        rules={[
                            { required: true }
                        ]}
                        {...config}

                    >
                        <DatePicker />
                    </Form.Item>
                    
                    <Form.Item 
                        name="gioChieu" 
                        label="Giờ Chiếu" 
                        rules={[
                            { required: true }
                        ]}
                        {...config}

                    >
                        <TimePicker />
                    </Form.Item>
                    <Form.Item 
                        name="giaVe" 
                        label="Giá Vé" 
                        rules={[
                            { 
                                required: true,
                                message: "Vui lòng nhập giá vé"
                            },
                            {
                                pattern: new RegExp("^[0-9]+$"),
                                message: "Giá vé chỉ được nhập số!"
                            }
                        ]}
                        disabled
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                        <Button onClick={handleCancel}>
                            THOÁT
                        </Button>
                        <Button type="primary" htmlType="submit" loading={confirmLoading}>
                            TẠO
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default InfoTheater;
