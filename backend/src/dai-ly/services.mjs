// src/dai-ly/service.js

import { query } from './database.mjs';
import { v4 as uuidv4 } from 'uuid';

class DaiLyService {
  async getAllDaiLy() {
    const queryString = `
      SELECT 
        d.MaDaiLy as madaily,
        d.TenDaiLy as tendaily,
        d.DiaChi as diachi,
        d.SoDienThoai as sodienthoai,
        d.Email as email,
        d.MaQuan as maquan,
        d.MaLoaiDaiLy as maloaidaily,
        d.NgayTiepNhan as ngaytiepnhan,
        d.TienNo as tienno,
        d.DeletedAt as deletedat,
        q.TenQuan as tenquan,
        l.TenLoaiDaiLy as tenloaidaily
      FROM 
        inventory.DAILY d
      LEFT JOIN 
        inventory.QUAN q ON d.MaQuan = q.MaQuan
      LEFT JOIN 
        inventory.LOAIDAILY l ON d.MaLoaiDaiLy = l.MaLoaiDaiLy
      WHERE 
        d.DeletedAt IS NULL`;
    const result = await query(queryString);
    return result.rows;
  }

  async getDaiLy(maDaiLy) {
    const queryString = `
      SELECT 
        d.MaDaiLy as madaily,
        d.TenDaiLy as tendaily,
        d.DiaChi as diachi,
        d.SoDienThoai as sodienthoai,
        d.Email as email,
        d.MaQuan as maquan,
        d.MaLoaiDaiLy as maloaidaily,
        d.NgayTiepNhan as ngaytiepnhan,
        d.TienNo as tienno,
        d.DeletedAt as deletedat,
        q.TenQuan as tenquan,
        l.TenLoaiDaiLy as tenloaidaily
      FROM 
        inventory.DAILY d
      LEFT JOIN 
        inventory.QUAN q ON d.MaQuan = q.MaQuan
      LEFT JOIN 
        inventory.LOAIDAILY l ON d.MaLoaiDaiLy = l.MaLoaiDaiLy
      WHERE 
        d.MaDaiLy = $1 AND d.DeletedAt IS NULL`;
    const result = await query(queryString, [maDaiLy]);
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy đại lý.');
    }
    return result.rows[0];
  }

  validateRequiredFields(data, requiredFields) {
    const missingFields = [];
    for (const field of requiredFields) {
      if (!data[field]) {
        missingFields.push(field);
      }
    }
    return missingFields;
  }

  async createDaiLy({ madaily, tendaily, sodienthoai, diachi, email, maloaidaily, maquan, ngaytiepnhan }) {
    console.log('Inside createDaiLy service with data:', { madaily, tendaily, sodienthoai, diachi, email, maloaidaily, maquan, ngaytiepnhan });

    const requiredFields = ['tendaily', 'sodienthoai', 'diachi', 'email', 'maloaidaily', 'maquan', 'ngaytiepnhan'];
    const data = { madaily, tendaily, sodienthoai, diachi, email, maloaidaily, maquan, ngaytiepnhan };
    const missingFields = this.validateRequiredFields(data, requiredFields);

    if (missingFields.length > 0) {
      throw new Error(`Thiếu các trường bắt buộc: ${missingFields.join(', ')}`);
    }

    const loaidailyCheckQuery = 'SELECT 1 FROM inventory.LOAIDAILY WHERE MaLoaiDaiLy = $1 AND DeletedAt IS NULL';
    const loaidailyCheck = await query(loaidailyCheckQuery, [maloaidaily]);
    if (loaidailyCheck.rowCount === 0) {
      throw new Error(`Mã loại đại lý ${maloaidaily} không tồn tại hoặc đã bị xóa`);
    }

    const quanCheckQuery = 'SELECT 1 FROM inventory.QUAN WHERE MaQuan = $1 AND DeletedAt IS NULL';
    const quanCheck = await query(quanCheckQuery, [maquan]);
    if (quanCheck.rowCount === 0) {
      throw new Error(`Mã quận ${maquan} không tồn tại hoặc đã bị xóa`);
    }

    const dailyLimitCheckQuery = `SELECT COUNT(*) from inventory.DAILY WHERE MaQuan = $1 AND DeletedAt IS NULL`;
    const dailyLimitCheck = await query(dailyLimitCheckQuery, [maquan]);
    const dailyLimit = await query('SELECT TOP 1 SoLuongDaiLy FROM inventory.THAMSO AND DeletedAt IS NULL');
    if (dailyLimitCheck.rowCount >= dailyLimit.rows[0].SoLuongDaiLy) {
      const tenquanQuery = 'SELECT TenQuan FROM inventory.QUAN WHERE MaQuan = $1 AND DeletedAt IS NULL';
      const tenquanResult = await query(tenquanQuery, [maquan]);
      throw new Error(`Số lượng đại lý trong quận ${tenquanResult.rows[0].TenQuan} đã đạt giới hạn tối đa.`);
    }

    const maDaiLy = madaily ??= uuidv4();
    const queryString = 'INSERT INTO inventory.DAILY (MaDaiLy, TenDaiLy, SoDienThoai, DiaChi, Email, MaLoaiDaiLy, MaQuan, NgayTiepNhan, DeletedAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NULL)';
    console.log('Executing query:', queryString, [maDaiLy, tendaily, sodienthoai, diachi, email, maloaidaily, maquan, ngaytiepnhan]);
    await query(queryString, [maDaiLy, tendaily, sodienthoai, diachi, email, maloaidaily, maquan, ngaytiepnhan]);
    console.log('Query executed successfully, maDaiLy:', maDaiLy);
    return { madaily: maDaiLy };
  }

  async updateDaiLy(maDaiLy, { tendaily, sodienthoai, diachi, email, maloaidaily, maquan, ngaytiepnhan }) {
    console.log('Inside updateDaiLy service with maDaiLy:', maDaiLy, 'and data:', { tendaily, sodienthoai, diachi, email, maloaidaily, maquan, ngaytiepnhan });

    if (maloaidaily) {
      const loaidailyCheckQuery = 'SELECT 1 FROM inventory.LOAIDAILY WHERE MaLoaiDaiLy = $1 AND DeletedAt IS NULL';
      const loaidailyCheck = await query(loaidailyCheckQuery, [maloaidaily]);
      if (loaidailyCheck.rowCount === 0) {
        throw new Error(`Mã loại đại lý ${maloaidaily} không tồn tại hoặc đã bị xóa`);
      }
    }
    if (maquan) {
      const quanCheckQuery = 'SELECT 1 FROM inventory.QUAN WHERE MaQuan = $1 AND DeletedAt IS NULL';
      const quanCheck = await query(quanCheckQuery, [maquan]);
      if (quanCheck.rowCount === 0) {
        throw new Error(`Mã quận ${maquan} không tồn tại hoặc đã bị xóa`);
      }
    }

    const updates = [];
    const values = [];
    let paramIndex = 1;
    if (tendaily) { updates.push(`TenDaiLy = $${paramIndex++}`); values.push(tendaily); }
    if (sodienthoai) { updates.push(`SoDienThoai = $${paramIndex++}`); values.push(sodienthoai); }
    if (diachi) { updates.push(`DiaChi = $${paramIndex++}`); values.push(diachi); }
    if (email) { updates.push(`Email = $${paramIndex++}`); values.push(email); }
    if (maloaidaily) { updates.push(`MaLoaiDaiLy = $${paramIndex++}`); values.push(maloaidaily); }
    if (maquan) { updates.push(`MaQuan = $${paramIndex++}`); values.push(maquan); }
    if (ngaytiepnhan) { updates.push(`NgayTiepNhan = $${paramIndex++}`); values.push(ngaytiepnhan); }
    if (updates.length === 0) {
      throw new Error('Không có trường nào để cập nhật.');
    }

    values.push(maDaiLy);
    const queryString = `UPDATE inventory.DAILY SET ${updates.join(', ')} WHERE MaDaiLy = $${paramIndex} AND DeletedAt IS NULL`;
    console.log('Executing query:', queryString, values);
    const result = await query(queryString, values);
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy đại lý.');
    }
    console.log('Update successful for maDaiLy:', maDaiLy);
  }

  async deleteDaiLy(maDaiLy) {
    console.log('Inside deleteDaiLy service with maDaiLy:', maDaiLy);
    const queryString = 'UPDATE inventory.DAILY SET DeletedAt = NOW() WHERE MaDaiLy = $1 AND DeletedAt IS NULL';
    console.log('Executing query:', queryString, [maDaiLy]);
    const result = await query(queryString, [maDaiLy]);
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy đại lý.');
    }
    console.log('Delete successful for maDaiLy:', maDaiLy);
  }

  async searchDaiLy({ madaily, tendaily, sodienthoai, email, diachi }) {
    console.log('Inside searchDaiLy service with criteria:', { tendaily, sodienthoai, email, diachi });

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (tendaily) {
      conditions.push(`LOWER(d.TenDaiLy) LIKE LOWER($${paramIndex++})`);
      values.push(`%${tendaily}%`);
    }

    if (sodienthoai) {
      conditions.push(`d.SoDienThoai LIKE $${paramIndex++}`);
      values.push(`%${sodienthoai}%`);
    }

    if (email) {
      conditions.push(`LOWER(d.Email) LIKE LOWER($${paramIndex++})`);
      values.push(`%${email}%`);
    }

    if (diachi) {
      conditions.push(`LOWER(d.DiaChi) LIKE LOWER($${paramIndex++})`);
      values.push(`%${diachi}%`);
    }

    let whereClause = 'd.DeletedAt IS NULL';
    if (conditions.length > 0) {
      whereClause += ` AND ${conditions.join(' AND ')}`;
    }

    const queryString = `
      SELECT 
        d.MaDaiLy as madaily,
        d.TenDaiLy as tendaily,
        d.DiaChi as diachi,
        d.SoDienThoai as sodienthoai,
        d.Email as email,
        d.MaQuan as maquan,
        d.MaLoaiDaiLy as maloaidaily,
        d.NgayTiepNhan as ngaytiepnhan,
        d.TienNo as tienno,
        d.DeletedAt as deletedat,
        q.TenQuan as tenquan,
        l.TenLoaiDaiLy as tenloaidaily
      FROM 
        inventory.DAILY d
      LEFT JOIN 
        inventory.QUAN q ON d.MaQuan = q.MaQuan
      LEFT JOIN 
        inventory.LOAIDAILY l ON d.MaLoaiDaiLy = l.MaLoaiDaiLy
      WHERE 
        ${whereClause}
      ORDER BY 
        d.TenDaiLy`;

    console.log('Executing search query with values:', values);
    const result = await query(queryString, values);
    return result.rows[0];
  }
}

export default DaiLyService;