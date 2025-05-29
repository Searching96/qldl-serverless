import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "../styles/FormComponent.css";
import { getAllDaily, createPhieuXuat } from '../services/api';

export const LapPhieuXuatHang = () => {
  const { register, handleSubmit, setValue, reset, clearErrors, formState: { errors } } = useForm();
  
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [daiLyList, setDaiLyList] = useState([]);
  const [matHangList, setMatHangList] = useState([]);
  const [chiTietPhieu, setChiTietPhieu] = useState([
    { stt: 1, tenMatHang: '', tenDonViTinh: '', soLuongTon: '', soLuongXuat: '', donGiaXuat: '', thanhTien: '' }
  ]);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    fetchDaiLyList();
    fetchMatHangList();
    setValue("ngayLap", getCurrentDate());
  }, [setValue]);

  const fetchDaiLyList = async () => {
    try {
      const data = await getAllDaily();
      setDaiLyList(data);
    } catch (error) {
      console.error('Error fetching agent list:', error);
    }
  };

  const fetchMatHangList = async () => {
    // try {
    //   //const data = await getAllMatHang();
    //   setMatHangList(data);
    // } catch (error) {
    //   console.error('Error fetching product list:', error);
    // }
  };

  const handleDaiLyChange = (e) => {
    const selectedMaDaiLy = e.target.value;
    setValue("tenDaiLy", selectedMaDaiLy);
    
    clearErrors("tenDaiLy");
    
    if (selectedMaDaiLy) {
      loadDaiLyInfo(selectedMaDaiLy);
    } else {
      setValue("noDaiLy", "");
      setValue("noToiDa", "");
    }
  };

  const loadDaiLyInfo = (maDaiLy) => {
    try {
      const selectedAgent = daiLyList.find(agent => agent.madaily === maDaiLy);
      
      if (selectedAgent) {
        setValue("noDaiLy", selectedAgent.congno || '0');
        setValue("noToiDa", selectedAgent.notoida || '0');
      }
    } catch (error) {
      console.error('Error loading agent info:', error);
    }
  };

  const handleMatHangChange = (index, selectedMatHang) => {
    const selectedProduct = matHangList.find(mh => mh.mamathang === selectedMatHang);
    const newChiTiet = [...chiTietPhieu];
    
    if (selectedProduct) {
      newChiTiet[index] = {
        ...newChiTiet[index],
        tenMatHang: selectedMatHang,
        tenDonViTinh: selectedProduct.tendonvitinh || '',
        soLuongTon: selectedProduct.soluongton || '0'
      };
    } else {
      newChiTiet[index] = {
        ...newChiTiet[index],
        tenMatHang: '',
        tenDonViTinh: '',
        soLuongTon: ''
      };
    }
    
    setChiTietPhieu(newChiTiet);
    calculateThanhTien(index, newChiTiet);
  };

  const handleSoLuongXuatChange = (index, value) => {
    const newChiTiet = [...chiTietPhieu];
    newChiTiet[index].soLuongXuat = value;
    setChiTietPhieu(newChiTiet);
    calculateThanhTien(index, newChiTiet);
  };

  const handleDonGiaXuatChange = (index, value) => {
    const newChiTiet = [...chiTietPhieu];
    newChiTiet[index].donGiaXuat = value;
    setChiTietPhieu(newChiTiet);
    calculateThanhTien(index, newChiTiet);
  };

  const calculateThanhTien = (index, chiTiet) => {
    const soLuong = parseFloat(chiTiet[index].soLuongXuat) || 0;
    const donGia = parseFloat(chiTiet[index].donGiaXuat) || 0;
    const thanhTien = soLuong * donGia;
    
    chiTiet[index].thanhTien = thanhTien.toLocaleString('vi-VN');
    
    // Calculate total
    const tongTien = chiTiet.reduce((sum, item) => {
      const itemThanhTien = parseFloat(item.thanhTien.replace(/,/g, '')) || 0;
      return sum + itemThanhTien;
    }, 0);
    
    setValue("tongTien", tongTien.toLocaleString('vi-VN'));
  };

  const addRow = () => {
    setChiTietPhieu([...chiTietPhieu, {
      stt: chiTietPhieu.length + 1,
      tenMatHang: '',
      tenDonViTinh: '',
      soLuongTon: '',
      soLuongXuat: '',
      donGiaXuat: '',
      thanhTien: ''
    }]);
  };

  const removeRow = (index) => {
    if (chiTietPhieu.length > 1) {
      const newChiTiet = chiTietPhieu.filter((_, i) => i !== index);
      // Renumber STT
      newChiTiet.forEach((item, i) => {
        item.stt = i + 1;
      });
      setChiTietPhieu(newChiTiet);
    }
  };

  const submitHandler = async (data) => {
    setLoadingMessage("Đang lập phiếu xuất...");
    setShowLoading(true);
    try {
      const dateParts = data.ngayLap.split('/');
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      
      const phieuXuatData = {
        maphieuxuat: data.maPhieuXuat,
        madaily: data.tenDaiLy,
        ngaylap: formattedDate,
        tongtien: parseInt(data.tongTien) || 0
      };
      
      const result = await createPhieuXuat(phieuXuatData);
      console.log('Lập phiếu xuất hàng thành công:', result);
      
      setSuccessMessage("Lập phiếu xuất thành công");
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      await fetchDaiLyList();
      handleThoat();
    } catch (error) {
      console.error('Error creating export receipt:', error);
      alert('Có lỗi xảy ra khi lập phiếu xuất hàng: ' + error.message);
    } finally {
      setShowLoading(false);
    }
  };

  const handleThoat = () => {
    reset();
    setValue("ngayLap", getCurrentDate());
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
        <Card.Header>Lập Phiếu Xuất Hàng</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit(submitHandler)}>
            <section className="form-layout">
              {/* Dòng 1: 6 ô thông tin */}
              <div className="row mb-3">
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Mã phiếu xuất</Form.Label>
                    <Form.Control
                      type="text"
                      {...register("maPhieuXuat", { required: "Mã phiếu xuất là bắt buộc" })}
                      placeholder="Mã phiếu xuất"
                    />
                    {errors.maPhieuXuat && <span className="text-danger">{errors.maPhieuXuat.message}</span>}
                  </Form.Group>
                </div>
                
                <div className="col-md-2">
                  <Form.Group>
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
                
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Nợ đại lý</Form.Label>
                    <Form.Control
                      type="text"
                      {...register("noDaiLy")}
                      readOnly
                      placeholder="Nợ hiện tại"
                    />
                  </Form.Group>
                </div>
                
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Nợ tối đa</Form.Label>
                    <Form.Control
                      type="text"
                      {...register("noToiDa")}
                      readOnly
                      placeholder="Nợ tối đa"
                    />
                  </Form.Group>
                </div>
                
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Ngày lập</Form.Label>
                    <Form.Control
                      type="text"
                      {...register("ngayLap", { 
                        required: "Ngày lập là bắt buộc",
                        pattern: {
                          value: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/,
                          message: "Định dạng ngày không hợp lệ (dd/mm/yyyy)"
                        }
                      })}
                      placeholder="dd/mm/yyyy"
                    />
                    {errors.ngayLap && <span className="text-danger">{errors.ngayLap.message}</span>}
                  </Form.Group>
                </div>
                
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Tổng tiền</Form.Label>
                    <Form.Control
                      type="text"
                      {...register("tongTien")}
                      readOnly
                      placeholder="Tổng tiền"
                    />
                  </Form.Group>
                </div>
              </div>
              
              {/* Dòng 2: Chi tiết mặt hàng */}
              <div className="row mb-3">
                <div className="col-12">
                  <h5>Chi tiết mặt hàng</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th width="5%">STT</th>
                          <th width="25%">Tên mặt hàng</th>
                          <th width="15%">Tên đơn vị tính</th>
                          <th width="10%">Số lượng tồn</th>
                          <th width="10%">Số lượng xuất</th>
                          <th width="15%">Đơn giá xuất</th>
                          <th width="15%">Thành tiền</th>
                          <th width="5%">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chiTietPhieu.map((item, index) => (
                          <tr key={index}>
                            <td>{item.stt}</td>
                            <td>
                              <Form.Select
                                value={item.tenMatHang}
                                onChange={(e) => handleMatHangChange(index, e.target.value)}
                              >
                                <option value="">-- Chọn mặt hàng --</option>
                                {matHangList && matHangList.map((matHang) => (
                                  <option key={matHang.mamathang} value={matHang.mamathang}>
                                    {matHang.tenmathang}
                                  </option>
                                ))}
                              </Form.Select>
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={item.tenDonViTinh}
                                readOnly
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={item.soLuongTon}
                                readOnly
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                value={item.soLuongXuat}
                                onChange={(e) => handleSoLuongXuatChange(index, e.target.value)}
                                min="0"
                                step="1"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                value={item.donGiaXuat}
                                onChange={(e) => handleDonGiaXuatChange(index, e.target.value)}
                                min="0"
                                step="1000"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={item.thanhTien}
                                readOnly
                              />
                            </td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => removeRow(index)}
                                disabled={chiTietPhieu.length === 1}
                              >
                                Xóa
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={addRow}
                    className="mb-3"
                  >
                    Thêm dòng
                  </Button>
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
                  {showLoading ? 'Đang lập phiếu xuất...' : 'Lập phiếu xuất hàng'}
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