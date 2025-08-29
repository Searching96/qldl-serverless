// src/mat-hang/service.js

import { query } from '../shared/database.mjs';
import { validateRequiredFields, isNonNegativeInteger } from '../shared/validation.mjs';
import { ERROR_MESSAGES } from '../shared/constants.mjs';
import { ValidationError, NotFoundError } from '../shared/errorHandler.mjs';
import { v4 as uuidv4 } from 'uuid';

class MatHangService {
  async getAllMatHang() {
    const queryString = `
      SELECT 
        mh.IDMatHang as idmathang,
        mh.MaMatHang as mamathang,
        mh.TenMatHang as tenmathang,
        mh.SoLuongTon as soluongton,
        mh.DeletedAt as deletedat,
        dvt.MaDonViTinh as madonvitinh,
        dvt.TenDonViTinh as tendonvitinh
      FROM 
        inventory.MATHANG mh
      LEFT JOIN 
        inventory.DONVITINH dvt ON mh.IDDonViTinh = dvt.IDDonViTinh
      WHERE 
        mh.DeletedAt IS NULL
      ORDER BY 
        mh.MaMatHang`;

    const result = await query(queryString);
    return result.rows;
  }

  async getMatHang(mamathang) {
    const queryString = `
      SELECT 
        mh.IDMatHang as idmathang,
        mh.MaMatHang as mamathang,
        mh.TenMatHang as tenmathang,
        mh.SoLuongTon as soluongton,
        mh.DeletedAt as deletedat,
        dvt.MaDonViTinh as madonvitinh,
        dvt.TenDonViTinh as tendonvitinh
      FROM 
        inventory.MATHANG mh
      LEFT JOIN 
        inventory.DONVITINH dvt ON mh.IDDonViTinh = dvt.IDDonViTinh
      WHERE 
        mh.MaMatHang = $1 AND mh.DeletedAt IS NULL`;
    const result = await query(queryString, [mamathang]);
    if (result.rowCount === 0) {
      throw new NotFoundError('Không tìm thấy mặt hàng.');
    }
    return result.rows[0];
  }

  async executeQuery(queryString) {
    try {
      const result = await query(queryString);
      
      if (result.rows.length === 0) {
        return 'No records found.';
      }
      
      // Get column names from the first row
      const columns = Object.keys(result.rows[0]);
      
      // Format each row as a string
      const formattedRows = result.rows.map(row => {
        const values = columns.map(col => `${col}: ${row[col] || 'NULL'}`);
        return values.join(', ');
      });
      
      return formattedRows.join('\n');
    } catch (error) {
      throw new Error(`Query execution failed: ${error.message}`);
    }
  }

  async executeInsert(insertString) {
    try {
      const result = await query(insertString);
      return {
        rowCount: result.rowCount,
        rows: result.rows,
        success: true
      };
    } catch (error) {
      throw new Error(`${ERROR_MESSAGES.INSERT_EXECUTION_FAILED}: ${error.message}`);
    }
  }
  
  validateRequiredFields(data, requiredFields) {
    return validateRequiredFields(data, requiredFields);
  }

  async createMatHang({ mamathang, tenmathang, madonvitinh, soluongton }) {
    const requiredFields = ['tenmathang', 'madonvitinh', 'soluongton'];
    const data = { tenmathang, madonvitinh, soluongton };
    const missingFields = this.validateRequiredFields(data, requiredFields);

    if (missingFields.length > 0) {
      throw new ValidationError(`${ERROR_MESSAGES.MISSING_REQUIRED_FIELDS}: ${missingFields.join(', ')}`);
    }

    // Validate soluongton is non-negative integer
    if (!isNonNegativeInteger(soluongton)) {
      throw new ValidationError('Số lượng tồn phải là số nguyên không âm.');
    }

    // Get IDDonViTinh from MaDonViTinh
    const donViTinhCheckQuery = 'SELECT IDDonViTinh FROM inventory.DONVITINH WHERE MaDonViTinh = $1 AND DeletedAt IS NULL';
    const donViTinhCheck = await query(donViTinhCheckQuery, [madonvitinh]);
    if (donViTinhCheck.rowCount === 0) {
      throw new Error(`Mã đơn vị tính ${madonvitinh} không tồn tại hoặc đã bị xóa`);
    }
    const idDonViTinh = donViTinhCheck.rows[0].iddonvitinh;

    // Use provided MaMatHang or generate new one
    if (!mamathang) {
      const idTrackerQuery = `
        UPDATE inventory.ID_TRACKER
        SET MaMatHangCuoi = MaMatHangCuoi + 1
        RETURNING 'MH' || LPAD(MaMatHangCuoi::TEXT, 6, '0') AS formatted_ma_mathang`;
      const idTrackerResult = await query(idTrackerQuery);
      mamathang = idTrackerResult.rows[0].formatted_ma_mathang;
    }

    const insertQuery = `
      INSERT INTO inventory.MATHANG 
        (MaMatHang, TenMatHang, IDDonViTinh, SoLuongTon)
      VALUES 
        ($1, $2, $3, $4)
      RETURNING MaMatHang as mamathang`;

    const result = await query(insertQuery, [mamathang, tenmathang, idDonViTinh, soluongton]);

    return result.rows[0].mamathang;
  }

