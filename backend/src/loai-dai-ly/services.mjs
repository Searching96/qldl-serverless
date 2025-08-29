// src/loai-dai-ly/service.js

import { query } from '../shared/database.mjs';
import { v4 as uuidv4 } from 'uuid';
import { validateRequiredFields, isNonNegativeInteger, isPositiveInteger } from '../shared/validation.mjs';
import { ValidationError, NotFoundError } from '../shared/errorHandler.mjs';
import { ERROR_MESSAGES } from '../shared/constants.mjs';

class LoaiDaiLyService {
  async createLoaiDaiLy(maLoaiDaiLy, tenLoaiDaiLy, noToiDa = 10000000) {
    if (!tenLoaiDaiLy) {
      throw new Error('Cần nhập tên loại đại lý.');
    }
    
    // Use the generated MaLoaiDaiLy and store with UUID internally
    const queryString = 'INSERT INTO inventory.LoaiDaiLy (MaLoaiDaiLy, TenLoaiDaiLy, NoToiDa) VALUES ($1, $2, $3) RETURNING IDLoaiDaiLy as idloaidaily, MaLoaiDaiLy as maloaidaily';
    const result = await query(queryString, [maLoaiDaiLy, tenLoaiDaiLy, noToiDa]);
    // Return the user-facing ID (MaLoaiDaiLy)
    return { maloaidaily: result.rows[0].maloaidaily };
  }

  async getAllLoaiDaiLy() {
    // Only return user-facing fields (Ma* instead of ID*)
    const queryString = 'SELECT MaLoaiDaiLy as maloaidaily, TenLoaiDaiLy as tenloaidaily, NoToiDa as notoida FROM inventory.LoaiDaiLy WHERE DeletedAt IS NULL';
    const result = await query(queryString);
    return result.rows;
  }

  async getLoaiDaiLy(maLoaiDaiLy) {
    const queryString = 'SELECT IDLoaiDaiLy as idloaidaily, MaLoaiDaiLy as maloaidaily, TenLoaiDaiLy as tenloaidaily, NoToiDa as notoida FROM inventory.LoaiDaiLy WHERE MaLoaiDaiLy = $1 AND DeletedAt IS NULL';
    const result = await query(queryString, [maLoaiDaiLy]);
    return result.rows[0];
  }

  async updateLoaiDaiLy(maLoaiDaiLy, tenLoaiDaiLy, noToiDa) {
    if (!tenLoaiDaiLy) {
      throw new Error('Cần nhập tên loại đại lý.');
    }
    
    // Get IDLoaiDaiLy from MaLoaiDaiLy
    const loaiDaiLyCheckQuery = 'SELECT IDLoaiDaiLy FROM inventory.LoaiDaiLy WHERE MaLoaiDaiLy = $1 AND DeletedAt IS NULL';
    const loaiDaiLyCheck = await query(loaiDaiLyCheckQuery, [maLoaiDaiLy]);
    if (loaiDaiLyCheck.rowCount === 0) {
      throw new Error(`Không tìm thấy loại đại lý với mã ${maLoaiDaiLy}`);
    }
    const idLoaiDaiLy = loaiDaiLyCheck.rows[0].idloaidaily;
    
    const updateValues = [tenLoaiDaiLy, idLoaiDaiLy];
    let queryString = 'UPDATE inventory.LoaiDaiLy SET TenLoaiDaiLy = $1';
    
    if (noToiDa !== undefined) {
      queryString += ', NoToiDa = $3';
      updateValues.splice(1, 0, noToiDa);
    }
    
    queryString += ' WHERE IDLoaiDaiLy = $2 AND DeletedAt IS NULL';
    
    const result = await query(queryString, updateValues);
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy loại đại lý.');
    }
    
    return { maloaidaily: maLoaiDaiLy };
  }

  async deleteLoaiDaiLy(maLoaiDaiLy) {
    // Check if there are any active Daily records using this LoaiDaiLy
    const dailyCheckQuery = `
      SELECT COUNT(*) FROM inventory.DAILY d
      JOIN inventory.LOAIDAILY l ON d.IDLoaiDaiLy = l.IDLoaiDaiLy
      WHERE l.MaLoaiDaiLy = $1 AND d.DeletedAt IS NULL`;
    const dailyCheck = await query(dailyCheckQuery, [maLoaiDaiLy]);
    
    if (parseInt(dailyCheck.rows[0].count) > 0) {
      throw new Error(`Không thể xóa loại đại lý ${maLoaiDaiLy} vì đang được sử dụng bởi ${dailyCheck.rows[0].count} đại lý.`);
    }
    
    // Get IDLoaiDaiLy from MaLoaiDaiLy
    const loaiDaiLyCheckQuery = 'SELECT IDLoaiDaiLy FROM inventory.LoaiDaiLy WHERE MaLoaiDaiLy = $1 AND DeletedAt IS NULL';
    const loaiDaiLyCheck = await query(loaiDaiLyCheckQuery, [maLoaiDaiLy]);
    if (loaiDaiLyCheck.rowCount === 0) {
      throw new Error(`Không tìm thấy loại đại lý với mã ${maLoaiDaiLy}`);
    }
    const idLoaiDaiLy = loaiDaiLyCheck.rows[0].idloaidaily;
    
    const queryString = 'UPDATE inventory.LoaiDaiLy SET DeletedAt = NOW() WHERE IDLoaiDaiLy = $1 AND DeletedAt IS NULL';
    const result = await query(queryString, [idLoaiDaiLy]);
    
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy loại đại lý.');
    }
    
    return { maloaidaily: maLoaiDaiLy };
  }
}

export default LoaiDaiLyService;