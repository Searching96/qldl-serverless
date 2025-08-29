// src/phieu-xuat/service.js

import { query } from '../shared/database.mjs';
import { validateRequiredFields, isNonNegativeInteger, isPositiveInteger } from '../shared/validation.mjs';
import { ValidationError, NotFoundError } from '../shared/errorHandler.mjs';
import { ERROR_MESSAGES } from '../shared/constants.mjs';

class PhieuXuatService {
  async createPhieuXuat({ maphieuxuat, madaily, ngaylap, chitiet, tongtien }) {
    const requiredFields = ['madaily', 'ngaylap', 'chitiet'];
    const data = { madaily, ngaylap, chitiet };
    const missingFields = this.validateRequiredFields(data, requiredFields);

    if (missingFields.length > 0) {
      throw new Error(`Thiếu các trường bắt buộc: ${missingFields.join(', ')}`);
    }

    // Validate chitiet is array and not empty
    if (!Array.isArray(chitiet) || chitiet.length === 0) {
      throw new Error('Chi tiết phiếu xuất phải là mảng và không được rỗng.');
    }

    // Get IDDaiLy from MaDaiLy
    const dailyCheckQuery = 'SELECT IDDaiLy FROM inventory.DAILY WHERE MaDaiLy = $1 AND DeletedAt IS NULL';
    const dailyCheck = await query(dailyCheckQuery, [madaily]);
    if (dailyCheck.rowCount === 0) {
      throw new Error(`Mã đại lý ${madaily} không tồn tại hoặc đã bị xóa`);
    }
    const idDaiLy = dailyCheck.rows[0].iddaily;

    // Use provided maphieuxuat or generate new one
    let finalMaPhieuXuat = maphieuxuat;
    if (!finalMaPhieuXuat) {
      const lastMaPhieuXuatQuery = `
        SELECT MaPhieuXuat 
        FROM inventory.PHIEUXUAT 
        WHERE DeletedAt IS NULL 
        ORDER BY CAST(MaPhieuXuat AS INTEGER) DESC 
        LIMIT 1`;
      const lastMaPhieuXuatResult = await query(lastMaPhieuXuatQuery);
      
      if (lastMaPhieuXuatResult.rowCount === 0) {
        finalMaPhieuXuat = "1";
      } else {
        const lastMaPhieuXuat = parseInt(lastMaPhieuXuatResult.rows[0].maphieuxuat);
        finalMaPhieuXuat = (lastMaPhieuXuat + 1).toString();
      }
    }

    // Validate and calculate total for each detail item
    let tongGiaTri = 0;
    const validatedChiTiet = [];

    for (const item of chitiet) {
      const { mamathang, soluongxuat, dongiaxuat, thanhtien } = item;
      
      if (!mamathang || !soluongxuat || !dongiaxuat) {
        throw new Error('Mỗi chi tiết phải có mamathang, soluongxuat và dongiaxuat.');
      }

      // Validate soluongxuat and dongiaxuat are positive integers
      if (!Number.isInteger(soluongxuat) || soluongxuat <= 0) {
        throw new Error('Số lượng xuất phải là số nguyên dương.');
      }
      if (!Number.isInteger(dongiaxuat) || dongiaxuat <= 0) {
        throw new Error('Đơn giá xuất phải là số nguyên dương.');
      }

      // Get IDMatHang from MaMatHang
      const matHangCheckQuery = 'SELECT IDMatHang, SoLuongTon FROM inventory.MATHANG WHERE MaMatHang = $1 AND DeletedAt IS NULL';
      const matHangCheck = await query(matHangCheckQuery, [mamathang]);
      if (matHangCheck.rowCount === 0) {
        throw new Error(`Mã mặt hàng ${mamathang} không tồn tại hoặc đã bị xóa`);
      }
      
      const idMatHang = matHangCheck.rows[0].idmathang;
      const soLuongTon = matHangCheck.rows[0].soluongton;

      // Check if there's enough stock
      if (soLuongTon < soluongxuat) {
        throw new Error(`Mặt hàng ${mamathang} không đủ số lượng tồn kho. Tồn: ${soLuongTon}, Xuất: ${soluongxuat}`);
      }

      // Use provided thanhtien or calculate it
      const finalThanhTien = thanhtien || (soluongxuat * dongiaxuat);
      tongGiaTri += finalThanhTien;

      validatedChiTiet.push({
        idMatHang,
        soluongxuat,
        dongiaxuat,
        thanhTien: finalThanhTien
      });
    }

    // Use provided tongtien or calculated tongGiaTri
    const finalTongGiaTri = tongtien || tongGiaTri;

    // Begin transaction
    await query('BEGIN');

    try {
      // Insert PHIEUXUAT
      const insertPhieuXuatQuery = `
        INSERT INTO inventory.PHIEUXUAT 
          (MaPhieuXuat, IDDaiLy, NgayLap, TongGiaTri)
        VALUES 
          ($1, $2, $3, $4)
        RETURNING IDPhieuXuat as idphieuxuat, MaPhieuXuat as maphieuxuat`;

      const phieuXuatResult = await query(insertPhieuXuatQuery, [finalMaPhieuXuat, idDaiLy, ngaylap, finalTongGiaTri]);
      const idPhieuXuat = phieuXuatResult.rows[0].idphieuxuat;

      // Insert CTPHIEUXUAT details
      for (const item of validatedChiTiet) {
        const insertChiTietQuery = `
          INSERT INTO inventory.CTPHIEUXUAT 
            (IDPhieuXuat, IDMatHang, SoLuongXuat, DonGiaXuat, ThanhTien)
          VALUES 
            ($1, $2, $3, $4, $5)`;

        await query(insertChiTietQuery, [
          idPhieuXuat, 
          item.idMatHang, 
          item.soluongxuat, 
          item.dongiaxuat, 
          item.thanhTien
        ]);

        // Update MATHANG stock
        const updateStockQuery = `
          UPDATE inventory.MATHANG 
          SET SoLuongTon = SoLuongTon - $1 
          WHERE IDMatHang = $2 AND DeletedAt IS NULL`;
        await query(updateStockQuery, [item.soluongxuat, item.idMatHang]);
      }

      // Update DaiLy CongNo (add the total value)
      const updateCongNoQuery = `
        UPDATE inventory.DAILY 
        SET CongNo = CongNo + $1 
        WHERE IDDaiLy = $2 AND DeletedAt IS NULL`;
      await query(updateCongNoQuery, [finalTongGiaTri, idDaiLy]);

      // Commit transaction
      await query('COMMIT');

      return phieuXuatResult.rows[0].maphieuxuat;

    } catch (error) {
      // Rollback transaction
      await query('ROLLBACK');
      throw error;
    }
  }

  async getAllPhieuXuat() {
    const queryString = `
      SELECT 
        px.IDPhieuXuat as idphieuxuat,
        px.MaPhieuXuat as maphieuxuat,
        px.NgayLap as ngaylap,
        px.TongGiaTri as tonggiatri,
        px.DeletedAt as deletedat,
        d.MaDaiLy as madaily,
        d.TenDaiLy as tendaily
      FROM 
        inventory.PHIEUXUAT px
      LEFT JOIN 
        inventory.DAILY d ON px.IDDaiLy = d.IDDaiLy
      WHERE 
        px.DeletedAt IS NULL
      ORDER BY 
        px.NgayLap DESC, px.MaPhieuXuat`;

    const result = await query(queryString);
    return result.rows;
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
}

export default PhieuXuatService;