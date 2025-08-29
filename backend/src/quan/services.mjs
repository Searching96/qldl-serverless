// src/quan/service.js

import { query } from '../shared/database.mjs';
import { v4 as uuidv4 } from 'uuid';
import { validateRequiredFields, isNonNegativeInteger, isPositiveInteger } from '../shared/validation.mjs';
import { ValidationError, NotFoundError } from '../shared/errorHandler.mjs';
import { ERROR_MESSAGES } from '../shared/constants.mjs';


class QuanService {
  async createQuan(tenQuan) {
    if (!tenQuan) {
      throw new Error('Cần nhập tên quận.');
    }
    const maQuan = uuidv4();
    const queryString = 'INSERT INTO inventory.Quan (MaQuan, TenQuan) VALUES ($1, $2)';
    await query(queryString, [maQuan, tenQuan]);
    return { maquan: maQuan };
  }

  async getAllQuan() {
    const queryString = 'SELECT MaQuan as maquan, TenQuan as tenquan FROM inventory.Quan WHERE DeletedAt IS NULL';
    const result = await query(queryString);
    return result.rows;
  }

  async getQuanById(maQuan) {
    const queryString = 'SELECT MaQuan as maquan, TenQuan as tenquan FROM inventory.Quan WHERE MaQuan = $1 AND DeletedAt IS NULL';
    const result = await query(queryString, [maQuan]);
    return result.rows[0];
  }

  async updateQuan(maQuan, tenQuan) {
    if (!tenQuan) {
      throw new Error('Cần nhập tên quận.');
    }
    const queryString = 'UPDATE inventory.Quan SET TenQuan = $1 WHERE MaQuan = $2 AND DeletedAt IS NULL';
    const result = await query(queryString, [tenQuan, maQuan]);
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy quận.');
    }
  }

  async deleteQuan(maQuan) {
    const queryString = 'UPDATE inventory.Quan SET DeletedAt = NOW() WHERE MaQuan = $1 AND DeletedAt IS NULL';
    const result = await query(queryString, [maQuan]);
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy quận.');
    }
  }
}

export default QuanService;