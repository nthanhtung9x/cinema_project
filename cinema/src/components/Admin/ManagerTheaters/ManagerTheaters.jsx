import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../../redux/Actions';

import { Table, Badge, Menu, Dropdown, Space, Row } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import TableTheaters from './TableTheaters';


const ManagerTheaters = () => {

    // const dispatch = useDispatch();
    // const danhSachRap = useSelector(state => state.theaters.danhSachRap);
    // const expandedRowRender = () => {
    //     const columns = [
    //         { title: 'Date', dataIndex: 'date', key: 'date' },
    //         { title: 'Name', dataIndex: 'name', key: 'name' },
    //         {
    //             title: 'Status',
    //             key: 'state',
    //             render: () => (
    //                 <span>
    //                     <Badge status="success" />
    //             Finished
    //                 </span>
    //             ),
    //         },
    //         { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
    //         {
    //             title: 'Action',
    //             dataIndex: 'operation',
    //             key: 'operation',
    //             render: () => (
    //                 <Space size="middle">
    //                     <a>Pause</a>
    //                     <a>Stop</a>
    //                     <Dropdown overlay={menu}>
    //                         <a>
    //                             More <DownOutlined />
    //                         </a>
    //                     </Dropdown>
    //                 </Space>
    //             ),
    //         },
    //     ];

    //     const data = [];
    //     for (let i = 0; i < 3; ++i) {
    //         data.push({
    //             key: i,
    //             date: '2014-12-24 23:12:00',
    //             name: 'This is production name',
    //             upgradeNum: 'Upgraded: 56',
    //         });
    //     }
    //     return <Table columns={columns} dataSource={data} pagination={false} />;
    // };


    // const columns = [
    //     { title: 'Logo', dataIndex: 'logo', key: 'logo' },
    //     { title: 'Mã hệ thống rạp', dataIndex: 'maHeThongRap', key: 'maHeThongRap' },
    //     { title: 'Tên hệ thống rạp', dataIndex: 'tenHeThongRap', key: 'tenHeThongRap' },
    //     { title: 'Bí danh', dataIndex: 'biDanh', key: 'biDanh' },
    // ];

    // const getTheatersList = () => {
    //     dispatch(action.getTheatersAPI());
    // };

    // useEffect(() => {
    //     getTheatersList();
    // },[]);

    // const renderTheaters = () => {
    //     console.log(danhSachRap)
    //     return danhSachRap.map((item, index) => {
    //         return {
    //             key: index,
    //             logo: item.logo,
    //             maHeThongRap: item.maHeThongRap,
    //             tenHeThongRap: item.tenHeThongRap,
    //             biDanh: item.biDanh
    //         }
    //     })
    // };

    let [count, setCount] = useState(0);

    return (
        <div className="manager__theaters">
            {/* <button onClick={() => {
                setCount(count + 1);
            }}>{count}</button> */}
            {/* <Row gutter={[16, 16]}>
                <Table
                    className="components-table-demo-nested"
                    columns={columns}
                    expandable={{ expandedRowRender }}
                    dataSource={renderTheaters()}
                />
            </Row> */}
            <TableTheaters/>
        </div>
    )
}

export default ManagerTheaters;
