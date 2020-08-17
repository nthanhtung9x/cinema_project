import React, { useState } from 'react';
import {
    Form,
    Input,
    Button,
    message
} from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import * as action from '../../redux/Actions';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';

const SignupComponent = ({ dispatch }) => {
    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
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
      
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const onFinish = values => {
      axios({
          method:'POST',
          url:'http://movie0706.cybersoft.edu.vn/api/QuanLyNguoiDung/DangKy',
          headers: {
              "Content-Type": "application/json"
          },
          data: {
              taiKhoan: values.taiKhoan,
              matKhau: values.matKhau,
              email: values.email,
              soDt: values.soDt,
              maNhom: 'GP01',
              maLoaiNguoiDung: 'QuanTri',
              hoTen: values.hoTen
          }
      }).then(res => {
            if(res.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng ký thành công',
                    showConfirmButton: false,
                    timer: 3000
                })
                return history.push('/');
            }
      }).catch(err => {
            message.error('Tài khoản đã tồn tại');
      });

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      },2000);
    };


    return (
        <div className="signup">
            <div className="signup__wrap">
            <h1>Đăng ký</h1>
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="maNhom"
                    hidden
                >
                </Form.Item>
                <Form.Item
                    name="maLoaiNguoiDung"
                    hidden
                >
                </Form.Item>
                <Form.Item
                    name="taiKhoan"
                    label="Tài khoản"
                    rules={[
                    {
                        required: true,
                        message: 'Vui lòng tên tài khoản!',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="matKhau"
                    label="Mật khẩu"
                    rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu!',
                    },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Xác thực mật khẩu"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                    {
                        required: true,
                        message: 'Vui lòng xác thực mật khẩu!',
                    },
                    ({ getFieldValue }) => ({
                        validator(rule, value) {
                        if (!value || getFieldValue('matKhau') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject('Xác thực không chính xác!');
                        },
                    }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                    {
                        type: 'email',
                        message: 'Email không hợp lệ!',
                    },
                    {
                        required: true,
                        message: 'Vui lòng nhập email!',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="hoTen"
                    label="Họ Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!', whitespace: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="soDt"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                    <Input style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="large" loading={loading}>
                        Đăng ký
                    </Button>
                </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default connect()(SignupComponent);