  async updateMatHang(mamathang, { tenmathang, madonvitinh, soluongton }) {
    // Get IDMatHang from MaMatHang
    const matHangCheckQuery = 'SELECT IDMatHang FROM inventory.MATHANG WHERE MaMatHang = $1 AND DeletedAt IS NULL';
    const matHangCheck = await query(matHangCheckQuery, [mamathang]);
    if (matHangCheck.rowCount === 0) {
      throw new Error(`Không tìm thấy mặt hàng với mã ${mamathang}`);
    }
    const idMatHang = matHangCheck.rows[0].idmathang;

    let idDonViTinh = null;
    if (madonvitinh) {
      // Get IDDonViTinh from MaDonViTinh
      const donViTinhCheckQuery = 'SELECT IDDonViTinh FROM inventory.DONVITINH WHERE MaDonViTinh = $1 AND DeletedAt IS NULL';
      const donViTinhCheck = await query(donViTinhCheckQuery, [madonvitinh]);
      if (donViTinhCheck.rowCount === 0) {
        throw new Error(`Mã đơn vị tính ${madonvitinh} không tồn tại hoặc đã bị xóa`);
      }
      idDonViTinh = donViTinhCheck.rows[0].iddonvitinh;
    }

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (tenmathang) { updates.push(`TenMatHang = $${paramIndex++}`); values.push(tenmathang); }
    if (idDonViTinh) { updates.push(`IDDonViTinh = $${paramIndex++}`); values.push(idDonViTinh); }
    if (soluongton !== undefined) { 
      // Validate soluongton is non-negative integer
      if (!Number.isInteger(soluongton) || soluongton < 0) {
        throw new Error('Số lượng tồn phải là số nguyên không âm.');
      }
      updates.push(`SoLuongTon = $${paramIndex++}`); 
      values.push(soluongton); 
    }

    if (updates.length === 0) {
      throw new Error('Không có trường nào để cập nhật.');
    }

    values.push(idMatHang);

    const updateQuery = `
      UPDATE inventory.MATHANG 
      SET ${updates.join(', ')}
      WHERE IDMatHang = $${paramIndex} AND DeletedAt IS NULL
      RETURNING MaMatHang as mamathang`;

    const result = await query(updateQuery, values);

    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy mặt hàng hoặc không thể cập nhật.');
    }

    return { 
      mamathang: result.rows[0].mamathang 
    };
  }

  async deleteMatHang(mamathang) {
    // Get IDMatHang from MaMatHang
    const matHangCheckQuery = 'SELECT IDMatHang FROM inventory.MATHANG WHERE MaMatHang = $1 AND DeletedAt IS NULL';
    const matHangCheck = await query(matHangCheckQuery, [mamathang]);
    if (matHangCheck.rowCount === 0) {
      throw new Error(`Không tìm thấy mặt hàng với mã ${mamathang}`);
    }

    const idMatHang = matHangCheck.rows[0].idmathang;

    const queryString = 'UPDATE inventory.MATHANG SET DeletedAt = NOW() WHERE IDMatHang = $1 AND DeletedAt IS NULL';
    const result = await query(queryString, [idMatHang]);
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy mặt hàng.');
    }

    return { mamathang };
  }

  async searchMatHang({ mamathang, tenmathang, madonvitinh }) {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (mamathang) {
      conditions.push(`mh.MaMatHang LIKE $${paramIndex++}`);
      values.push(`%${mamathang}%`);
    }

    if (tenmathang) {
      conditions.push(`LOWER(mh.TenMatHang) LIKE LOWER($${paramIndex++})`);
      values.push(`%${tenmathang}%`);
    }

    if (madonvitinh) {
      conditions.push(`dvt.MaDonViTinh LIKE $${paramIndex++}`);
      values.push(`%${madonvitinh}%`);
    }

    let whereClause = 'mh.DeletedAt IS NULL';
    if (conditions.length > 0) {
      whereClause += ` AND ${conditions.join(' AND ')}`;
    }

    const queryString = `
      SELECT 
        mh.MaMatHang as mamathang,
        mh.TenMatHang as tenmathang,
        mh.SoLuongTon as soluongton,
        dvt.MaDonViTinh as madonvitinh,
        dvt.TenDonViTinh as tendonvitinh
      FROM 
        inventory.MATHANG mh
      LEFT JOIN 
        inventory.DONVITINH dvt ON mh.IDDonViTinh = dvt.IDDonViTinh
      WHERE 
        ${whereClause}
      ORDER BY 
        mh.TenMatHang`;

    const result = await query(queryString, values);
    return result.rows;
  }
}

export default MatHangService;