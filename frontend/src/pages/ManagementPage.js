import React from 'react';
import { FormComponent } from '../components/FormComponent.js';
import { TableComponent } from '../components/TableComponent.js';

const ManagementPage = ({
    selectedDaily,
    onSubmit,
    dsQuan,
    dsLoaiDaiLy,
    resetTrigger,
    getLatestId,
    data,
    onEdit,
    onDelete,
    onRefresh
}) => {
    return (
        <div className="container-fluid">
            <div className="page-header">
                <div className="container">
                    <h2 className="mb-0">
                        <i className="bi bi-people-fill me-2"></i>
                        Quản lý đại lý
                    </h2>
                    <small className="text-white-50">Thêm, sửa, xóa thông tin đại lý</small>
                </div>
            </div>
            
            <div className="container">
                <FormComponent
                    selectedDaily={selectedDaily}
                    onSubmit={onSubmit}
                    dsQuan={dsQuan}
                    dsLoaiDaiLy={dsLoaiDaiLy}
                    resetTrigger={resetTrigger}
                    getLatestId={getLatestId}
                />

                <TableComponent
                    data={data}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onRefresh={onRefresh}
                />
            </div>
        </div>
    );
};

export default ManagementPage;
