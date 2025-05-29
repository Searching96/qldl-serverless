import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "../styles/FormComponent.css";
import { getAllDaily, createPhieuThu } from '../services/api';

export const LapPhieuThuTien = () => {
  const { register, handleSubmit, setValue, reset, clearErrors, formState: { errors } } = useForm();
  
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
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    fetchDaiLyList();
    // Set default date
    setValue("ngayThuTien", getCurrentDate());
  }, [setValue]);

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
    setValue("tenDaiLy", selectedMaDaiLy);
    
    // Clear validation error for agent selection
    clearErrors("tenDaiLy");
    
    if (selectedMaDaiLy) {
      // Load thông tin đại lý khi chọn
      loadDaiLyInfo(selectedMaDaiLy);
    } else {
      // Clear form if no selection
      setValue("noCuaDaiLy", "");
      setValue("dienThoai", "");
      setValue("email", "");
      setValue("diaChi", "");
    }
  };

  const loadDaiLyInfo = (maDaiLy) => {
    try {
      // Find the selected agent from the list
      const selectedAgent = daiLyList.find(agent => agent.madaily === maDaiLy);
      
      if (selectedAgent) {
        setValue("noCuaDaiLy", selectedAgent.congno || '0');
        setValue("dienThoai", selectedAgent.sodienthoai || '');
        setValue("email", selectedAgent.email || '');
        setValue("diaChi", selectedAgent.diachi || '');
      }
    } catch (error) {
      console.error('Error loading agent info:', error);
    }
  };

  const submitHandler = async (data) => {
    setLoadingMessage("Đang lập phiếu thu...");
    setShowLoading(true);
    try {
      // Convert date from dd/mm/yyyy to proper format for API
      const dateParts = data.ngayThuTien.split('/');
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Convert to yyyy-mm-dd
      
      // Find selected agent info for display
      const selectedAgent = daiLyList.find(agent => agent.madaily === data.tenDaiLy);
      
      // Prepare data for API call
      const phieuThuData = {
        madaily: data.tenDaiLy,
        ngaythutien: formattedDate,
        sotienthu: parseInt(data.soTienThu)
      };
      
      // API call to create payment receipt
      const result = await createPhieuThu(phieuThuData);
      console.log('Lập phiếu thu tiền thành công:', result);
      
      // Show simple success message
      setSuccessMessage("Lập phiếu thu thành công");
      setShowSuccess(true);
      
      // Auto hide after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      // Fetch updated agent list after successful creation
      await fetchDaiLyList();
      
      // Clear form after successful creation
      handleThoat();
    } catch (error) {
      console.error('Error creating payment receipt:', error);
      alert('Có lỗi xảy ra khi lập phiếu thu tiền: ' + error.message);
    } finally {
      setShowLoading(false);
    }
  };

  const handleThoat = () => {
    // Clear form or navigate back
    reset();
    setValue("ngayThuTien", getCurrentDate());
  };

  return (
    <div className="container mt-4">
      {showSuccess && (
        <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
          <pre style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
            {successMessage}
          </pre>
        </Alert>
      )}
      
      {showLoading && (
        <Alert variant="info">
          <pre style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
            {loadingMessage}
          </pre>
        </Alert>
      )}
      
      <Card>
        <Card.Header>Lập Phiếu Thu Tiền</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit(submitHandler)}>
            <section className="form-layout">
              {/* Dòng 1: Tên đại lý và Nợ của đại lý */}
              <div className="header">
                <div className="left">
                  <Form.Group className="mb-3">
                    <Form.Label>Tên đại lý</Form.Label>
                    <Form.Select
                      {...register("tenDaiLy", { required: "Vui lòng chọn đại lý" })}
                      onChange={handleDaiLyChange}
                    >
                      <option value="">-- Chọn đại lý --</option>
                      {daiLyList && daiLyList.map((daiLy) => (
                        <option key={daiLy.madaily} value={daiLy.madaily}>
                          {daiLy.tendaily}
                        </option>
                      ))}
                    </Form.Select>
                    {errors.tenDaiLy && <span className="text-danger">{errors.tenDaiLy.message}</span>}
                  </Form.Group>
                </div>
                <div className="leftcenter">
                  <Form.Group className="mb-3">
                    <Form.Label>Nợ của đại lý</Form.Label>
                    <Form.Control
                      type="text"
                      {...register("noCuaDaiLy")}
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
                      {...register("dienThoai")}
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
                      {...register("email")}
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
                      {...register("diaChi")}
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
                      {...register("ngayThuTien", { 
                        required: "Ngày thu tiền là bắt buộc",
                        pattern: {
                          value: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/,
                          message: "Định dạng ngày không hợp lệ (dd/mm/yyyy)"
                        }
                      })}
                      placeholder="dd/mm/yyyy"
                    />
                    {errors.ngayThuTien && <span className="text-danger">{errors.ngayThuTien.message}</span>}
                  </Form.Group>
                </div>

                <div className="center flex-fill">
                  <Form.Group className="mb-3">
                    <Form.Label>Số tiền thu</Form.Label>
                    <Form.Control
                      type="number"
                      {...register("soTienThu", { 
                        required: "Số tiền thu là bắt buộc",
                        min: {
                          value: 0,
                          message: "Số tiền thu không được âm"
                        }
                      })}
                      min="0"
                      step="1"
                      placeholder="Nhập số tiền thu"
                    />
                    {errors.soTienThu && <span className="text-danger">{errors.soTienThu.message}</span>}
                  </Form.Group>
                </div>
              </div>
            </section>
            <div className="d-flex justify-content-between">
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  className="mt-3"
                  disabled={showLoading}
                >
                  {showLoading ? 'Đang lập phiếu thu...' : 'Lập phiếu thu tiền'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-3 ms-2"
                  onClick={() => console.log('Tìm đại lý')}
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
    </div>
  );
};
