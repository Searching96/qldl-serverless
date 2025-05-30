import React, { useState, useEffect } from "react";
import { SearchComponent } from './SearchComponent.js';
import {
    getAllLoaiDaiLy, getAllQuan
} from "../services/api.js";
import { Quan, LoaiDaiLy } from "../models/index.js";

export const TimKiemDaiLy = () => {
    const [dsQuan, setDSQuan] = useState([]);
    const [dsLoaiDaiLy, setDSLoaiDaiLy] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');

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

            } catch (error) {
                console.error("Error loading data:", error);
                setErrorMessage("Không thể tải dữ liệu: " + error.message);
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

    return (
        <div className="container-fluid px-0 mt-4">
            <h1 className="ms-3">Tìm kiếm đại lý</h1>
            {isLoading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    {successMessage && (
                        <div className="alert alert-success mx-3" role="alert">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>{successMessage}</span>
                                <button
                                    className="btn btn-outline-primary btn-sm ms-2"
                                    onClick={() => setSuccessMessage('')}
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                            </div>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="alert alert-danger mx-3" role="alert">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>{errorMessage}</span>
                                <button
                                    className="btn btn-outline-primary btn-sm ms-2"
                                    onClick={() => setErrorMessage('')}
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                            </div>
                        </div>
                    )}
                    {infoMessage && (
                        <div className="alert alert-info mx-3" role="alert">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>{infoMessage}</span>
                                <button
                                    className="btn btn-outline-primary btn-sm ms-2"
                                    onClick={() => setInfoMessage('')}
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="px-3">
                        <SearchComponent
                            dsQuan={dsQuan}
                            dsLoaiDaiLy={dsLoaiDaiLy}
                        />
                    </div>
                </>
            )}
        </div>
    );
};