import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header.js";
import { TiepNhanDaiLy } from "./components/TiepNhanDaiLy.js";
import { LapPhieuXuatHang } from "./components/LapPhieuXuatHang.js";

function App() {
    return (
        <Router>
            <div>
                <Header/>
                <Routes>
                    <Route path="/" element={<div className="container mt-4"><h1>Chào mừng đến với hệ thống quản lý đại lý</h1></div>} />
                    <Route path="/sprint01" element={<TiepNhanDaiLy />} />
                    <Route path="/tiep-nhan-dai-ly" element={<TiepNhanDaiLy />} />
                    <Route path="/sprint02" element={<LapPhieuXuatHang />} />
                    <Route path="/lap-phieu-xuat-hang" element={<LapPhieuXuatHang />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
