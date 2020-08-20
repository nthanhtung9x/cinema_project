import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Upload, message, DatePicker } from 'antd';
import axios from 'axios';
import _ from 'lodash';

import Swal from 'sweetalert2';

const { TextArea } = Input;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const FormUpdateFilm = ({ handleToggle, loading, itemUpdate }) => {

    // modal update film
    const [form] = Form.useForm();
    const [uploadImg, setUploadImg] = useState({});

    const handleCancel = () => {
        handleToggle(false, false);
    };

    useEffect(() => {
        form.setFieldsValue({
            maPhim: itemUpdate.maPhim,
            tenPhim: itemUpdate.tenPhim,
            biDanh: itemUpdate.biDanh,
            trailer: itemUpdate.trailer,
            moTa: itemUpdate.moTa,
            maNhom: itemUpdate.maNhom,
            ngayKhoiChieu: "",
            danhGia: itemUpdate.danhGia
        });
    },[itemUpdate.maPhim]);

    const onFinish = async (values) => {
        let item = {
            maPhim: +values.maPhim,
            tenPhim: values.tenPhim,
            biDanh: values.biDanh,
            trailer: values.trailer,
            moTa: values.moTa,
            hinhAnh: uploadImg,
            maNhom: values.maNhom,
            ngayKhoiChieu: values['ngayKhoiChieu'].format('DD-MM-YYYY'),
            danhGia: +values.danhGia
        }
        var frm = new FormData();
        for (let key in item) {
            frm.append(key, item[key]);
        }

        if(_.isEqual(itemUpdate, item)) {
            handleToggle(false, false);
            message.warning('Thông tin phim không thay đổi, cập nhật thất bại!')
        } else {
            axios({
                method: 'POST',
                url: `http://movie0706.cybersoft.edu.vn/api/QuanLyPhim/CapNhatPhimUpload`,
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
                },
                data: frm
            }).then(res => {
                handleToggle(true, true);
                setTimeout(() => {
                    setUploadImg({});
                    handleToggle(false, false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Cập nhật phim thành công',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }, 1000);
            }).catch(err => {
                message.error(err.response.data);
            });
        }
    };

    return (
        <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            scrollToFirstError
        >
            <Form.Item
                name="maPhim"
                label="Mã Phim"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập mã phim',
                    },
                    {
                        pattern: new RegExp("^[0-9]+$"),
                        message: "Mã phim chỉ được nhập số!"
                    }
                ]}
            >
                <Input placeholder="Nhập mã phim" />
            </Form.Item>

            <Form.Item
                name="tenPhim"
                label="Tên Phim"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập tên phim',
                    },
                    {
                        max: 50,
                        message: 'Tên phim tối đa 50 ký tự'
                    }
                ]}
            >
                <Input placeholder="Nhập tên phim" />
            </Form.Item>
            <Form.Item
                name="hinhAnh"
                label="Hình Ảnh"
                // valuePropName="fileList"
                // getValueFromEvent={normFile}
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng chọn hình ảnh!',
                    },
                ]}
            >
                <Input
                    type="file"
                    name="file"
                    className="custom-file-input"
                    onChange={(e) => {
                        if (e.target.name === 'file') {
                            setUploadImg(() => e.target.files[0])
                        }
                    }}>
                    {/* <UploadOutlined /> */}
                    {/* <Button style={{margin:0}}>
                </Button> */}
                </Input>
            </Form.Item>

            <Form.Item
                name="biDanh"
                label="Bí Danh"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập bí danh phim!',
                    },
                ]}
                hasFeedback
            >
                <Input placeholder="Nhập bí danh phim" />
            </Form.Item>

            <Form.Item
                name="trailer"
                label="Trailer"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập link trailer!',
                    },
                ]}
            >
                <Input placeholder="Nhập link trailer" />
            </Form.Item>

            <Form.Item
                name="moTa"
                label="Mô Tả"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập mô tả!',
                    },
                ]}
            >
                <TextArea placeholder="Nhập mô tả" />
            </Form.Item>

            <Form.Item
                name="maNhom"
                label="Mã Nhóm"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập mã nhóm!',
                    },
                ]}
            >
                <Input placeholder="Nhập mã nhóm" />
            </Form.Item>

            <Form.Item
                name="ngayKhoiChieu"
                label="Ngày Khởi chiếu"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng chọn ngày khởi chiếu!',
                    },
                ]}
            >
                <DatePicker 
                    showTime 
                    format="DD-MM-YYYY" 
                />
            </Form.Item>
            <Form.Item
                name="danhGia"
                label="Đánh Giá"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập đánh giá!',
                    },
                    {
                        pattern: new RegExp("^[0-9]+$"),
                        message: "Đánh giá chỉ được nhập số!"
                    }
                ]}
            >
                <Input placeholder="Nhập đánh giá" />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
                <Button key="back" onClick={handleCancel} size="large">
                    THOÁT
                </Button>
                <Button type="primary" htmlType="submit" size="large" loading={loading}>
                    CẬP NHẬT
                </Button>
            </Form.Item>
        </Form>

    )
}

export default FormUpdateFilm;
