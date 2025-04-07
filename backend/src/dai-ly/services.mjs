// src/dai-ly/service.js

import { query } from './database.mjs';
import { v4 as uuidv4 } from 'uuid';

class DaiLyService {
  async getAllDaiLy() {
    const queryString = `
      SELECT 
        d.IDDaiLy as iddaily,
        d.MaDaiLy as madaily,
        d.TenDaiLy as tendaily,
        d.DiaChi as diachi,
        d.SoDienThoai as sodienthoai,
        d.Email as email,
        q.MaQuan as maquan,
        l.MaLoaiDaiLy as maloaidaily,
        d.NgayTiepNhan as ngaytiepnhan,
        d.CongNo as congno,
        d.DeletedAt as deletedat,
        q.TenQuan as tenquan,
        l.TenLoaiDaiLy as tenloaidaily
      FROM 
        inventory.DAILY d
      LEFT JOIN 
        inventory.QUAN q ON d.IDQuan = q.IDQuan
      LEFT JOIN 
        inventory.LOAIDAILY l ON d.IDLoaiDaiLy = l.IDLoaiDaiLy
      WHERE 
        d.DeletedAt IS NULL
      ORDER BY 
        d.MaDaiLy`;

    const result = await query(queryString);
    return result.rows;
  }

  async getDaiLy(madaily) {
    const queryString = `
      SELECT 
        d.IDDaiLy as iddaily,
        d.MaDaiLy as madaily,
        d.TenDaiLy as tendaily,
        d.DiaChi as diachi,
        d.SoDienThoai as sodienthoai,
        d.Email as email,
        q.MaQuan as maquan,
        l.MaLoaiDaiLy as maloaidaily,
        d.NgayTiepNhan as ngaytiepnhan,
        d.CongNo as congno,
        d.DeletedAt as deletedat,
        q.TenQuan as tenquan,
        l.TenLoaiDaiLy as tenloaidaily
      FROM 
        inventory.DAILY d
      LEFT JOIN 
        inventory.QUAN q ON d.IDQuan = q.IDQuan
      LEFT JOIN 
        inventory.LOAIDAILY l ON d.IDLoaiDaiLy = l.IDLoaiDaiLy
      WHERE 
        d.MaDaiLy = $1 AND d.DeletedAt IS NULL`;
    const result = await query(queryString, [madaily]);
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
    const data = { tendaily, sodienthoai, diachi, email, maloaidaily, maquan, ngaytiepnhan };
    const missingFields = this.validateRequiredFields(data, requiredFields);

    if (missingFields.length > 0) {
      throw new Error(`Thiếu các trường bắt buộc: ${missingFields.join(', ')}`);
    }

    // Get IDLoaiDaiLy from MaLoaiDaiLy
    const loaidailyCheckQuery = 'SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE MaLoaiDaiLy = $1 AND DeletedAt IS NULL';
    const loaidailyCheck = await query(loaidailyCheckQuery, [maloaidaily]);
    if (loaidailyCheck.rowCount === 0) {
      throw new Error(`Mã loại đại lý ${maloaidaily} không tồn tại hoặc đã bị xóa`);
    }
    const idLoaiDaiLy = loaidailyCheck.rows[0].idloaidaily;

    // Get IDQuan from MaQuan
    const quanCheckQuery = 'SELECT IDQuan FROM inventory.QUAN WHERE MaQuan = $1 AND DeletedAt IS NULL';
    const quanCheck = await query(quanCheckQuery, [maquan]);
    if (quanCheck.rowCount === 0) {
      throw new Error(`Mã quận ${maquan} không tồn tại hoặc đã bị xóa`);
    }
    const idQuan = quanCheck.rows[0].idquan;
    // Check if the total number of DaiLy in the specified Quan exceeds the limit
    const quanLimitQuery = `
      SELECT COUNT(*) AS total_daily, t.SoLuongDaiLyToiDa
      FROM inventory.DAILY d
      JOIN inventory.THAMSO t ON TRUE
      WHERE d.IDQuan = $1 AND d.DeletedAt IS NULL
      GROUP BY t.SoLuongDaiLyToiDa`;
    const quanLimitResult = await query(quanLimitQuery, [idQuan]);

    if (quanLimitResult.rowCount > 0) {
      const { total_daily, soluongdailytoida } = quanLimitResult.rows[0];
      if (total_daily >= soluongdailytoida) {
      throw new Error(`Số lượng đại lý trong quận đã đạt giới hạn tối đa (${soluongdailytoida}).`);
      }
    }

    // Use provided MaDaiLy or generate new one
    if (!madaily) {
      const idTrackerQuery = `
        UPDATE inventory.ID_TRACKER
        SET MaDaiLyCuoi = MaDaiLyCuoi + 1
        RETURNING 'DL' || LPAD(MaDaiLyCuoi::TEXT, 5, '0') AS formatted_ma_daily`;
      const idTrackerResult = await query(idTrackerQuery);
      madaily = idTrackerResult.rows[0].formatted_ma_daily;
    }

    // Insert the new DaiLy record with UUID and user-facing ID
    const insertQuery = `
      INSERT INTO inventory.DAILY 
      (MaDaiLy, TenDaiLy, SoDienThoai, DiaChi, Email, IDLoaiDaiLy, IDQuan, NgayTiepNhan) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING IDDaiLy as iddaily, MaDaiLy as madaily`;
    console.log('Executing query:', insertQuery, [madaily, tendaily, sodienthoai, diachi, email, idLoaiDaiLy, idQuan, ngaytiepnhan]);
    
    const result = await query(insertQuery, [madaily, tendaily, sodienthoai, diachi, email, idLoaiDaiLy, idQuan, ngaytiepnhan]);
    console.log('Query executed successfully, result:', result.rows[0]);
    
    return result.rows[0].madaily;
  }

