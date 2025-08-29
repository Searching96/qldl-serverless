// src/phieu-thu/service.js

import { query } from '../shared/database.mjs';
import { v4 as uuidv4 } from 'uuid';
import { validateRequiredFields, isNonNegativeInteger, isPositiveInteger } from '../shared/validation.mjs';
import { ValidationError, NotFoundError } from '../shared/errorHandler.mjs';
import { ERROR_MESSAGES } from '../shared/constants.mjs';

class PhieuThuService {
  async createPhieuThu({ madaily, ngaythutien, sotienthu }) {
    const requiredFields = ['madaily', 'ngaythutien', 'sotienthu'];
    const data = { madaily, ngaythutien, sotienthu };
    const missingFields = this.validateRequiredFields(data, requiredFields);

    if (missingFields.length > 0) {
      throw new Error(`Thiếu các trường bắt buộc: ${missingFields.join(', ')}`);
    }

    // Get IDDaiLy and CongNo from MaDaiLy
    const dailyCheckQuery = 'SELECT IDDaiLy, CongNo FROM inventory.DAILY WHERE MaDaiLy = $1 AND DeletedAt IS NULL';
    const dailyCheck = await query(dailyCheckQuery, [madaily]);
    if (dailyCheck.rowCount === 0) {
      throw new Error(`Mã đại lý ${madaily} không tồn tại hoặc đã bị xóa`);
    }
    const idDaiLy = dailyCheck.rows[0].iddaily;
    const congNo = dailyCheck.rows[0].congno;

    // Check QuyDinhTienThuTienNo rule
    const thamSoQuery = 'SELECT QuyDinhTienThuTienNo FROM inventory.THAMSO WHERE DeletedAt IS NULL LIMIT 1';
    const thamSoResult = await query(thamSoQuery);
    if (thamSoResult.rowCount > 0) {
      const quyDinhTienThuTienNo = thamSoResult.rows[0].quydinhtienthutienno;

      if (quyDinhTienThuTienNo === 1) {
        if (sotienthu > congNo) {
          throw new Error(`Số tiền thu (${sotienthu}) không được lớn hơn công nợ hiện tại (${congNo}).`);
        }
      }
    }

    // Generate new MaPhieuThu using ID_TRACKER
    // Get the latest MaPhieuThu (e.g., 'PT00001')

    const queryString = `
      UPDATE inventory.ID_TRACKER
      SET MaPhieuThuCuoi = MaPhieuThuCuoi + 1
      RETURNING 'PT' || LPAD(MaPhieuThuCuoi::TEXT, 5, '0') AS formatted_ma_phieu_thu`;
    const queryResult = await query(queryString);
    const maphieuthu = queryResult.rows[0].formatted_ma_phieu_thu;

    const insertQuery = `
      INSERT INTO inventory.PHIEUTHU 
        (MaPhieuThu, IDDaiLy, NgayThuTien, SoTienThu)
      VALUES 
        ($1, $2, $3, $4)
      RETURNING MaPhieuThu as maphieuthu`;

    const result = await query(insertQuery, [maphieuthu, idDaiLy, ngaythutien, sotienthu]);

    // Update DaiLy CongNo (subtract the payment amount)
    const updateCongNoQuery = `
      UPDATE inventory.DAILY 
      SET CongNo = CongNo - $1 
      WHERE IDDaiLy = $2 AND DeletedAt IS NULL`;
    await query(updateCongNoQuery, [sotienthu, idDaiLy]);

    return result.rows[0].maphieuthu;
  }

  async getAllPhieuThu() {
    const queryString = `
      SELECT 
        pt.IDPhieuThu as idphieuthu,
        pt.MaPhieuThu as maphieuthu,
        pt.NgayThuTien as ngaythutien,
        pt.SoTienThu as sotienthu,
        pt.DeletedAt as deletedat,
        d.MaDaiLy as madaily,
        d.TenDaiLy as tendaily
      FROM 
        inventory.PHIEUTHU pt
      LEFT JOIN 
        inventory.DAILY d ON pt.IDDaiLy = d.IDDaiLy
      WHERE 
        pt.DeletedAt IS NULL
      ORDER BY 
        pt.NgayThuTien DESC, pt.MaPhieuThu`;

    const result = await query(queryString);
    return result.rows;
  }

