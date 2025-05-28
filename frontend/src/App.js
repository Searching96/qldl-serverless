import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Navbar from "./components/Navbar.js";
import ManagementPage from "./pages/ManagementPage.js";
import SearchPage from "./pages/SearchPage.js";
import "./styles/App.css";
import "./styles/Navbar.css";
import {
    createDaily, getAllDaily, getAllLoaiDaiLy, getAllQuan,
    getDaily, updateDaily, deleteDaily, getLatestMaDaiLy
} from "./services/api.js";
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
    const [resetFormTrigger, setResetFormTrigger] = useState(0);
    const [currentPage, setCurrentPage] = useState('management'); // Changed from activeTab to currentPage

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

    // Function to get the latest DaiLy ID
    const fetchLatestDaiLyId = async () => {
        try {
            setInfoMessage('Đang lấy mã đại lý mới...');
            const idResponse = await getLatestMaDaiLy();
            setInfoMessage('');
            return idResponse?.maDaiLy || idResponse?.madaily;
        } catch (error) {
            console.error("Error fetching latest ID:", error);
            setErrorMessage("Không thể lấy mã đại lý mới: " + error.message);
            setInfoMessage('');
            return null;
        }
    };

    useEffect(() => {
        console.log("State Updated - dsQuan:", dsQuan);
        console.log("State Updated - dsLoaiDaiLy:", dsLoaiDaiLy);
    }, [dsQuan, dsLoaiDaiLy]);

    const handleEditRow = async (row) => {
        console.log("Edit row (full object):", JSON.stringify(row));

        try {
            setInfoMessage('Đang tải thông tin đại lý...');
            // Handle both ID formats
            const idToUse = row.madaily || row.maDaiLy;
            console.log("maDaiLy value:", idToUse || "NOT FOUND");

            if (!idToUse) {
                throw new Error("Could not find mã đại lý in the row data");
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

        const idToUse = row.maDaiLy || row.madaily;
        if (!idToUse) {
            setErrorMessage("Không tìm thấy mã đại lý để xóa");
            return;
        }

        const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa đại lý ${idToUse}?`);

        if (isConfirmed) {
            try {
                setInfoMessage('Đang xóa đại lý...');

                await deleteDaily(idToUse);

                setSuccessMessage(`Đại lý ${idToUse} đã được xóa thành công`);

                setInfoMessage('Đang cập nhật danh sách đại lý...');
                const updatedDaily = await getAllDaily();
                setDSDaiLy(updatedDaily || []);

                setInfoMessage('');

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

    const handleFormSubmit = async (formData, callback) => {
        if (formData.preventDefault) {
            formData.preventDefault();
        }

        console.log("Dữ liệu đã nhập: ", formData);

        setSuccessMessage('');
        setErrorMessage('');
        let operationSuccess = false;
        
        try {
            let result;

            if (selectedDaily) {
                setInfoMessage('Đang cập nhật đại lý...');
                // Ensure we have the ID in the correct format
                const idToUse = formData.madaily;
                result = await updateDaily(idToUse, formData);
                setSuccessMessage('Đại lý được cập nhật thành công: ' + idToUse);
                setSelectedDaily(null); // Only clear selection on success
                operationSuccess = true;
            } else {
                setInfoMessage('Đang tạo đại lý mới...');
                result = await createDaily(formData);
                const newId = result.madaily || result.maDaiLy;
                setSuccessMessage('Đại lý được tạo thành công: ' + newId);
                operationSuccess = true;
            }

            setInfoMessage('Đang cập nhật danh sách đại lý...');
            const updatedDaily = await getAllDaily();
            setDSDaiLy(updatedDaily || []);
            setInfoMessage('');
            
            // Trigger form reset after successful submission
            setResetFormTrigger(prev => prev + 1);
            
            // Only clear selectedDaily after successful operation
            if (!selectedDaily) {
                // For new creation, we need to clear the form by setting a fresh selected state
                // that will be null but trigger the form to reset
                setSelectedDaily(null);
            }
        } catch (err) {
            console.error("Có lỗi xảy ra:", err);
            setErrorMessage(err.message || 'Có lỗi xảy ra khi xử lý đại lý');
            setInfoMessage('');
            operationSuccess = false;
        }
        
        // Call the callback with the operation result if provided
        if (callback && typeof callback === 'function') {
            callback(operationSuccess);
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

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Clear any selected daily when switching pages
        if (page === 'search') {
            setSelectedDaily(null);
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'management':
                return (
                    <ManagementPage
                        selectedDaily={selectedDaily}
                        onSubmit={handleFormSubmit}
                        dsQuan={dsQuan}
                        dsLoaiDaiLy={dsLoaiDaiLy}
                        resetTrigger={resetFormTrigger}
                        getLatestId={fetchLatestDaiLyId}
                        data={dsDaiLy}
                        onEdit={handleEditRow}
                        onDelete={handleDeleteRow}
                        onRefresh={handleRefresh}
                    />
                );
            case 'search':
                return (
                    <SearchPage 
                        dsQuan={dsQuan}
                        dsLoaiDaiLy={dsLoaiDaiLy}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="app">
            <Navbar currentPage={currentPage} onPageChange={handlePageChange} />
            
            {/* Alert Messages */}
            {(successMessage || errorMessage || infoMessage) && (
                <div className="alert-container">
                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>
                                    <i className="bi bi-check-circle me-2"></i>
                                    {successMessage}
                                </span>
                                <button
                                    className="btn btn-outline-success btn-sm ms-2"
                                    onClick={() => setSuccessMessage('')}
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                            </div>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {errorMessage}
                                </span>
                                <button
                                    className="btn btn-outline-danger btn-sm ms-2"
                                    onClick={() => setErrorMessage('')}
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                            </div>
                        </div>
                    )}
                    {infoMessage && (
                        <div className="alert alert-info" role="alert">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>
                                    <i className="bi bi-info-circle me-2"></i>
                                    {infoMessage}
                                </span>
                                <button
                                    className="btn btn-outline-info btn-sm ms-2"
                                    onClick={() => setInfoMessage('')}
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Đang tải dữ liệu...</p>
                </div>
            )}

            {/* Page Content */}
            {!isLoading && (
                <div className="page-container">
                    {renderPage()}
                </div>
            )}
        </div>
    );
}

export default App;
