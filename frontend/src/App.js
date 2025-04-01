import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormComponent } from "./components/FormComponent.js";
import { TableComponent } from "./components/TableComponent.js";
import { createDaily, getAllDaily, getAllLoaiDaiLy, getAllQuan, getDaily, updateDaily, deleteDaily } from "./services/api.js";
import { Quan, LoaiDaiLy } from "./models";

function App() {
    const [dsDaiLy, setDSDaiLy] = useState([]);
    const [dsQuan, setDSQuan] = useState([]);
    const [dsLoaiDaiLy, setDSLoaiDaiLy] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [selectedDaily, setSelectedDaily] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setInfoMessage('Đang tải dữ liệu...');
                
                const [loaiDaiLyResponse, quanResponse] = await Promise.all([
                    getAllLoaiDaiLy(),
                    getAllQuan()
                ]);
                
                console.log("API Response - LoaiDaiLy:", loaiDaiLyResponse);
                console.log("API Response - Quan:", quanResponse);
                
                const loaiDaiLyList = Array.isArray(loaiDaiLyResponse) ? 
                    loaiDaiLyResponse.map(ldl => new LoaiDaiLy(ldl.maloaidaily, ldl.tenloaidaily))
                    .sort((a, b) => {
                        const numA = parseInt(a.tenloaidaily.replace(/\D/g, ""));
                        const numB = parseInt(b.tenloaidaily.replace(/\D/g, ""));
                        
                        if (!isNaN(numA) && !isNaN(numB)) {
                            return numA - numB;
                        }
                        
                        return a.tenloaidaily.localeCompare(b.tenloaidaily);
                    }) : [];
                    
                const quanList = Array.isArray(quanResponse) ? 
                    quanResponse
                        .map(q => new Quan(q.maquan, q.tenquan))
                        .sort((a, b) => {
                            const numA = parseInt(a.tenquan.replace(/\D/g, ""));
                            const numB = parseInt(b.tenquan.replace(/\D/g, ""));
                            
                            if (!isNaN(numA) && !isNaN(numB)) {
                                return numA - numB;
                            }
                            
                            return a.tenquan.localeCompare(b.tenquan);
                        }) : [];
                
                setDSLoaiDaiLy(loaiDaiLyList);
                setDSQuan(quanList);
                
                const dailyResponse = await getAllDaily();
                setDSDaiLy(dailyResponse || []);
                
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoading(false);
                setInfoMessage('');
            }
        };

        fetchData();
    }, []);
    
    useEffect(() => {
        console.log("State Updated - dsQuan:", dsQuan);
        console.log("State Updated - dsLoaiDaiLy:", dsLoaiDaiLy);
    }, [dsQuan, dsLoaiDaiLy]);

    const handleEditRow = async (row) => {
        console.log("Edit row (full object):", JSON.stringify(row));
        console.log("maDaiLy value:", row.maDaiLy || row.madaily || "NOT FOUND");
        
        try {
            setInfoMessage('Đang tải thông tin đại lý...');
            const idToUse = row.maDaiLy || row.madaily; 
            if (!idToUse) {
                throw new Error("Could not find maDaiLy in the row data");
            }
            
            const daily = await getDaily(idToUse);
            console.log("Fetched daily for edit (full):", JSON.stringify(daily));
            setSelectedDaily(daily);
            setInfoMessage('');
        } catch (error) {
            console.error("Error fetching daily for edit:", error);
            setErrorMessage("Không thể tải thông tin đại lý: " + error.message);
            setInfoMessage('');
        }
    };

    const handleDeleteRow = async (row) => {
        console.log("Delete row (full object):", JSON.stringify(row));
        
        // Get the daily ID
        const idToUse = row.maDaiLy || row.madaily;
        if (!idToUse) {
            setErrorMessage("Không tìm thấy mã đại lý để xóa");
            return;
        }
        
        // Show confirmation dialog
        const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa đại lý ${idToUse}?`);
        
        if (isConfirmed) {
            try {
                setInfoMessage('Đang xóa đại lý...');
                
                // Call the delete API
                await deleteDaily(idToUse);
                
                // Show success message
                setSuccessMessage(`Đại lý ${idToUse} đã được xóa thành công`);
                
                // Refresh the list
                setInfoMessage('Đang cập nhật danh sách đại lý...');
                const updatedDaily = await getAllDaily();
                setDSDaiLy(updatedDaily || []);
                
                // Clear info message
                setInfoMessage('');
                
                // If the deleted daily was selected, clear the selection
                if (selectedDaily && (selectedDaily.maDaiLy === idToUse || selectedDaily.madaily === idToUse)) {
                    setSelectedDaily(null);
                }
            } catch (error) {
                console.error("Error deleting daily:", error);
                setErrorMessage(`Không thể xóa đại lý: ${error.message}`);
                setInfoMessage('');
            }
        }
    };

    const handleFormSubmit = async (formData) => {
        if (formData.preventDefault) {
            formData.preventDefault();
        }

        console.log("Dữ liệu đã nhập: ", formData);
        
        setSuccessMessage('');
        setErrorMessage('');
        try {
            let result;
            
            if (formData.madaily) {
                setInfoMessage('Đang cập nhật đại lý...');
                result = await updateDaily(formData.madaily, formData);
                setSuccessMessage('Đại lý được cập nhật thành công: ' + formData.madaily);
                setSelectedDaily(null);
            } else {
                setInfoMessage('Đang tạo đại lý mới...');
                result = await createDaily(formData);
                setSuccessMessage('Đại lý được tạo thành công: ' + result.maDaiLy);
            }
            
            setInfoMessage('Đang cập nhật danh sách đại lý...');
            const updatedDaily = await getAllDaily();
            setDSDaiLy(updatedDaily || []);
            setInfoMessage('');
        } catch (err) {
            console.error("Có lỗi xảy ra:", err);
            setErrorMessage(err.message || 'Có lỗi xảy ra khi xử lý đại lý');
            setInfoMessage('');
        }
    };

    const handleRefresh = async () => {
        try {
            setInfoMessage('Đang cập nhật danh sách đại lý...');
            const updatedDaily = await getAllDaily();
            setDSDaiLy(updatedDaily || []);
            setSuccessMessage('Danh sách đại lý đã được cập nhật');
            setInfoMessage('');
        } catch (error) {
            console.error("Error refreshing data:", error);
            setErrorMessage("Không thể cập nhật danh sách đại lý: " + error.message);
            setInfoMessage('');
        }
    };

    return (
        <div className="container mt-4">
            <h1>Thông tin đại lý</h1>
            {isLoading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            {successMessage}
                        </div>
                    )}
                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    {infoMessage && (
                        <div className="alert alert-info" role="alert">
                            {infoMessage}
                        </div>
                    )}
                    <FormComponent 
                        selectedDaily={selectedDaily}
                        onSubmit={handleFormSubmit} 
                        dsQuan={dsQuan} 
                        dsLoaiDaiLy={dsLoaiDaiLy} 
                    />
                    
                    <TableComponent 
                        data={dsDaiLy} 
                        onEdit={handleEditRow} 
                        onDelete={handleDeleteRow} 
                        onRefresh={handleRefresh}
                    />
                </>
            )}
        </div>
    );
}

export default App;
