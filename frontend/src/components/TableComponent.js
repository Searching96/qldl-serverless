import React from "react";
import DataTable from "react-data-table-component";

export const TableComponent = ({ data, onEdit, onDelete, onRefresh }) => {
    const columns = [
        { name: "Mã đại lý", selector: (row) => row.madaily, sortable: true },
        { name: "Tên đại lý", selector: (row) => row.tendaily, sortable: true },
        { name: "Số điện thoại", selector: (row) => row.sodienthoai || row.dienthoai, sortable: true },
        { name: "Địa chỉ", selector: (row) => row.diachi, sortable: true },
        { name: "Email", selector: (row) => row.email, sortable: true },
        { name: "Loại đại lý", selector: (row) => row.tenloaidaily || "N/A", sortable: true },
        { name: "Quận", selector: (row) => row.tenquan || "N/A", sortable: true },
        { 
            name: "Ngày tiếp nhận", 
            selector: (row) => {
                if (!row.ngaytiepnhan) return "N/A";
                const date = new Date(row.ngaytiepnhan);
                return date.toLocaleDateString('vi-VN');
            }, 
            sortable: true 
        },
        { name: "Thao tác", cell: (row) => 
            <div>
                <button 
                    className="btn btn-primary btn-sm me-2" 
                    onClick={() => onEdit ? onEdit(row) : console.log("Edit", row)}
                >
                    Sửa
                </button>
                <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => onDelete ? onDelete(row) : console.log("Remove", row)}
                >
                    Xóa
                </button>
            </div>},
    ];

    // Custom header component with title and refresh button
    const CustomHeader = React.useMemo(() => {
        return (
            <div className="d-flex justify-content-between align-items-center w-100 mb-2">
                <h5 className="m-0">Danh sách đại lý</h5>
                {onRefresh && (
                    <button 
                        className="btn btn-outline-primary" 
                        onClick={onRefresh}
                        title="Làm mới danh sách đại lý"
                    >
                        <i className="bi bi-arrow-clockwise"></i> Làm mới dữ liệu
                    </button>
                )}
            </div>
        );
    }, [onRefresh]);

    return <DataTable 
        title={CustomHeader}
        columns={columns} 
        data={data} 
        pagination 
        responsive
        highlightOnHover
        striped
    />;
};