// src/tham-so/service.js

import { query } from '../shared/database.mjs';
import { validateRequiredFields, isNonNegativeInteger, isPositiveInteger } from '../shared/validation.mjs';
import { ValidationError, NotFoundError } from '../shared/errorHandler.mjs';
import { ERROR_MESSAGES } from '../shared/constants.mjs';

class ThamSoService {
  async createThamSo(mathamso, soluongdailytoida, quydinhtienthutienno) {
    const requiredFields = ['mathamso', 'soluongdailytoida', 'quydinhtienthutienno'];
    const data = { mathamso, soluongdailytoida, quydinhtienthutienno };
    const missingFields = this.validateRequiredFields(data, requiredFields);

    if (missingFields.length > 0) {
      throw new Error(`Thiếu các trường bắt buộc: ${missingFields.join(', ')}`);
    }
    const queryString = 'INSERT INTO inventory.ThamSo (MaThamSo, SoLuongDaiLyToiDa, QuyDinhTienThuTienNo) VALUES ($1, $2, $3)';
    await query(queryString, [mathamso, soluongdailytoida, quydinhtienthutienno]);
    return { mathamso };
  }

  async getLastThamSo() {
    const queryString = 'SELECT MaThamSo as mathamso, SoLuongDaiLyToiDa as soluongdailytoida, QuyDinhTienThuTienNo as quydinhtienthutienno FROM inventory.ThamSo WHERE DeletedAt IS NULL ORDER BY CreatedAt DESC LIMIT 1';
    const result = await query(queryString);
    return result.rows[0];
  }

  async updateThamSo(soluongdailytoida, quydinhtienthutienno) {
    // Update the latest record (since there's only one active record)
    const queryString = 'UPDATE inventory.ThamSo SET SoLuongDaiLyToiDa = $1, QuyDinhTienThuTienNo = $2 WHERE DeletedAt IS NULL';
    const result = await query(queryString, [soluongdailytoida, quydinhtienthutienno]);
    
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy tham số để cập nhật.');
    }
    
    return { success: true };
  }

  async deleteThamSo(maThamSo) {
    const queryString = 'UPDATE inventory.ThamSo SET DeletedAt = NOW() WHERE MaThamSo = $1 AND DeletedAt IS NULL';
    const result = await query(queryString, [maThamSo]);
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy tham số.');
    }
  }
}

export default ThamSoService;