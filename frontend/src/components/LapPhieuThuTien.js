import React, { useState, useEffect } from 'react';
import { Button, Form, Card } from "react-bootstrap";
import "../styles/FormComponent.css";
import { getAllDaily } from '../services/api';

export const LapPhieuThuTien = () => {
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [formData, setFormData] = useState({
    tenDaiLy: '',
    noCuaDaiLy: '',
    dienThoai: '',
    email: '',
    diaChi: '',
    ngayThuTien: getCurrentDate(),
    soTienThu: ''
  });

  const [daiLyList, setDaiLyList] = useState([]);

  useEffect(() => {
    fetchDaiLyList();
  }, []);

  const fetchDaiLyList = async () => {
    try {
      const data = await getAllDaily();
      setDaiLyList(data);
    } catch (error) {
      console.error('Error fetching agent list:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDaiLyChange = (e) => {
    const selectedMaDaiLy = e.target.value;
    setFormData(prev => ({
      ...prev,
      tenDaiLy: selectedMaDaiLy
    }));
    
    if (selectedMaDaiLy) {
      // Load thông tin đại lý khi chọn
      loadDaiLyInfo(selectedMaDaiLy);
    } else {
      // Clear form if no selection
      setFormData(prev => ({
        ...prev,
        noCuaDaiLy: '',
        dienThoai: '',
        email: '',
        diaChi: ''
      }));
    }
  };

  const loadDaiLyInfo = (maDaiLy) => {
    try {
      // Find the selected agent from the list
      const selectedAgent = daiLyList.find(agent => agent.madaily === maDaiLy);
      
      if (selectedAgent) {
        setFormData(prev => ({
          ...prev,
          noCuaDaiLy: selectedAgent.congno || '0',
          dienThoai: selectedAgent.sodienthoai || '',
          email: selectedAgent.email || '',
          diaChi: selectedAgent.diachi || ''
        }));
      }
    } catch (error) {
      console.error('Error loading agent info:', error);
    }
  };

  const handleLapPhieuThuTien = async () => {
    try {
      // Validate form data
      if (!formData.tenDaiLy || !formData.soTienThu || !formData.ngayThuTien) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
      }
      
      // API call to create payment receipt
      console.log('Lập phiếu thu tiền:', formData);
      alert('Lập phiếu thu tiền thành công!');
    } catch (error) {
      console.error('Error creating payment receipt:', error);
      alert('Có lỗi xảy ra khi lập phiếu thu tiền!');
    }
  };

  const handleTimDaiLy = () => {
    // Open agent search dialog or navigate to search page
    console.log('Tìm đại lý');
  };

  const handleThoat = () => {
    // Clear form or navigate back
    setFormData({
      tenDaiLy: '',
      noCuaDaiLy: '',
      dienThoai: '',
      email: '',
      diaChi: '',
      ngayThuTien: getCurrentDate(),
      soTienThu: ''
    });
  };

  return (
    <Card>
      <Card.Header>Lập Phiếu Thu Tiền</Card.Header>
      <Card.Body>
        <Form>
          <section className="form-layout">
            {/* Dòng 1: Tên đại lý và Nợ của đại lý */}
            <div className="header">
              <div className="left">
                <Form.Group className="mb-3">
                  <Form.Label>Tên đại lý</Form.Label>
                  <Form.Select
                    name="tenDaiLy"
                    value={formData.tenDaiLy}
                    onChange={handleDaiLyChange}
                  >
                    <option value="">-- Chọn đại lý --</option>
                    {daiLyList && daiLyList.map((daiLy) => (
                      <option key={daiLy.madaily} value={daiLy.madaily}>
                        {daiLy.tendaily}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="leftcenter">
                <Form.Group className="mb-3">
                  <Form.Label>Nợ của đại lý</Form.Label>
                  <Form.Control
                    type="text"
                    name="noCuaDaiLy"
                    value={formData.noCuaDaiLy}
                    onChange={handleInputChange}
                    readOnly
                    placeholder="Nợ hiện tại"
                  />
                </Form.Group>
              </div>
            </div>
            {/* Dòng 2: Điện thoại và Email */}
            <div className="body d-flex gap-3">
              <div className="left">
                <Form.Group className="mb-3">
                  <Form.Label>Điện thoại</Form.Label>
                  <Form.Control
                    type="tel"
                    name="dienThoai"
                    value={formData.dienThoai}
                    onChange={handleInputChange}
                    placeholder="Số điện thoại"
                    readOnly
                  />
                </Form.Group>
              </div>
              <div className="center">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Địa chỉ email"
                    readOnly
                  />
                </Form.Group>
              </div>
            </div>
            {/* Dòng 3: Địa chỉ */}
            <div className="footer d-flex gap-3">
              <div className="left flex-fill">
                <Form.Group className="mb-3">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    type="text"
                    name="diaChi"
                    value={formData.diaChi}
                    onChange={handleInputChange}
                    placeholder="Địa chỉ"
                    readOnly
                  />
                </Form.Group>
              </div>
            </div>
            {/* Dòng 4: Ngày thu tiền và Số tiền thu */}
            <div className="content d-flex gap-3">  
              <div className="left flex-fill">
                <Form.Group className="mb-3">
                  <Form.Label>Ngày thu tiền</Form.Label>
                  <Form.Control
                    type="text"
                    name="ngayThuTien"
                    value={formData.ngayThuTien}
                    onChange={handleInputChange}
                    placeholder="dd/mm/yyyy"
                  />
                </Form.Group>
              </div>

              <div className="center flex-fill">
                <Form.Group className="mb-3">
                  <Form.Label>Số tiền thu</Form.Label>
                  <Form.Control
                    type="number"
                    name="soTienThu"
                    value={formData.soTienThu}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    placeholder="Nhập số tiền thu"
                  />
                </Form.Group>
              </div>
            </div>
          </section>
          <div className="d-flex justify-content-between">
            <div>
              <Button
                type="button"
                variant="primary"
                className="mt-3"
                onClick={handleLapPhieuThuTien}
              >
                Lập phiếu thu tiền
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="mt-3 ms-2"
                onClick={handleTimDaiLy}
              >
                Tìm đại lý
              </Button>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="mt-3"
              onClick={handleThoat}
            >
              Thoát
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
