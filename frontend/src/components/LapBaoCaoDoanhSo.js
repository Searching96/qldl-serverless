import React, { useState } from 'react';
import { Card, Form, Row, Col, Button } from "react-bootstrap";

export const LapBaoCaoDoanhSo = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [tongDoanhSo, setTongDoanhSo] = useState('0');
  const [baoCaoData, setBaoCaoData] = useState([]);

  // Generate years array (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

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
                  onClick={() => console.log('Lập báo cáo doanh số cho', selectedMonth, '/', selectedYear)}
                >
                  Lập báo cáo doanh số
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => console.log('Thoát')}
                >
                  Thoát
                </Button>
              </Col>
            </Row>
            
            {/* Total sales row */}
            <Row className="mb-3">
              <Col className="d-flex justify-content-center align-items-center gap-3">
                <span style={{ fontWeight: 'bold' }}>
                  Tổng doanh số trong tháng của tất cả đại lý:
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
