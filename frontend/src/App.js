import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header.js";
import { TiepNhanDaiLy } from "./components/TiepNhanDaiLy.js";
import { TimKiemDaiLy } from "./components/TimKiemDaiLy.js";
import { LapPhieuXuatHang } from "./components/LapPhieuXuatHang.js";
import { LapPhieuThuTien } from "./components/LapPhieuThuTien.js";
import { LapBaoCaoDoanhSo } from "./components/LapBaoCaoDoanhSo";
import { ThaoTacDb } from "./components/ThaoTacDb.js";
import { ThayDoiQuyDinh } from "./components/ThayDoiQuyDinh.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/App.css";
import "./styles/Navbar.css";

function App() {
    return (
        <Router>
            <div>
                <Header/>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div className="container mt-4 d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                                <h1 className="text-center">Chào mừng đến với hệ thống quản lý đại lý</h1>
                            </div>
                        }
                    />
                    <Route path="/sprint01" element={<TiepNhanDaiLy />} />
                    <Route path="/tiep-nhan-dai-ly" element={<TiepNhanDaiLy />} />
                    <Route path="/sprint02" element={<LapPhieuXuatHang />} />
                    <Route path="/lap-phieu-xuat-hang" element={<LapPhieuXuatHang />} />
                    <Route path="/sprint03" element={<TimKiemDaiLy/> } />
                    <Route path="/tim-kiem-dai-ly" element={ <TimKiemDaiLy/> } />
                    <Route path="/sprint04" element={<LapPhieuThuTien />} />
                    <Route path="/lap-phieu-thu-tien" element={<LapPhieuThuTien />} />
                    <Route path="/sprint05" element={<LapBaoCaoDoanhSo />} />
                    <Route path="/lap-bao-cao-doanh-so" element={<LapBaoCaoDoanhSo />} />
                    <Route path="/sprint06" element={<ThayDoiQuyDinh />} />
                    <Route path="/thay-doi-quy-dinh" element={<ThayDoiQuyDinh />} />
                    {/* <Route path="/thao-tac-db" element={<ThaoTacDb />} /> */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
