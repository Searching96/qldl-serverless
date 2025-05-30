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
    );
};

export default ManagementPage;