  async getPhieuThu(maphieuthu) {
    const queryString = `
      SELECT 
        pt.IDPhieuThu as idphieuthu,
        pt.MaPhieuThu as maphieuthu,
        pt.NgayThuTien as ngaythutien,
        pt.SoTienThu as sotienthu,
        pt.DeletedAt as deletedat,
        d.MaDaiLy as madaily,
        d.TenDaiLy as tendaily
      FROM 
        inventory.PHIEUTHU pt
      LEFT JOIN 
        inventory.DAILY d ON pt.IDDaiLy = d.IDDaiLy
      WHERE 
        pt.MaPhieuThu = $1 AND pt.DeletedAt IS NULL`;
    const result = await query(queryString, [maphieuthu]);
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy phiếu thu.');
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

  async updatePhieuThu(maphieuthu, { madaily, ngaythutien, sotienthu }) {
    // Get current PhieuThu info
    const phieuThuCheckQuery = 'SELECT IDPhieuThu, IDDaiLy, SoTienThu FROM inventory.PHIEUTHU WHERE MaPhieuThu = $1 AND DeletedAt IS NULL';
    const phieuThuCheck = await query(phieuThuCheckQuery, [maphieuthu]);
    if (phieuThuCheck.rowCount === 0) {
      throw new Error(`Không tìm thấy phiếu thu với mã ${maphieuthu}`);
    }
    const idPhieuThu = phieuThuCheck.rows[0].idphieuthu;
    const currentIdDaiLy = phieuThuCheck.rows[0].iddaily;
    const currentSoTienThu = phieuThuCheck.rows[0].sotienthu;

    let idDaiLy = currentIdDaiLy;
    if (madaily) {
      // Get IDDaiLy from MaDaiLy
      const dailyCheckQuery = 'SELECT IDDaiLy FROM inventory.DAILY WHERE MaDaiLy = $1 AND DeletedAt IS NULL';
      const dailyCheck = await query(dailyCheckQuery, [madaily]);
      if (dailyCheck.rowCount === 0) {
        throw new Error(`Mã đại lý ${madaily} không tồn tại hoặc đã bị xóa`);
      }
      idDaiLy = dailyCheck.rows[0].iddaily;
    }

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (madaily && idDaiLy !== currentIdDaiLy) {
      updates.push(`IDDaiLy = $${paramIndex++}`);
      values.push(idDaiLy);
    }
    if (ngaythutien) {
      updates.push(`NgayThuTien = $${paramIndex++}`);
      values.push(ngaythutien);
    }
    if (sotienthu !== undefined) {
      updates.push(`SoTienThu = $${paramIndex++}`);
      values.push(sotienthu);
    }

    if (updates.length === 0) {
      throw new Error('Không có trường nào để cập nhật.');
    }

    values.push(idPhieuThu);

    const updateQuery = `
      UPDATE inventory.PHIEUTHU 
      SET ${updates.join(', ')}
      WHERE IDPhieuThu = $${paramIndex} AND DeletedAt IS NULL
      RETURNING MaPhieuThu as maphieuthu`;

    const result = await query(updateQuery, values);

    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy phiếu thu hoặc không thể cập nhật.');
    }

    // Update CongNo if amount or daily changed
    if (sotienthu !== undefined || (idDaiLy !== currentIdDaiLy)) {
      // Restore old amount to old daily
      if (currentIdDaiLy) {
        await query('UPDATE inventory.DAILY SET CongNo = CongNo + $1 WHERE IDDaiLy = $2', [currentSoTienThu, currentIdDaiLy]);
      }

      // Apply new amount to new daily
      const newAmount = sotienthu !== undefined ? sotienthu : currentSoTienThu;
      await query('UPDATE inventory.DAILY SET CongNo = CongNo - $1 WHERE IDDaiLy = $2', [newAmount, idDaiLy]);
    }

    return {
      maphieuthu: result.rows[0].maphieuthu
    };
  }

  async deletePhieuThu(maphieuthu) {
    // Get PhieuThu info before deletion
    const phieuThuCheckQuery = 'SELECT IDPhieuThu, IDDaiLy, SoTienThu FROM inventory.PHIEUTHU WHERE MaPhieuThu = $1 AND DeletedAt IS NULL';
    const phieuThuCheck = await query(phieuThuCheckQuery, [maphieuthu]);
    if (phieuThuCheck.rowCount === 0) {
      throw new Error(`Không tìm thấy phiếu thu với mã ${maphieuthu}`);
    }

    const idPhieuThu = phieuThuCheck.rows[0].idphieuthu;
    const idDaiLy = phieuThuCheck.rows[0].iddaily;
    const sotienthu = phieuThuCheck.rows[0].sotienthu;

    const queryString = 'UPDATE inventory.PHIEUTHU SET DeletedAt = NOW() WHERE IDPhieuThu = $1 AND DeletedAt IS NULL';
    const result = await query(queryString, [idPhieuThu]);
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy phiếu thu.');
    }

    // Restore the amount to DaiLy CongNo
    const updateCongNoQuery = `
      UPDATE inventory.DAILY 
      SET CongNo = CongNo + $1 
      WHERE IDDaiLy = $2 AND DeletedAt IS NULL`;
    await query(updateCongNoQuery, [sotienthu, idDaiLy]);

    return { maphieuthu };
  }

  async searchPhieuThu({ maphieuthu, madaily, ngaythutien }) {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (maphieuthu) {
      conditions.push(`pt.MaPhieuThu LIKE $${paramIndex++}`);
      values.push(`%${maphieuthu}%`);
    }

    if (madaily) {
      conditions.push(`d.MaDaiLy LIKE $${paramIndex++}`);
      values.push(`%${madaily}%`);
    }

    if (ngaythutien) {
      conditions.push(`pt.NgayThuTien = $${paramIndex++}`);
      values.push(ngaythutien);
    }

    let whereClause = 'pt.DeletedAt IS NULL';
    if (conditions.length > 0) {
      whereClause += ` AND ${conditions.join(' AND ')}`;
    }

    const queryString = `
      SELECT 
        pt.MaPhieuThu as maphieuthu,
        pt.NgayThuTien as ngaythutien,
        pt.SoTienThu as sotienthu,
        d.MaDaiLy as madaily,
        d.TenDaiLy as tendaily
      FROM 
        inventory.PHIEUTHU pt
      LEFT JOIN 
        inventory.DAILY d ON pt.IDDaiLy = d.IDDaiLy
      WHERE 
        ${whereClause}
      ORDER BY 
        pt.NgayThuTien DESC, pt.MaPhieuThu`;

    const result = await query(queryString, values);
    return result.rows;
  }
}

export default PhieuThuService;