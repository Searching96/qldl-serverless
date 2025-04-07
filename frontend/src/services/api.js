// src/services/api.js
const API_DOMAIN = 'https://testapi.thinhuit.id.vn';

async function fetchData(endpoint, method = 'GET', body = null) {
  const url = `${API_DOMAIN}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };
  const config = {
    method,
    headers,
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const getAllDaily = () => fetchData('/daily/');
export const getDaily = (maDaiLy) => fetchData(`/daily/${maDaiLy}`);
export const createDaily = (data) => fetchData('/daily/', 'POST', data);
export const updateDaily = (maDaiLy, data) => fetchData(`/daily/${maDaiLy}`, 'PUT', data);
export const deleteDaily = (maDaiLy) => fetchData(`/daily/${maDaiLy}`, 'DELETE');

export const getAllQuan = () => fetchData('/quan/');
export const getQuan = (maQuan) => fetchData(`/quan/${maQuan}`);
export const createQuan = (data) => fetchData('/quan/', 'POST', data);
export const updateQuan = (maQuan, data) => fetchData(`/quan/${maQuan}`, 'PUT', data);
export const deleteQuan = (maQuan) => fetchData(`/quan/${maQuan}`, 'DELETE');

export const getAllLoaiDaiLy = () => fetchData('/loaidaily/');
export const getLoaiDaiLy = (maLoaiDaiLy) => fetchData(`/loaidaily/${maLoaiDaiLy}`);
export const createLoaiDaiLy = (data) => fetchData('/loaidaily/', 'POST', data);
export const updateLoaiDaiLy = (maLoaiDaiLy, data) => fetchData(`/loaidaily/${maLoaiDaiLy}`, 'PUT', data);
export const deleteLoaiDaiLy = (maLoaiDaiLy) => fetchData(`/loaidaily/${maLoaiDaiLy}`, 'DELETE');

// Add similar functions for other entities (donvitinh, loaidaily, etc.)
export const getAllDonViTinh = () => fetchData('/donvitinh/');
export const getDonViTinh = (maDonViTinh) => fetchData(`/donvitinh/${maDonViTinh}`);
export const createDonViTinh = (data) => fetchData('/donvitinh/', 'POST', data);
export const updateDonViTinh = (maDonViTinh, data) => fetchData(`/donvitinh/${maDonViTinh}`, 'PUT', data);
export const deleteDonViTinh = (maDonViTinh) => fetchData(`/donvitinh/${maDonViTinh}`, 'DELETE');

export const getLatestMaDaiLy = () => fetchData('/id/madl');
export const getLatestMaDonViTinh = () => fetchData('/id/madvt');
export const getLatestMaLoaiDaiLy = () => fetchData('/id/maldl');
export const getLatestMaQuan = () => fetchData('/idmaphieuxuat/maquan');
export const getLatestMaMatHang = () => fetchData('/idmaphieuxuat/mamh');
export const getLatestMaPhieuThu = () => fetchData('/idmaphieuxuat/mapt');
export const getLatestMaPhieuXuat = () => fetchData('/idmaphieuxuat/mapx');