  async updateDaiLy(madaily, { tendaily, sodienthoai, diachi, email, maloaidaily, maquan, ngaytiepnhan }) {
    console.log('Inside updateDaiLy service with madaily:', madaily, 'and data:', { tendaily, sodienthoai, diachi, email, maloaidaily, maquan, ngaytiepnhan });

    // Get IDDaiLy from MaDaiLy
    const dailyCheckQuery = 'SELECT IDDaiLy FROM inventory.DAILY WHERE MaDaiLy = $1 AND DeletedAt IS NULL';
    const dailyCheck = await query(dailyCheckQuery, [madaily]);
    if (dailyCheck.rowCount === 0) {
      throw new Error(`Không tìm thấy đại lý với mã ${madaily}`);
    }
    const idDaiLy = dailyCheck.rows[0].iddaily;

    let idLoaiDaiLy = null;
    if (maloaidaily) {
      // Get IDLoaiDaiLy from MaLoaiDaiLy
      const loaidailyCheckQuery = 'SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE MaLoaiDaiLy = $1 AND DeletedAt IS NULL';
      const loaidailyCheck = await query(loaidailyCheckQuery, [maloaidaily]);
      if (loaidailyCheck.rowCount === 0) {
        throw new Error(`Mã loại đại lý ${maloaidaily} không tồn tại hoặc đã bị xóa`);
      }
      idLoaiDaiLy = loaidailyCheck.rows[0].idloaidaily;
    }

    let idQuan = null;
    if (maquan) {
      // Get IDQuan from MaQuan
      const quanCheckQuery = 'SELECT IDQuan FROM inventory.QUAN WHERE MaQuan = $1 AND DeletedAt IS NULL';
      const quanCheck = await query(quanCheckQuery, [maquan]);
      if (quanCheck.rowCount === 0) {
        throw new Error(`Mã quận ${maquan} không tồn tại hoặc đã bị xóa`);
      }
      idQuan = quanCheck.rows[0].idquan;
    }

    const updates = [];
    const values = [];
    let paramIndex = 1;
    
    if (tendaily) { updates.push(`TenDaiLy = $${paramIndex++}`); values.push(tendaily); }
    if (sodienthoai) { updates.push(`SoDienThoai = $${paramIndex++}`); values.push(sodienthoai); }
    if (diachi) { updates.push(`DiaChi = $${paramIndex++}`); values.push(diachi); }
    if (email) { updates.push(`Email = $${paramIndex++}`); values.push(email); }
    if (idLoaiDaiLy) { updates.push(`IDLoaiDaiLy = $${paramIndex++}`); values.push(idLoaiDaiLy); }
    if (idQuan) { updates.push(`IDQuan = $${paramIndex++}`); values.push(idQuan); }
    if (ngaytiepnhan) { updates.push(`NgayTiepNhan = $${paramIndex++}`); values.push(ngaytiepnhan); }
    
    if (updates.length === 0) {
      throw new Error('Không có trường nào để cập nhật.');
    }

    values.push(idDaiLy); // Use IDDaiLy for the WHERE clause
    
    const queryString = `
      UPDATE inventory.DAILY 
      SET ${updates.join(', ')} 
      WHERE IDDaiLy = $${paramIndex} AND DeletedAt IS NULL
      RETURNING MaDaiLy as madaily`;
      
    console.log('Executing query:', queryString, values);
    const result = await query(queryString, values);
    
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy đại lý.');
    }
    
    console.log('Update successful for madaily:', madaily);
    return result.rows[0];
  }

  async deleteDaiLy(madaily) {
    console.log('Inside deleteDaiLy service with madaily:', madaily);
    
    // Get IDDaiLy from MaDaiLy
    const dailyCheckQuery = 'SELECT IDDaiLy, CongNo FROM inventory.DAILY WHERE MaDaiLy = $1 AND DeletedAt IS NULL';
    const dailyCheck = await query(dailyCheckQuery, [madaily]);
    if (dailyCheck.rowCount === 0) {
      throw new Error(`Không tìm thấy đại lý với mã ${madaily}`);
    }
    
    const idDaiLy = dailyCheck.rows[0].iddaily;
    const congNo = dailyCheck.rows[0].congno;
    
    if (congNo !== 0) {
      throw new Error(`Đại lý ${madaily} chưa thanh toán công nợ.`);
    }
    
    const queryString = 'UPDATE inventory.DAILY SET DeletedAt = NOW() WHERE IDDaiLy = $1 AND DeletedAt IS NULL';
    console.log('Executing query:', queryString, [idDaiLy]);
    
    const result = await query(queryString, [idDaiLy]);
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy đại lý.');
    }
    
    console.log('Delete successful for madaily:', madaily);
    return { madaily };
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
        d.CongNo as congno,
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