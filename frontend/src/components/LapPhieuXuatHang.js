import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Alert, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getAllDaily, createPhieuXuat, getAllMatHang, getAllPhieuXuat } from '../services/api';

export const LapPhieuXuatHang = () => {
  const { register, handleSubmit, setValue, reset, clearErrors, formState: { errors } } = useForm();
  const navigate = useNavigate();
  
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    fetchDaiLyList();
    fetchMatHangList();
    generateMaPhieuXuat();
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
    try {
      const data = await getAllMatHang();
      setMatHangList(data);
    } catch (error) {
      console.error('Error fetching product list:', error);
    }
  };

  const generateMaPhieuXuat = async () => {
    try {
      const phieuXuatList = await getAllPhieuXuat();
      console.log('Current phieu xuat list:', phieuXuatList);
      
      // Get the count and add 1 for next ID
      const currentCount = Array.isArray(phieuXuatList) ? phieuXuatList.length : 0;
      const nextNumber = currentCount + 1;
      
      // Format with leading zeros (5 digits total)
      const formattedNumber = nextNumber.toString().padStart(5, '0');
      const newMaPhieuXuat = `PX${formattedNumber}`;
      
      console.log('Generated new MaPhieuXuat:', newMaPhieuXuat);
      setValue("maPhieuXuat", newMaPhieuXuat);
    } catch (error) {
      console.error('Error generating export receipt ID:', error);
      // Fallback to manual input if API fails
      setValue("maPhieuXuat", "");
    }
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
    
    // Store raw number value for calculation
    chiTiet[index].thanhTienValue = thanhTien;
    // Store as plain number without formatting
    chiTiet[index].thanhTien = thanhTien.toString();
    
    // Calculate total from all items
    calculateTongTien(chiTiet);
  };

  const calculateTongTien = (chiTiet) => {
    const tongTien = chiTiet.reduce((sum, item) => {
      // Use the raw number value instead of parsing formatted string
      const itemThanhTien = item.thanhTienValue || 0;
      return sum + itemThanhTien;
    }, 0);
        
    setValue("tongTien", tongTien.toString());
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
      // Recalculate total after removing row
      calculateTongTien(newChiTiet);
    }
  };

  const submitHandler = async (data) => {
    // Validation checks before submission
    const validationErrors = [];
    
    // Check if no items are selected
    const hasSelectedItems = chiTietPhieu.some(item => item.tenMatHang);
    if (!hasSelectedItems) {
      validationErrors.push('Phải chọn ít nhất một mặt hàng để xuất');
    }
    
    // Check for missing required fields in selected items
    chiTietPhieu.forEach((item, index) => {
      if (item.tenMatHang) {
        // If item is selected, check required fields
        if (!item.soLuongXuat || item.soLuongXuat === '0') {
          const selectedProduct = matHangList.find(mh => mh.mamathang === item.tenMatHang);
          const tenMatHang = selectedProduct ? selectedProduct.tenmathang : item.tenMatHang;
          validationErrors.push(`Mặt hàng "${tenMatHang}" chưa nhập số lượng xuất`);
        }
        
        if (!item.donGiaXuat || item.donGiaXuat === '0') {
          const selectedProduct = matHangList.find(mh => mh.mamathang === item.tenMatHang);
          const tenMatHang = selectedProduct ? selectedProduct.tenmathang : item.tenMatHang;
          validationErrors.push(`Mặt hàng "${tenMatHang}" chưa nhập đơn giá xuất`);
        }
      }
    });
    
    // Check inventory for each item
    chiTietPhieu.forEach((item, index) => {
      if (item.tenMatHang && item.soLuongXuat) {
        const soLuongTon = parseInt(item.soLuongTon) || 0;
        const soLuongXuat = parseInt(item.soLuongXuat) || 0;
        
        if (soLuongXuat > soLuongTon) {
          const selectedProduct = matHangList.find(mh => mh.mamathang === item.tenMatHang);
          const tenMatHang = selectedProduct ? selectedProduct.tenmathang : item.tenMatHang;
          validationErrors.push(`Mặt hàng "${tenMatHang}" có số lượng tồn (${soLuongTon}) nhỏ hơn số lượng xuất (${soLuongXuat})`);
        }
      }
    });
    
    // Check debt limit
    const noDaiLy = parseFloat(String(data.noDaiLy || '0').replace(/\./g, '').replace(/,/g, '')) || 0;
    const tongTien = parseFloat(String(data.tongTien || '0').replace(/\./g, '').replace(/,/g, '')) || 0;
    const noToiDa = parseFloat(String(data.noToiDa || '0').replace(/\./g, '').replace(/,/g, '')) || 0;
    const noSauGiaoDich = noDaiLy + tongTien;
    
    // Debug logging
    console.log('=== DEBT VALIDATION DEBUG ===');
    console.log('Original data:', { noDaiLy: data.noDaiLy, tongTien: data.tongTien, noToiDa: data.noToiDa });
    console.log('Parsed values:', { noDaiLy, tongTien, noToiDa, noSauGiaoDich });
    console.log('Types:', { 
      noDaiLy: typeof noDaiLy, 
      tongTien: typeof tongTien, 
      noToiDa: typeof noToiDa, 
      noSauGiaoDich: typeof noSauGiaoDich 
    });
    console.log('Comparison: noSauGiaoDich > noToiDa:', noSauGiaoDich > noToiDa, `(${noSauGiaoDich} > ${noToiDa})`);
    console.log('=============================');
    
    if (noSauGiaoDich > noToiDa) {
      validationErrors.push(`Nợ sau giao dịch (${noSauGiaoDich.toLocaleString('vi-VN')} VNĐ) vượt quá nợ tối đa (${noToiDa.toLocaleString('vi-VN')} VNĐ)`);
    }
    
    // Show validation errors if any
    if (validationErrors.length > 0) {
      const errorMsg = `Không thể lập phiếu xuất:\n\n${validationErrors.join('\n')}`;
      setErrorMessage(errorMsg);
      setShowError(true);
      
      setTimeout(() => {
        setShowError(false);
      }, 8000);
      return;
    }
    
    setLoadingMessage("Đang lập phiếu xuất...");
    setShowLoading(true);
    try {
      // Use the date directly from the date picker (already in YYYY-MM-DD format)
      const formattedDate = data.ngayLap;
      
      // Prepare chi tiết data
      const chitiet = chiTietPhieu
        .filter(item => item.tenMatHang && item.soLuongXuat && item.donGiaXuat)
        .map(item => ({
          mamathang: item.tenMatHang,
          soluongxuat: parseInt(item.soLuongXuat),
          dongiaxuat: parseInt(parseFloat(item.donGiaXuat)), // Convert to integer
          thanhtien: parseInt(parseFloat(item.thanhTien.replace(/\./g, '').replace(/,/g, '')) || 0) // Remove dots and commas first
        }));
      
      const phieuXuatData = {
        maphieuxuat: data.maPhieuXuat,
        madaily: data.tenDaiLy,
        ngaylap: formattedDate,
        tonggiatri: parseInt(parseFloat(data.tongTien.replace(/\./g, '').replace(/,/g, '')) || 0), // Remove dots (thousands separator) and commas
        chitiet: chitiet
      };
      
      // Debug: Log the exact data being sent
      console.log('=== DEBUG: Data being sent to API ===');
      console.log('Form data received:', data);
      console.log('data.tongTien:', data.tongTien, 'type:', typeof data.tongTien);
      console.log('After removing dots and commas:', data.tongTien.replace(/\./g, '').replace(/,/g, ''));
      console.log('After parseFloat:', parseFloat(data.tongTien.replace(/\./g, '').replace(/,/g, '')));
      console.log('After parseInt:', parseInt(parseFloat(data.tongTien.replace(/\./g, '').replace(/,/g, '')) || 0));
      console.log('Chi tiết phiếu array:', chiTietPhieu);
      console.log('Filtered chi tiết:', chitiet);
      console.log('Final phieuXuatData:', phieuXuatData);
      console.log('JSON string to be sent:');
      console.log(JSON.stringify(phieuXuatData, null, 2));
      console.log('=====================================');
      
      const result = await createPhieuXuat(phieuXuatData);
      console.log('Lập phiếu xuất hàng thành công:', result);
      
      // Display message from backend if available, otherwise default success message
      const message = result?.message || "Lập phiếu xuất thành công";
      setSuccessMessage(message);
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
    generateMaPhieuXuat();
    setChiTietPhieu([
      { stt: 1, tenMatHang: '', tenDonViTinh: '', soLuongTon: '', soLuongXuat: '', donGiaXuat: '', thanhTien: '' }
    ]);
  };

  const handleExitToHome = () => {
    navigate("/");
  };

  return (
    <div className="container-fluid px-0 mt-4">
      <h1 className="ms-3">Lập phiếu xuất hàng</h1>
      
      {/* Alert messages following TiepNhanDaiLy pattern */}
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
              <h4 className="mb-0">📋 Lập Phiếu Xuất Hàng</h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit(submitHandler)}>
                <div className="bg-light rounded p-4 mb-4">
                  <h6 className="text-primary fw-semibold mb-3 border-bottom border-primary pb-2">Thông tin phiếu xuất</h6>
                  
                  {/* Form fields in rows */}
                  <div className="row g-3">
                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <Form.Group>
                        <Form.Label className="fw-medium mb-2">Mã phiếu xuất</Form.Label>
                        <Form.Control
                          type="text"
                          {...register("maPhieuXuat", { required: "Mã phiếu xuất là bắt buộc" })}
                          placeholder="Mã phiếu xuất"
                        />
                        {errors.maPhieuXuat && <div className="text-danger small mt-1">{errors.maPhieuXuat.message}</div>}
                      </Form.Group>
                    </div>
                    
                    <div className="col-lg-2 col-md-4 col-sm-6">
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
                        </Form.Select>
                        {errors.tenDaiLy && <div className="text-danger small mt-1">{errors.tenDaiLy.message}</div>}
                      </Form.Group>
                    </div>
                    
                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <Form.Group>
                        <Form.Label className="fw-medium mb-2">Nợ đại lý</Form.Label>
                        <Form.Control
                          type="text"
                          {...register("noDaiLy")}
                          readOnly
                          placeholder="Nợ hiện tại"
                        />
                      </Form.Group>
                    </div>
                    
                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <Form.Group>
                        <Form.Label className="fw-medium mb-2">Nợ tối đa</Form.Label>
                        <Form.Control
                          type="text"
                          {...register("noToiDa")}
                          readOnly
                          placeholder="Nợ tối đa"
                        />
                      </Form.Group>
                    </div>
                    
                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <Form.Group>
                        <Form.Label className="fw-medium mb-2">Ngày lập</Form.Label>
                        <Form.Control
                          type="date"
                          {...register("ngayLap", { 
                            required: "Ngày lập là bắt buộc"
                          })}
                        />
                        {errors.ngayLap && <div className="text-danger small mt-1">{errors.ngayLap.message}</div>}
                      </Form.Group>
                    </div>
                    
                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <Form.Group>
                        <Form.Label className="fw-medium mb-2">Tổng tiền</Form.Label>
                        <Form.Control
                          type="text"
                          {...register("tongTien")}
                          readOnly
                          placeholder="Tổng tiền"
                        />
                      </Form.Group>
                    </div>
                  </div>
                </div>

                {/* Chi tiết mặt hàng */}
                <Card className="mt-3">
                  <Card.Header className="bg-secondary text-white py-3">
                    <h6 className="mb-0">📦 Chi tiết mặt hàng</h6>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <Table bordered hover className="mb-0">
                        <thead className="table-light">
                          <tr>
                            <th width="5%">STT</th>
                            <th width="23%">Tên mặt hàng</th>
                            <th width="15%">Tên đơn vị tính</th>
                            <th width="10%">Số lượng tồn</th>
                            <th width="10%">Số lượng xuất</th>
                            <th width="15%">Đơn giá xuất</th>
                            <th width="15%">Thành tiền</th>
                            <th width="7%">Thao tác</th>
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
                      </Table>
                    </div>
                    <div className="p-3">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={addRow}
                      >
                        ➕ Thêm dòng
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
                
                <div className="d-flex flex-wrap gap-2 justify-content-center mt-4 pt-3 border-top">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={showLoading}
                    className="px-4"
                  >
                    {showLoading ? 'Đang lập phiếu xuất...' : '📋 Lập phiếu xuất hàng'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => console.log('Tìm đại lý')}
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
    </div>
  );
};