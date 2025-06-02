import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Alert, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getAllDaily, createPhieuThu } from '../services/api';
import { DaiLySelectionModal } from './DaiLySelectionModal';

export const LapPhieuThuTien = () => {
  const { register, handleSubmit, setValue, reset, clearErrors, formState: { errors } } = useForm();
  const navigate = useNavigate();

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
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [showDaiLyModal, setShowDaiLyModal] = useState(false);
  const [selectedDaiLy, setSelectedDaiLy] = useState(null);

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

      // Display message from backend if available, otherwise default success message
      const message = result?.message || "Lập phiếu thu thành công";
      setSuccessMessage(message);
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

      // Display error message in Alert format instead of browser alert
      setErrorMessage(error.message || 'Có lỗi xảy ra khi lập phiếu thu tiền');
      setShowError(true);

      // Auto hide error after 8 seconds
      setTimeout(() => {
        setShowError(false);
      }, 8000);
    } finally {
      setShowLoading(false);
    }
  };

  const handleThoat = () => {
    // Clear form or navigate back
    reset();
    setValue("ngayThuTien", getCurrentDate());
  };

  const handleExitToHome = () => {
    navigate("/");
  };

  const handleDaiLySelect = (daiLy) => {
    setSelectedDaiLy(daiLy);
    setValue("tenDaiLy", daiLy.madaily);
    setValue("noCuaDaiLy", daiLy.congno || '0');
    setValue("dienThoai", daiLy.sodienthoai || daiLy.dienthoai || '');
    setValue("email", daiLy.email || '');
    setValue("diaChi", daiLy.diachi || '');
    setShowDaiLyModal(false);
    clearErrors("tenDaiLy");
  };

  const handleShowDaiLyModal = () => {
    setShowDaiLyModal(true);
  };

  return (
    <div className="container-fluid px-0 mt-4">
      <h1 className="ms-3">Lập phiếu thu tiền</h1>

      {/* Alert messages */}
      {showSuccess && (
        <div className="alert alert-success mx-3" role="alert">
          <div className="d-flex justify-content-between align-items-center">
            <span>{successMessage}</span>
            <button
              className="btn btn-outline-primary btn-sm ms-2"
              onClick={() => setShowSuccess(false)}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        </div>
      )}

      {showLoading && (
        <div className="alert alert-info mx-3" role="alert">
          <div className="d-flex justify-content-between align-items-center">
            <span>{loadingMessage}</span>
            <button
              className="btn btn-outline-primary btn-sm ms-2"
              onClick={() => setShowLoading(false)}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        </div>
      )}

      {showError && (
        <div className="alert alert-danger mx-3" role="alert">
          <div className="d-flex justify-content-between align-items-center">
            <span>{errorMessage}</span>
            <button
              className="btn btn-outline-primary btn-sm ms-2"
              onClick={() => setShowError(false)}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        </div>
      )}

      <div className="px-3">
        <div className="container-fluid">
          <Card>
            <Card.Header className="bg-primary text-white text-center py-3">
              <h4 className="mb-0">💰 Lập Phiếu Thu Tiền</h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit(submitHandler)}>
                <div className="bg-light rounded p-4 mb-4">
                  <h6 className="text-primary fw-semibold mb-3 border-bottom border-primary pb-2">Thông tin phiếu thu</h6>
                  
                  {/* First row */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label className="fw-medium mb-2">Tên đại lý</Form.Label>
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
                          {selectedDaiLy && (
                            <option value={selectedDaiLy.madaily} selected>
                              {selectedDaiLy.tendaily}
                            </option>
                          )}
                        </Form.Select>
                        {errors.tenDaiLy && <div className="text-danger small mt-1">{errors.tenDaiLy.message}</div>}
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label className="fw-medium mb-2">Nợ của đại lý</Form.Label>
                        <Form.Control
                          type="text"
                          {...register("noCuaDaiLy")}
                          readOnly
                          placeholder="Nợ hiện tại"
                        />
                      </Form.Group>
                    </div>
                  </div>

                  {/* Second row */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label className="fw-medium mb-2">Số điện thoại</Form.Label>
                        <Form.Control
                          type="tel"
                          {...register("dienThoai")}
                          placeholder="Số điện thoại"
                          readOnly
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label className="fw-medium mb-2">Email</Form.Label>
                        <Form.Control
                          type="email"
                          {...register("email")}
                          placeholder="Địa chỉ email"
                          readOnly
                        />
                      </Form.Group>
                    </div>
                  </div>

                  {/* Third row */}
                  <div className="row g-3 mb-3">
                    <div className="col-12">
                      <Form.Group>
                        <Form.Label className="fw-medium mb-2">Địa chỉ</Form.Label>
                        <Form.Control
                          type="text"
                          {...register("diaChi")}
                          placeholder="Địa chỉ"
                          readOnly
                        />
                      </Form.Group>
                    </div>
                  </div>

                  {/* Fourth row */}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label className="fw-medium mb-2">Ngày thu tiền</Form.Label>
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
                        {errors.ngayThuTien && <div className="text-danger small mt-1">{errors.ngayThuTien.message}</div>}
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label className="fw-medium mb-2">Số tiền thu</Form.Label>
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
                        {errors.soTienThu && <div className="text-danger small mt-1">{errors.soTienThu.message}</div>}
                      </Form.Group>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 justify-content-center pt-3 border-top">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={showLoading}
                    className="px-4"
                  >
                    {showLoading ? 'Đang lập phiếu thu...' : '💰 Lập phiếu thu tiền'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline-primary"
                    onClick={handleShowDaiLyModal}
                    className="px-4"
                  >
                    🔍 Tìm đại lý
                  </Button>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={handleThoat}
                    className="px-4"
                  >
                    🗑️ Làm mới
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
      </div>

      {/* DaiLy Selection Modal */}
      <DaiLySelectionModal
        show={showDaiLyModal}
        onHide={() => setShowDaiLyModal(false)}
        onSelect={handleDaiLySelect}
      />
    </div>
  );
};
