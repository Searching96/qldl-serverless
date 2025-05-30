import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, Table, Alert, Accordion } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import {
    getAllLoaiDaiLy, getAllQuan, searchDaiLy,
    getAllMatHang, getAllDonViTinh
} from "../services/api.js";
import { Quan, LoaiDaiLy } from "../models/index.js";

export const TimKiemDaiLy = () => {
    const navigate = useNavigate();
    const [dsQuan, setDSQuan] = useState([]);
    const [dsLoaiDaiLy, setDSLoaiDaiLy] = useState([]);
    const [dsMatHang, setDSMatHang] = useState([]);
    const [dsDonViTinh, setDSDonViTinh] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');

    // Search state
    const [searchCriteria, setSearchCriteria] = useState({
        madaily: '',
        tendaily: '',
        sodienthoai: '',
        email: '',
        diachi: '',
        maquan: '',
        tenquan: '',
        maloaidaily: '',
        tenloaidaily: '',
        ngaytiepnhan_from: '',
        ngaytiepnhan_to: '',
        congno_min: '',
        congno_max: '',
        has_debt: '',
        // Advanced export slip criteria
        maphieuxuat_from: '',
        maphieuxuat_to: '',
        ngaylap_from: '',
        ngaylap_to: '',
        tonggiatri_from: '',
        tonggiatri_to: '',
        // Product/item criteria
        tenmathang: '',
        soluongxuat_from: '',
        soluongxuat_to: '',
        dongiaxuat_from: '',
        dongiaxuat_to: '',
        thanhtien_from: '',
        thanhtien_to: '',
        soluongton_from: '',
        soluongton_to: '',
        tendonvitinh: ''
    });

    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setInfoMessage('Đang tải dữ liệu...');

                const [loaiDaiLyResponse, quanResponse, matHangResponse, donViTinhResponse] = await Promise.all([
                    getAllLoaiDaiLy(),
                    getAllQuan(),
                    getAllMatHang(),
                    getAllDonViTinh()
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
                setDSMatHang(Array.isArray(matHangResponse) ? matHangResponse : []);
                setDSDonViTinh(Array.isArray(donViTinhResponse) ? donViTinhResponse : []);

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

    const handleInputChange = (field, value) => {
        setSearchCriteria(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setSearchPerformed(true);

        try {
            const filteredCriteria = Object.entries(searchCriteria)
                .filter(([key, value]) => value !== '')
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

            console.log('Search criteria:', filteredCriteria);

            const results = await searchDaiLy(filteredCriteria);
            setSearchResults(Array.isArray(results) ? results : []);
        } catch (error) {
            console.error('Search error:', error);
            setErrorMessage('Lỗi khi tìm kiếm: ' + error.message);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchCriteria({
            madaily: '',
            tendaily: '',
            sodienthoai: '',
            email: '',
            diachi: '',
            maquan: '',
            tenquan: '',
            maloaidaily: '',
            tenloaidaily: '',
            ngaytiepnhan_from: '',
            ngaytiepnhan_to: '',
            congno_min: '',
            congno_max: '',
            has_debt: '',
            maphieuxuat_from: '',
            maphieuxuat_to: '',
            ngaylap_from: '',
            ngaylap_to: '',
            tonggiatri_from: '',
            tonggiatri_to: '',
            tenmathang: '',
            soluongxuat_from: '',
            soluongxuat_to: '',
            dongiaxuat_from: '',
            dongiaxuat_to: '',
            thanhtien_from: '',
            thanhtien_to: '',
            soluongton_from: '',
            soluongton_to: '',
            tendonvitinh: ''
        });
        setSearchResults([]);
        setErrorMessage('');
        setSearchPerformed(false);
    };

    const handleExitToHome = () => {
        navigate("/");
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

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
                    {/* Alert messages following TiepNhanDaiLy pattern */}
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
                        {/* Search Form Component - following TiepNhanDaiLy pattern */}
                        <div className="container-fluid mb-4">
                            <Card>
                                <Card.Header className="bg-primary text-white text-center py-3">
                                    <h4 className="mb-0">🔍 Tra cứu đại lý</h4>
                                </Card.Header>
                                <Card.Body className="p-4">
                                    <Form onSubmit={handleSearch}>
                                        <Accordion alwaysOpen defaultActiveKey={["0"]}>
                                            {/* Basic Search Criteria */}
                                            <Accordion.Item eventKey="0" className="mb-2">
                                                <Accordion.Header>Thông tin cơ bản</Accordion.Header>
                                                <Accordion.Body className="p-4">
                                                    <div className="bg-light rounded p-4">
                                                        <Row className="g-3">
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Mã đại lý</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder="Nhập mã đại lý"
                                                                        value={searchCriteria.madaily}
                                                                        onChange={(e) => handleInputChange('madaily', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Tên đại lý</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder="Nhập tên đại lý"
                                                                        value={searchCriteria.tendaily}
                                                                        onChange={(e) => handleInputChange('tendaily', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Số điện thoại</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder="Nhập số điện thoại"
                                                                        value={searchCriteria.sodienthoai}
                                                                        onChange={(e) => handleInputChange('sodienthoai', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Địa chỉ</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder="Nhập địa chỉ"
                                                                        value={searchCriteria.diachi}
                                                                        onChange={(e) => handleInputChange('diachi', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Email</Form.Label>
                                                                    <Form.Control
                                                                        type="email"
                                                                        placeholder="Nhập email"
                                                                        value={searchCriteria.email}
                                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Loại đại lý</Form.Label>
                                                                    <Form.Select
                                                                        value={searchCriteria.maloaidaily}
                                                                        onChange={(e) => handleInputChange('maloaidaily', e.target.value)}
                                                                    >
                                                                        <option value="">Chọn loại đại lý</option>
                                                                        {dsLoaiDaiLy.map((loai) => (
                                                                            <option key={loai.maloaidaily} value={loai.maloaidaily}>
                                                                                {loai.tenloaidaily}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Select>
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Quận</Form.Label>
                                                                    <Form.Select
                                                                        value={searchCriteria.maquan}
                                                                        onChange={(e) => handleInputChange('maquan', e.target.value)}
                                                                    >
                                                                        <option value="">Chọn quận</option>
                                                                        {dsQuan.map((quan) => (
                                                                            <option key={quan.maquan} value={quan.maquan}>
                                                                                {quan.tenquan}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Select>
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Accordion.Body>
                                            </Accordion.Item>

                                            {/* Advanced Search Criteria - Agent Information */}
                                            <Accordion.Item eventKey="1" className="mb-2">
                                                <Accordion.Header>Thông tin đại lý nâng cao</Accordion.Header>
                                                <Accordion.Body className="p-4">
                                                    <div className="bg-light rounded p-4">
                                                        <Row className="g-3">
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Ngày tiếp nhận (Từ)</Form.Label>
                                                                    <Form.Control
                                                                        type="date"
                                                                        value={searchCriteria.ngaytiepnhan_from}
                                                                        onChange={(e) => handleInputChange('ngaytiepnhan_from', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Ngày tiếp nhận (Đến)</Form.Label>
                                                                    <Form.Control
                                                                        type="date"
                                                                        value={searchCriteria.ngaytiepnhan_to}
                                                                        onChange={(e) => handleInputChange('ngaytiepnhan_to', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Công nợ (Từ)</Form.Label>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Nhập công nợ từ"
                                                                        value={searchCriteria.congno_min}
                                                                        onChange={(e) => handleInputChange('congno_min', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Công nợ (Đến)</Form.Label>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Nhập công nợ đến"
                                                                        value={searchCriteria.congno_max}
                                                                        onChange={(e) => handleInputChange('congno_max', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>.
                                                    </div>
                                                </Accordion.Body>
                                            </Accordion.Item>

                                            {/* Advanced Search Criteria - Export Slip */}
                                            <Accordion.Item eventKey="2" className="mb-2">
                                                <Accordion.Header>Tiêu chí phiếu xuất</Accordion.Header>
                                                <Accordion.Body className="p-4">
                                                    <div className="bg-light rounded p-4">
                                                        <Row className="g-3">
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Mã phiếu xuất (Từ)</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder="Nhập mã phiếu xuất từ"
                                                                        value={searchCriteria.maphieuxuat_from}
                                                                        onChange={(e) => handleInputChange('maphieuxuat_from', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Mã phiếu xuất (Đến)</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder="Nhập mã phiếu xuất đến"
                                                                        value={searchCriteria.maphieuxuat_to}
                                                                        onChange={(e) => handleInputChange('maphieuxuat_to', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Ngày lập (Từ)</Form.Label>
                                                                    <Form.Control
                                                                        type="date"
                                                                        value={searchCriteria.ngaylap_from}
                                                                        onChange={(e) => handleInputChange('ngaylap_from', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Ngày lập (Đến)</Form.Label>
                                                                    <Form.Control
                                                                        type="date"
                                                                        value={searchCriteria.ngaylap_to}
                                                                        onChange={(e) => handleInputChange('ngaylap_to', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                        <Row className="g-3 mt-2">
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Tổng giá trị xuất (Từ)</Form.Label>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Nhập tổng giá trị xuất từ"
                                                                        value={searchCriteria.tonggiatri_from}
                                                                        onChange={(e) => handleInputChange('tonggiatri_from', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Tổng giá trị xuất (Đến)</Form.Label>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Nhập tổng giá trị xuất đến"
                                                                        value={searchCriteria.tonggiatri_to}
                                                                        onChange={(e) => handleInputChange('tonggiatri_to', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Accordion.Body>
                                            </Accordion.Item>

                                            {/* Product/Item Criteria */}
                                            <Accordion.Item eventKey="3" className="mb-2">
                                                <Accordion.Header>Thông tin mặt hàng</Accordion.Header>
                                                <Accordion.Body className="p-4">
                                                    <div className="bg-light rounded p-4">
                                                        <Row className="g-3"  md={"auto"}>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Tên mặt hàng</Form.Label>
                                                                    <Form.Select
                                                                        value={searchCriteria.tenmathang}
                                                                        onChange={(e) => handleInputChange('tenmathang', e.target.value)}
                                                                    >
                                                                        <option value="">Chọn mặt hàng</option>
                                                                        {dsMatHang.map((mathang) => (
                                                                            <option key={mathang.mamathang} value={mathang.mamathang}>
                                                                                {mathang.tenmathang}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Select>
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Đơn vị tính</Form.Label>
                                                                    <Form.Select
                                                                        value={searchCriteria.tendonvitinh}
                                                                        onChange={(e) => handleInputChange('tendonvitinh', e.target.value)}
                                                                    >
                                                                        <option value="">Chọn đơn vị tính</option>
                                                                        {dsDonViTinh.map((dvt) => (
                                                                            <option key={dvt.madonvitinh} value={dvt.madonvitinh}>

                                                                                {dvt.tendonvitinh}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Select>
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                        <Row className="g-3 mt-2">
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Số lượng xuất (Từ)</Form.Label>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Nhập số lượng xuất từ"
                                                                        value={searchCriteria.soluongxuat_from}
                                                                        onChange={(e) => handleInputChange('soluongxuat_from', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Số lượng xuất (Đến)</Form.Label>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Nhập số lượng xuất đến"
                                                                        value={searchCriteria.soluongxuat_to}
                                                                        onChange={(e) => handleInputChange('soluongxuat_to', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Đơn giá xuất (Từ)</Form.Label>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Nhập đơn giá xuất từ"
                                                                        value={searchCriteria.dongiaxuat_from}
                                                                        onChange={(e) => handleInputChange('dongiaxuat_from', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Đơn giá xuất (Đến)</Form.Label>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Nhập đơn giá xuất đến"
                                                                        value={searchCriteria.dongiaxuat_to}
                                                                        onChange={(e) => handleInputChange('dongiaxuat_to', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                        <Row className="g-3 mt-2">
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Thành tiền (Từ)</Form.Label>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Nhập thành tiền từ"
                                                                        value={searchCriteria.thanhtien_from}
                                                                        onChange={(e) => handleInputChange('thanhtien_from', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Thành tiền (Đến)</Form.Label>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Nhập thành tiền đến"
                                                                        value={searchCriteria.thanhtien_to}
                                                                        onChange={(e) => handleInputChange('thanhtien_to', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Số lượng tồn (Từ)</Form.Label>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Nhập số lượng tồn từ"
                                                                        value={searchCriteria.soluongton_from}
                                                                        onChange={(e) => handleInputChange('soluongton_from', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Group>
                                                                    <Form.Label className="fw-medium mb-2">Số lượng tồn (Đến)</Form.Label>
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="Nhập số lượng tồn đến"
                                                                        value={searchCriteria.soluongton_to}
                                                                        onChange={(e) => handleInputChange('soluongton_to', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>

                                        <div className="d-flex flex-wrap gap-2 justify-content-center pt-3 border-top">
                                            <Button type="submit" variant="primary" disabled={isLoading} className="px-4">
                                                {isLoading ? 'Đang tìm kiếm...' : '🔍 Tìm kiếm'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline-secondary"
                                                onClick={handleClearSearch}
                                                disabled={isLoading}
                                                className="px-4"
                                            >
                                                🗑️ Xóa bộ lọc
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline-secondary"
                                                onClick={handleExitToHome}
                                                className="px-4"
                                            >
                                                ❌ Thoát
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </div>

                        {/* Search Results Table - following TiepNhanDaiLy pattern */}
                        {searchPerformed && (
                            <div className="container-fluid mt-4">
                                <Card>
                                    <Card.Header className="bg-primary text-white py-3">
                                        <h5 className="mb-0 text-white">📋 Kết quả tìm kiếm ({searchResults.length} kết quả)</h5>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        {searchResults.length === 0 ? (
                                            <div className="text-center text-muted py-4">
                                                <i className="bi bi-search display-4 d-block mb-2"></i>
                                                Không tìm thấy đại lý nào phù hợp với tiêu chí tìm kiếm.
                                            </div>
                                        ) : (
                                            <div className="table-responsive">
                                                <Table striped hover className="mb-0">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th className="fw-semibold">Mã đại lý</th>
                                                            <th className="fw-semibold">Tên đại lý</th>
                                                            <th className="fw-semibold">SĐT</th>
                                                            <th className="fw-semibold">Email</th>
                                                            <th className="fw-semibold">Địa chỉ</th>
                                                            <th className="fw-semibold">Quận</th>
                                                            <th className="fw-semibold">Loại đại lý</th>
                                                            <th className="fw-semibold">Ngày tiếp nhận</th>
                                                            <th className="fw-semibold">Công nợ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {searchResults.map((agent, index) => (
                                                            <tr key={agent.madaily || index} className="align-middle">
                                                                <td className="fw-bold text-primary">{agent.madaily}</td>
                                                                <td>{agent.tendaily}</td>
                                                                <td>{agent.sodienthoai}</td>
                                                                <td>{agent.email}</td>
                                                                <td>{agent.diachi}</td>
                                                                <td>{agent.tenquan || agent.maquan}</td>
                                                                <td>{agent.tenloaidaily || agent.maloaidaily}</td>
                                                                <td>{formatDate(agent.ngaytiepnhan)}</td>
                                                                <td className={agent.congno > 0 ? 'text-danger fw-bold' : 'text-success'}>
                                                                    {formatCurrency(agent.congno || 0)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>
                        )}
                    </div>
                </>
            )
            }
        </div >
    );
};