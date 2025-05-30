import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Table, Alert, Accordion } from 'react-bootstrap';
import { searchDaiLy } from '../services/api';
import '../styles/SearchComponent.css';

export const SearchComponent = ({ dsQuan, dsLoaiDaiLy }) => {
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
    }); const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchPerformed, setSearchPerformed] = useState(false);

    const handleInputChange = (field, value) => {
        setSearchCriteria(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSearchPerformed(true);

        try {
            // Filter out empty search criteria
            const filteredCriteria = Object.entries(searchCriteria)
                .filter(([key, value]) => value !== '')
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

            console.log('Search criteria:', filteredCriteria);

            const results = await searchDaiLy(filteredCriteria);
            setSearchResults(Array.isArray(results) ? results : []);
        } catch (error) {
            console.error('Search error:', error);
            setError('Lỗi khi tìm kiếm: ' + error.message);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    }; const handleClearSearch = () => {
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
        setSearchResults([]);
        setError('');
        setSearchPerformed(false);
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
        <div className="search-component">
            <Card>
                <Card.Header>
                    <h4>🔍 Tra cứu đại lý</h4>
                </Card.Header>
                <Card.Body>                    <Form onSubmit={handleSearch}>
                        <Accordion alwaysOpen defaultActiveKey={["0"]}>
                            {/* Basic Search Criteria */}
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Thông tin cơ bản</Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Mã đại lý</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập mã đại lý"
                                                    value={searchCriteria.madaily}
                                                    onChange={(e) => handleInputChange('madaily', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tên đại lý</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập tên đại lý"
                                                    value={searchCriteria.tendaily}
                                                    onChange={(e) => handleInputChange('tendaily', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Số điện thoại</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập số điện thoại"
                                                    value={searchCriteria.sodienthoai}
                                                    onChange={(e) => handleInputChange('sodienthoai', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Nhập email"
                                                    value={searchCriteria.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Địa chỉ</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập địa chỉ"
                                                    value={searchCriteria.diachi}
                                                    onChange={(e) => handleInputChange('diachi', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* Location and Type Criteria */}
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Quận và loại đại lý</Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Mã quận</Form.Label>
                                                <Form.Select
                                                    value={searchCriteria.maquan}
                                                    onChange={(e) => handleInputChange('maquan', e.target.value)}
                                                >
                                                    <option value="">-- Chọn quận --</option>
                                                    {dsQuan.map((quan) => (
                                                        <option key={quan.maquan} value={quan.maquan}>
                                                            {quan.maquan} - {quan.tenquan}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tên quận</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập tên quận"
                                                    value={searchCriteria.tenquan}
                                                    onChange={(e) => handleInputChange('tenquan', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Mã loại đại lý</Form.Label>
                                                <Form.Select
                                                    value={searchCriteria.maloaidaily}
                                                    onChange={(e) => handleInputChange('maloaidaily', e.target.value)}
                                                >
                                                    <option value="">-- Chọn loại --</option>
                                                    {dsLoaiDaiLy.map((loai) => (
                                                        <option key={loai.maloaidaily} value={loai.maloaidaily}>
                                                            {loai.maloaidaily} - {loai.tenloaidaily}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tên loại đại lý</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập tên loại"
                                                    value={searchCriteria.tenloaidaily}
                                                    onChange={(e) => handleInputChange('tenloaidaily', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>                            {/* Advanced Criteria */}
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>Tìm kiếm nâng cao</Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        <Col md={6}>
                                            <h6>Ngày tiếp nhận</h6>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Từ ngày</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            value={searchCriteria.ngaytiepnhan_from}
                                                            onChange={(e) => handleInputChange('ngaytiepnhan_from', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Đến ngày</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            value={searchCriteria.ngaytiepnhan_to}
                                                            onChange={(e) => handleInputChange('ngaytiepnhan_to', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col md={6}>
                                            <h6>Công nợ</h6>
                                            <Row>
                                                <Col md={4}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Từ (VNĐ)</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Tối thiểu"
                                                            value={searchCriteria.congno_min}
                                                            onChange={(e) => handleInputChange('congno_min', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Đến (VNĐ)</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Tối đa"
                                                            value={searchCriteria.congno_max}
                                                            onChange={(e) => handleInputChange('congno_max', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Trạng thái nợ</Form.Label>
                                                        <Form.Select
                                                            value={searchCriteria.has_debt}
                                                            onChange={(e) => handleInputChange('has_debt', e.target.value)}
                                                        >
                                                            <option value="">-- Tất cả --</option>
                                                            <option value="true">Có nợ</option>
                                                            <option value="false">Không nợ</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* Export Slip Criteria */}
                            <Accordion.Item eventKey="3">
                                <Accordion.Header>📄 Tìm kiếm theo phiếu xuất</Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        <Col md={6}>
                                            <h6>Mã phiếu xuất</h6>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Từ mã</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Mã phiếu từ"
                                                            value={searchCriteria.maphieuxuat_from}
                                                            onChange={(e) => handleInputChange('maphieuxuat_from', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Đến mã</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Mã phiếu đến"
                                                            value={searchCriteria.maphieuxuat_to}
                                                            onChange={(e) => handleInputChange('maphieuxuat_to', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col md={6}>
                                            <h6>Ngày lập phiếu</h6>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Từ ngày</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            value={searchCriteria.ngaylap_from}
                                                            onChange={(e) => handleInputChange('ngaylap_from', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Đến ngày</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            value={searchCriteria.ngaylap_to}
                                                            onChange={(e) => handleInputChange('ngaylap_to', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <h6>Tổng giá trị phiếu xuất</h6>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Từ (VNĐ)</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Giá trị tối thiểu"
                                                            value={searchCriteria.tonggiatri_from}
                                                            onChange={(e) => handleInputChange('tonggiatri_from', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Đến (VNĐ)</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Giá trị tối đa"
                                                            value={searchCriteria.tonggiatri_to}
                                                            onChange={(e) => handleInputChange('tonggiatri_to', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* Product/Item Criteria */}
                            <Accordion.Item eventKey="4">
                                <Accordion.Header>📦 Tìm kiếm theo mặt hàng</Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tên mặt hàng</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập tên mặt hàng"
                                                    value={searchCriteria.tenmathang}
                                                    onChange={(e) => handleInputChange('tenmathang', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Đơn vị tính</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập đơn vị tính"
                                                    value={searchCriteria.tendonvitinh}
                                                    onChange={(e) => handleInputChange('tendonvitinh', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <h6>Số lượng xuất</h6>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Từ</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="SL tối thiểu"
                                                            value={searchCriteria.soluongxuat_from}
                                                            onChange={(e) => handleInputChange('soluongxuat_from', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Đến</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="SL tối đa"
                                                            value={searchCriteria.soluongxuat_to}
                                                            onChange={(e) => handleInputChange('soluongxuat_to', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col md={6}>
                                            <h6>Đơn giá xuất</h6>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Từ (VNĐ)</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Giá tối thiểu"
                                                            value={searchCriteria.dongiaxuat_from}
                                                            onChange={(e) => handleInputChange('dongiaxuat_from', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Đến (VNĐ)</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Giá tối đa"
                                                            value={searchCriteria.dongiaxuat_to}
                                                            onChange={(e) => handleInputChange('dongiaxuat_to', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <h6>Thành tiền</h6>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Từ (VNĐ)</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Thành tiền tối thiểu"
                                                            value={searchCriteria.thanhtien_from}
                                                            onChange={(e) => handleInputChange('thanhtien_from', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Đến (VNĐ)</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Thành tiền tối đa"
                                                            value={searchCriteria.thanhtien_to}
                                                            onChange={(e) => handleInputChange('thanhtien_to', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col md={6}>
                                            <h6>Số lượng tồn</h6>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Từ</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="SL tồn tối thiểu"
                                                            value={searchCriteria.soluongton_from}
                                                            onChange={(e) => handleInputChange('soluongton_from', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Đến</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="SL tồn tối đa"
                                                            value={searchCriteria.soluongton_to}
                                                            onChange={(e) => handleInputChange('soluongton_to', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>                        <div className="text-center mt-4">
                            <div className="mb-3">
                                <Button type="submit" variant="primary" disabled={isLoading}>
                                    {isLoading ? 'Đang tìm kiếm...' : '🔍 Tìm kiếm'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="ms-2"
                                    onClick={handleClearSearch}
                                    disabled={isLoading}
                                >
                                    🗑️ Xóa bộ lọc
                                </Button>
                            </div>
                            {searchPerformed && (
                                <div className="text-muted">
                                    Tìm thấy {searchResults.length} kết quả
                                </div>
                            )}
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            {/* Error Display */}
            {error && (
                <Alert variant="danger" className="mt-3">
                    {error}
                </Alert>
            )}

            {/* Search Results */}
            {searchPerformed && (
                <Card className="mt-3">
                    <Card.Header>
                        <h5>📋 Kết quả tìm kiếm</h5>
                    </Card.Header>
                    <Card.Body>
                        {searchResults.length === 0 ? (
                            <Alert variant="info">
                                Không tìm thấy đại lý nào phù hợp với tiêu chí tìm kiếm.
                            </Alert>
                        ) : (
                            <div className="table-responsive">                                <Table striped bordered hover>
                                <thead className="table-dark">
                                    <tr>
                                        <th>Mã đại lý</th>
                                        <th>Tên đại lý</th>
                                        <th>SĐT</th>
                                        <th>Email</th>
                                        <th>Địa chỉ</th>
                                        <th>Quận</th>
                                        <th>Loại đại lý</th>
                                        <th>Ngày tiếp nhận</th>
                                        <th>Công nợ</th>
                                        <th>Số phiếu xuất</th>
                                        <th>Tổng giá trị xuất</th>
                                        <th>Số mặt hàng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResults.map((agent, index) => (
                                        <tr key={agent.madaily || index}>
                                            <td className="fw-bold">{agent.madaily}</td>
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
                                            <td className="text-center">
                                                <span className="badge bg-info">
                                                    {agent.so_phieu_xuat || 0}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                {agent.tong_gia_tri_xuat ? formatCurrency(agent.tong_gia_tri_xuat) : '-'}
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-secondary">
                                                    {agent.so_mat_hang || 0}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};