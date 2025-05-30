import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Card, Table } from "react-bootstrap";
import {
    getAllLoaiDaiLy, getAllQuan, getAllDaily
} from "../services/api.js";
import { Quan, LoaiDaiLy } from "../models/index.js";
import "../styles/DaiLySelectionModal.css";

export const DaiLySelectionModal = ({ show, onHide, onSelectDaiLy }) => {
    const [dsQuan, setDSQuan] = useState([]);
    const [dsLoaiDaiLy, setDSLoaiDaiLy] = useState([]);
    const [dsDaiLy, setDSDaiLy] = useState([]);
    const [filteredDaiLy, setFilteredDaiLy] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState({
        tenDaiLy: '',
        maquan: '',
        maloaidaily: ''
    });

    useEffect(() => {
        if (show) {
            fetchData();
        }
    }, [show]);

    const fetchData = async () => {
        try {
            setIsLoading(true);

            const [loaiDaiLyResponse, quanResponse, daiLyResponse] = await Promise.all([
                getAllLoaiDaiLy(),
                getAllQuan(),
                getAllDaily()
            ]);

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
            setDSDaiLy(daiLyResponse || []);
            setFilteredDaiLy(daiLyResponse || []);

        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        let filtered = dsDaiLy;

        if (searchCriteria.tenDaiLy) {
            filtered = filtered.filter(dl => 
                dl.tendaily.toLowerCase().includes(searchCriteria.tenDaiLy.toLowerCase())
            );
        }

        if (searchCriteria.maquan) {
            filtered = filtered.filter(dl => dl.maquan === searchCriteria.maquan);
        }

        if (searchCriteria.maloaidaily) {
            filtered = filtered.filter(dl => dl.maloaidaily === searchCriteria.maloaidaily);
        }

        setFilteredDaiLy(filtered);
    };

    const handleClear = () => {
        setSearchCriteria({
            tenDaiLy: '',
            maquan: '',
            maloaidaily: ''
        });
        setFilteredDaiLy(dsDaiLy);
    };

    const handleSelectAgent = (daiLy) => {
        onSelectDaiLy(daiLy);
        onHide();
    };

    const handleInputChange = (field, value) => {
        setSearchCriteria(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Modal show={show} onHide={onHide} size="xl" className="daily-selection-modal">
            <Modal.Header closeButton>
                <Modal.Title>🔍 Tìm kiếm đại lý</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading ? (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                        <p className="mt-2">Đang tải dữ liệu đại lý...</p>
                    </div>
                ) : (
                    <>
                        {/* Search Form */}
                        <Card className="mb-4">
                            <Card.Header>
                                <h5>🔍 Tiêu chí tìm kiếm</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <Form.Group>
                                            <Form.Label>Tên đại lý</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={searchCriteria.tenDaiLy}
                                                onChange={(e) => handleInputChange('tenDaiLy', e.target.value)}
                                                placeholder="Nhập tên đại lý"
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-4">
                                        <Form.Group>
                                            <Form.Label>Quận</Form.Label>
                                            <Form.Select
                                                value={searchCriteria.maquan}
                                                onChange={(e) => handleInputChange('maquan', e.target.value)}
                                            >
                                                <option value="">-- Chọn quận --</option>
                                                {dsQuan.map((quan) => (
                                                    <option key={quan.maquan} value={quan.maquan}>
                                                        {quan.tenquan}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-4">
                                        <Form.Group>
                                            <Form.Label>Loại đại lý</Form.Label>
                                            <Form.Select
                                                value={searchCriteria.maloaidaily}
                                                onChange={(e) => handleInputChange('maloaidaily', e.target.value)}
                                            >
                                                <option value="">-- Chọn loại đại lý --</option>
                                                {dsLoaiDaiLy.map((loai) => (
                                                    <option key={loai.maloaidaily} value={loai.maloaidaily}>
                                                        {loai.tenloaidaily}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button variant="primary" onClick={handleSearch}>
                                        🔍 Tìm kiếm
                                    </Button>
                                    <Button variant="outline-secondary" onClick={handleClear}>
                                        🗑️ Xóa bộ lọc
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Results Table */}
                        <Card>
                            <Card.Header>
                                <h5>📋 Kết quả tìm kiếm ({filteredDaiLy.length} đại lý)</h5>
                            </Card.Header>
                            <Card.Body>
                                {filteredDaiLy.length === 0 ? (
                                    <div className="text-center text-muted">
                                        <p>Không tìm thấy đại lý nào phù hợp với tiêu chí tìm kiếm.</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <Table striped bordered hover>
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Mã đại lý</th>
                                                    <th>Tên đại lý</th>
                                                    <th>Quận</th>
                                                    <th>Loại đại lý</th>
                                                    <th>Điện thoại</th>
                                                    <th>Email</th>
                                                    <th>Nợ hiện tại</th>
                                                    <th>Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredDaiLy.map((daiLy, index) => {
                                                    const quan = dsQuan.find(q => q.maquan === daiLy.maquan);
                                                    const loaiDaiLy = dsLoaiDaiLy.find(l => l.maloaidaily === daiLy.maloaidaily);
                                                    
                                                    return (
                                                        <tr key={daiLy.madaily || index}>
                                                            <td>{daiLy.madaily}</td>
                                                            <td>{daiLy.tendaily}</td>
                                                            <td>{quan ? quan.tenquan : daiLy.maquan}</td>
                                                            <td>{loaiDaiLy ? loaiDaiLy.tenloaidaily : daiLy.maloaidaily}</td>
                                                            <td>{daiLy.dienthoai || daiLy.sodienthoai}</td>
                                                            <td>{daiLy.email}</td>
                                                            <td className="text-end">
                                                                {daiLy.congno ? parseInt(daiLy.congno).toLocaleString('vi-VN') : '0'} VNĐ
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    onClick={() => handleSelectAgent(daiLy)}
                                                                >
                                                                    ✅ Chọn
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    ❌ Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};