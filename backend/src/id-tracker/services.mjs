// src/id-tracker/service.js

import { query } from '../shared/database.mjs';
import { validateRequiredFields, isNonNegativeInteger, isPositiveInteger } from '../shared/validation.mjs';
import { ValidationError, NotFoundError } from '../shared/errorHandler.mjs';
import { ERROR_MESSAGES } from '../shared/constants.mjs';

class IdTrackerService {
  // Get the latest MaDaiLy (e.g., 'DL00001')
  async getLatestMaDaiLy() {
    const queryString = `
      UPDATE inventory.ID_TRACKER
      SET MaDaiLyCuoi = MaDaiLyCuoi + 1
      RETURNING 'DL' || LPAD(MaDaiLyCuoi::TEXT, 5, '0') AS formatted_ma_daily`;
    const result = await query(queryString);
    return result.rows[0].formatted_ma_daily;
  }

  // Get the latest MaDonViTinh (e.g., 'DVT00001')
  async getLatestMaDonViTinh() {
    const queryString = `
      UPDATE inventory.ID_TRACKER
      SET MaDonViTinhCuoi = MaDonViTinhCuoi + 1
      RETURNING 'DVT' || LPAD(MaDonViTinhCuoi::TEXT, 5, '0') AS formatted_ma_don_vi_tinh`;
    const result = await query(queryString);
    return result.rows[0].formatted_ma_don_vi_tinh;
  }

  // Get the latest MaLoaiDaiLy (e.g., 'LDL00001')
  async getLatestMaLoaiDaiLy() {
    const queryString = `
      UPDATE inventory.ID_TRACKER
      SET MaLoaiDaiLyCuoi = MaLoaiDaiLyCuoi + 1
      RETURNING 'LDL' || LPAD(MaLoaiDaiLyCuoi::TEXT, 5, '0') AS formatted_ma_loai_daily`;
    const result = await query(queryString);
    return result.rows[0].formatted_ma_loai_daily;
  }

  // Get the latest MaQuan (e.g., 'QUA00001')
  async getLatestMaQuan() {
    const queryString = `
      UPDATE inventory.ID_TRACKER
      SET MaQuanCuoi = MaQuanCuoi + 1
      RETURNING 'QUA' || LPAD(MaQuanCuoi::TEXT, 5, '0') AS formatted_ma_quan`;
    const result = await query(queryString);
    return result.rows[0].formatted_ma_quan;
  }

  // Get the latest MaMatHang (e.g., 'MHH00001')
  async getLatestMaMatHang() {
    const queryString = `
      UPDATE inventory.ID_TRACKER
      SET MaMatHangCuoi = MaMatHangCuoi + 1
      RETURNING 'MHH' || LPAD(MaMatHangCuoi::TEXT, 5, '0') AS formatted_ma_mat_hang`;
    const result = await query(queryString);
    return result.rows[0].formatted_ma_mat_hang;
  }

  // Get the latest MaPhieuThu (e.g., 'PT00001')
  async getLatestMaPhieuThu() {
    const queryString = `
      UPDATE inventory.ID_TRACKER
      SET MaPhieuThuCuoi = MaPhieuThuCuoi + 1
      RETURNING 'PT' || LPAD(MaPhieuThuCuoi::TEXT, 5, '0') AS formatted_ma_phieu_thu`;
    const result = await query(queryString);
    return result.rows[0].formatted_ma_phieu_thu;
  }

  // Get the latest MaPhieuXuat (e.g., 'PX00001')
  async getLatestMaPhieuXuat() {
    const queryString = `
      UPDATE inventory.ID_TRACKER
      SET MaPhieuXuatCuoi = MaPhieuXuatCuoi + 1
      RETURNING 'PX' || LPAD(MaPhieuXuatCuoi::TEXT, 5, '0') AS formatted_ma_phieu_xuat`;
    const result = await query(queryString);
    return result.rows[0].formatted_ma_phieu_xuat;
  }
}

export default IdTrackerService;