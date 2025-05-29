import React, { useState } from 'react';
import { Card, Form, Row, Col, Button, Alert } from "react-bootstrap";
import { getMonthlyRevenueReport } from '../services/api';

export const LapBaoCaoDoanhSo = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [tongDoanhSo, setTongDoanhSo] = useState('0');
  const [soLuongDaiLy, setSoLuongDaiLy] = useState(0);
  const [baoCaoData, setBaoCaoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate years array (2000 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i);

  // Generate months array
  const months = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' }
  ];

  const handleLapBaoCao = async () => {
    setLoading(true);
    setError('');
    
    try {
      const requestData = {
        month: selectedMonth,
        year: selectedYear
      };
      
      console.log('=== REQUEST DEBUG ===');
      console.log('Request data:', requestData);
      console.log('JSON string:', JSON.stringify(requestData));
      console.log('====================');
      
      const reportData = await getMonthlyRevenueReport(requestData);
      
      console.log('=== RESPONSE DEBUG ===');
      console.log('Response data:', reportData);
      console.log('Response type:', typeof reportData);
      console.log('Response JSON string:', JSON.stringify(reportData, null, 2));
      console.log('tongdoanhso:', reportData.tongdoanhso, 'type:', typeof reportData.tongdoanhso);
      console.log('soluongdaily:', reportData.soluongdaily, 'type:', typeof reportData.soluongdaily);
      console.log('chitiet:', reportData.chitiet);
      if (reportData.chitiet && reportData.chitiet.length > 0) {
        console.log('First chitiet item:', reportData.chitiet[0]);
        console.log('tonggiatrigiaodich of first item:', reportData.chitiet[0].tonggiatrigiaodich, 'type:', typeof reportData.chitiet[0].tonggiatrigiaodich);
      }
      console.log('======================');
      
      // Update state with received data - keep original values without formatting
      setTongDoanhSo(reportData.tongdoanhso || '0');
      setSoLuongDaiLy(reportData.soluongdaily || 0);
      
      // Map the chitiet data to the expected format - keep original values
      const formattedData = reportData.chitiet?.map(item => ({
        tenDaiLy: item.tendaily,
        soLuongPhieuXuat: item.soluongphieuxuat,
        tongGiaTriGiaoDich: item.tonggiatrigiaodich || '0',
        tiLe: `${item.tilephantramdoanhso}%`
      })) || [];
      
      setBaoCaoData(formattedData);
      
    } catch (err) {
      console.error('=== ERROR DEBUG ===');
      console.error('Full error object:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      console.error('==================');
      setError('Có lỗi xảy ra khi lập báo cáo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleThoat = () => {
    // Reset form
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth(new Date().getMonth() + 1);
    setTongDoanhSo('0');
    setSoLuongDaiLy(0);
    setBaoCaoData([]);
    setError('');
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>Lập Báo Cáo Doanh Số</Card.Header>
        <Card.Body>
          <Form>
            <Row className="mb-3">
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Năm lập báo cáo</Form.Label>
                  <Form.Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Tháng lập báo cáo</Form.Label>
                  <Form.Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  >
                    {months.map(month => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={2}>
                {/* Placeholder for 3rd column */}
              </Col>
              
              <Col md={3}>
                {/* Placeholder for 4th column */}
              </Col>
              
              <Col md={3}>
                {/* Placeholder for 5th column */}
              </Col>
            </Row>
            
            {/* Centered buttons row */}
            <Row className="mb-3">
              <Col className="d-flex justify-content-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleLapBaoCao}
                  disabled={loading}
                >
                  {loading ? 'Đang lập báo cáo...' : 'Lập báo cáo doanh số'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleThoat}
                >
                  Thoát
                </Button>
              </Col>
            </Row>
            
            {error && (
              <Row className="mb-3">
                <Col>
                  <Alert variant="danger">
                    {error}
                  </Alert>
                </Col>
              </Row>
            )}
            
            {/* Total sales row */}
            <Row className="mb-3">
              <Col className="d-flex justify-content-center align-items-center gap-3">
                <span style={{ fontWeight: 'bold' }}>
                  Tổng doanh số trong tháng của tất cả đại lý ({soLuongDaiLy} đại lý):
                </span>
                <Form.Control
                  type="text"
                  value={tongDoanhSo}
                  readOnly
                  style={{ width: '200px' }}
                  className="text-center"
                />
              </Col>
            </Row>
            
            {/* Report table */}
            <Row className="mb-3">
              <Col>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th width="8%">STT</th>
                        <th width="30%">Tên đại lý</th>
                        <th width="20%">Số lượng phiếu xuất</th>
                        <th width="25%">Tổng giá trị giao dịch trong tháng</th>
                        <th width="17%">Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {baoCaoData.length > 0 ? (
                        baoCaoData.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td>{item.tenDaiLy}</td>
                            <td className="text-center">{item.soLuongPhieuXuat}</td>
                            <td className="text-end">{item.tongGiaTriGiaoDich}</td>
                            <td className="text-center">{item.tiLe}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center text-muted">
                            Chưa có dữ liệu báo cáo. Nhấn "Lập báo cáo doanh số" để tạo báo cáo.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};
