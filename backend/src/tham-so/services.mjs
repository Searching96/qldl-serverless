// src/tham-so/service.js

import { query } from './database.mjs';

class ThamSoService {
  async createThamSo(mathamso, soluongdailytoida, quydinhtienthutienno) {
    console.log('Inside createThamSo service with data:', { mathamso, soluongdailytoida, quydinhtienthutienno });
    const requiredFields = ['mathamso', 'soluongdailytoida', 'quydinhtienthutienno'];
    const data = { mathamso, soluongdailytoida, quydinhtienthutienno };
    const missingFields = this.validateRequiredFields(data, requiredFields);

    if (missingFields.length > 0) {
      throw new Error(`Thiếu các trường bắt buộc: ${missingFields.join(', ')}`);
    }
    const queryString = 'INSERT INTO inventory.ThamSo (MaThamSo, SoLuongDaiLyToiDa, QuyDinhTienThuTienNo) VALUES ($1, $2, $3)';
    console.log('Executing query:', queryString, [mathamso, soluongdailytoida, quydinhtienthutienno]);
    await query(queryString, [mathamso, soluongdailytoida, quydinhtienthutienno]);
    console.log('Query executed successfully, maThamSo:', mathamso);
    return { mathamso };
  }

  async getLastThamSo() {
    const queryString = 'SELECT MaThamSo as mathamso, SoLuongDaiLyToiDa as soluongdailytoida, QuyDinhTienThuTienNo as quydinhtienthutienno FROM inventory.ThamSo WHERE DeletedAt IS NULL ORDER BY CreatedAt DESC LIMIT 1';
    const result = await query(queryString);
    return result.rows[0];
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
