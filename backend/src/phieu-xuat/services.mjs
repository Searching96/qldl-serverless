// src/phieu-xuat/service.js

import { query } from './database.mjs';
import { v4 as uuidv4 } from 'uuid';

class PhieuXuatService {
  async createPhieuXuat({ maphieuxuat, madaily, ngaylap, chitiet, tongtien }) {
    console.log('Inside createPhieuXuat service with data:', { maphieuxuat, madaily, ngaylap, tongtien, chitiet });

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

      console.log('Executing PhieuXuat query:', insertPhieuXuatQuery, [finalMaPhieuXuat, idDaiLy, ngaylap, finalTongGiaTri]);
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

      console.log('PhieuXuat created successfully:', {
        maphieuxuat: phieuXuatResult.rows[0].maphieuxuat,
        tongGiaTri
      });
      
      return phieuXuatResult.rows[0].maphieuxuat;

    } catch (error) {
      // Rollback transaction
      await query('ROLLBACK');
      throw error;
    }
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

  // async getAllDaiLy() {
  //   const queryString = `
  //     SELECT 
  //       d.IDDaiLy as iddaily,
  //       d.MaDaiLy as madaily,
  //       d.TenDaiLy as tendaily,
  //       d.DiaChi as diachi,
  //       d.SoDienThoai as sodienthoai,
  //       d.Email as email,
  //       q.MaQuan as maquan,
  //       l.MaLoaiDaiLy as maloaidaily,
  //       d.NgayTiepNhan as ngaytiepnhan,
  //       d.CongNo as congno,
  //       d.DeletedAt as deletedat,
  //       q.TenQuan as tenquan,
  //       l.TenLoaiDaiLy as tenloaidaily
  //     FROM 
  //       inventory.DAILY d
  //     LEFT JOIN 
  //       inventory.QUAN q ON d.IDQuan = q.IDQuan
  //     LEFT JOIN 
  //       inventory.LOAIDAILY l ON d.IDLoaiDaiLy = l.IDLoaiDaiLy
  //     WHERE 
  //       d.DeletedAt IS NULL
  //     ORDER BY 
  //       d.MaDaiLy`;

  //   const result = await query(queryString);
  //   return result.rows;
  // }

  // async getDaiLy(madaily) {
  //   const queryString = `
  //     SELECT 
  //       d.IDDaiLy as iddaily,
  //       d.MaDaiLy as madaily,
  //       d.TenDaiLy as tendaily,
  //       d.DiaChi as diachi,
  //       d.SoDienThoai as sodienthoai,
  //       d.Email as email,
  //       q.MaQuan as maquan,
  //       l.MaLoaiDaiLy as maloaidaily,
  //       d.NgayTiepNhan as ngaytiepnhan,
  //       d.CongNo as congno,
  //       d.DeletedAt as deletedat,
  //       q.TenQuan as tenquan,
  //       l.TenLoaiDaiLy as tenloaidaily
  //     FROM 
  //       inventory.DAILY d
  //     LEFT JOIN 
  //       inventory.QUAN q ON d.IDQuan = q.IDQuan
  //     LEFT JOIN 
  //       inventory.LOAIDAILY l ON d.IDLoaiDaiLy = l.IDLoaiDaiLy
  //     WHERE 
  //       d.MaDaiLy = $1 AND d.DeletedAt IS NULL`;
  //   const result = await query(queryString, [madaily]);
  //   if (result.rowCount === 0) {
  //     throw new Error('Không tìm thấy đại lý.');
  //   }
  //   return result.rows[0];
  // }

  // async updateDaiLy(madaily, { tendaily, sodienthoai, diachi, email, maloaidaily, maquan, ngaytiepnhan }) {
  //   console.log('Inside updateDaiLy service with madaily:', madaily, 'and data:', { tendaily, sodienthoai, diachi, email, maloaidaily, maquan, ngaytiepnhan });

  //   // Get IDDaiLy from MaDaiLy
  //   const dailyCheckQuery = 'SELECT IDDaiLy, IDQuan FROM inventory.DAILY WHERE MaDaiLy = $1 AND DeletedAt IS NULL';
  //   const dailyCheck = await query(dailyCheckQuery, [madaily]);
  //   if (dailyCheck.rowCount === 0) {
  //     throw new Error(`Không tìm thấy đại lý với mã ${madaily}`);
  //   }
  //   const idDaiLy = dailyCheck.rows[0].iddaily;
  //   const currentQuan = dailyCheck.rows[0].idquan;

  //   let idLoaiDaiLy = null;
  //   if (maloaidaily) {
  //     // Get IDLoaiDaiLy from MaLoaiDaiLy
  //     const loaidailyCheckQuery = 'SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE MaLoaiDaiLy = $1 AND DeletedAt IS NULL';
  //     const loaidailyCheck = await query(loaidailyCheckQuery, [maloaidaily]);
  //     if (loaidailyCheck.rowCount === 0) {
  //       throw new Error(`Mã loại đại lý ${maloaidaily} không tồn tại hoặc đã bị xóa`);
  //     }
  //     idLoaiDaiLy = loaidailyCheck.rows[0].idloaidaily;
  //   }

  //   let idQuan = null;
  //   if (maquan) {
  //     // Get IDQuan from MaQuan
  //     const quanCheckQuery = 'SELECT IDQuan FROM inventory.QUAN WHERE MaQuan = $1 AND DeletedAt IS NULL';
  //     const quanCheck = await query(quanCheckQuery, [maquan]);
  //     if (quanCheck.rowCount === 0) {
  //       throw new Error(`Mã quận ${maquan} không tồn tại hoặc đã bị xóa`);
  //     }
  //     idQuan = quanCheck.rows[0].idquan;
  //   }

  //   const updates = [];
  //   const values = [];
  //   let paramIndex = 1;

  //   if (tendaily) { updates.push(`TenDaiLy = $${paramIndex++}`); values.push(tendaily); }
  //   if (sodienthoai) { updates.push(`SoDienThoai = $${paramIndex++}`); values.push(sodienthoai); }
  //   if (diachi) { updates.push(`DiaChi = $${paramIndex++}`); values.push(diachi); }
  //   if (email) { updates.push(`Email = $${paramIndex++}`); values.push(email); }
  //   if (idLoaiDaiLy) { updates.push(`IDLoaiDaiLy = $${paramIndex++}`); values.push(idLoaiDaiLy); }    
  //   if (ngaytiepnhan) { updates.push(`NgayTiepNhan = $${paramIndex++}`); values.push(ngaytiepnhan); }

  //   if (updates.length === 0 && !idQuan) {
  //     throw new Error('Không có trường nào để cập nhật.');
  //   }

  //   let updateQuery;
    
  //   // If district is changing, use the combined limit check + update query
  //   if (idQuan && idQuan !== currentQuan) {
  //     console.log("Thay đổi quận từ " + currentQuan + " sang " + idQuan);
  //     values.push(idQuan);
  //     const idQuanParamIndex = paramIndex++;
  //     values.push(idDaiLy);
      
  //     updateQuery = `
  //       WITH limit_check AS (
  //         SELECT 
  //           COUNT(*) AS total_daily, 
  //           t.SoLuongDaiLyToiDa
  //         FROM inventory.DAILY d
  //         JOIN inventory.THAMSO t ON TRUE
  //         WHERE d.IDQuan = $${idQuanParamIndex} AND d.DeletedAt IS NULL
  //         GROUP BY t.SoLuongDaiLyToiDa
  //       ),
  //       validation AS (
  //         SELECT 
  //           CASE 
  //             WHEN (SELECT COUNT(*) FROM limit_check WHERE total_daily >= SoLuongDaiLyToiDa) > 0
  //             THEN FALSE
  //             ELSE TRUE
  //           END AS is_valid,
  //           (SELECT SoLuongDaiLyToiDa FROM limit_check LIMIT 1) AS max_limit,
  //           (SELECT total_daily FROM limit_check LIMIT 1) AS current_count
  //       ),
  //       update_op AS (
  //         UPDATE inventory.DAILY 
  //         SET ${updates.join(', ')}, IDQuan = $${idQuanParamIndex}
  //         WHERE IDDaiLy = $${paramIndex} 
  //           AND DeletedAt IS NULL
  //           AND (SELECT is_valid FROM validation) = TRUE
  //         RETURNING MaDaiLy as madaily, TRUE as update_successful
  //       )
  //       SELECT 
  //         u.madaily,
  //         u.update_successful,
  //         v.is_valid,
  //         v.max_limit,
  //         v.current_count
  //       FROM validation v
  //       LEFT JOIN update_op u ON TRUE;
  //     `;
  //   } else {
  //     // Standard update without district change
  //     values.push(idDaiLy);
      
  //     updateQuery = `
  //       UPDATE inventory.DAILY 
  //       SET ${updates.join(', ')} ${idQuan ? `, IDQuan = ${idQuan}` : ''}
  //       WHERE IDDaiLy = $${paramIndex} AND DeletedAt IS NULL
  //       RETURNING MaDaiLy as madaily, TRUE as update_successful;
  //     `;
  //   }

  //   console.log('Executing query:', updateQuery, values);
  //   const result = await query(updateQuery, values);

  //   if (result.rowCount === 0 || (result.rows[0].is_valid === false)) {
  //     if (result.rows[0] && result.rows[0].max_limit) {
  //       throw new Error(`Số lượng đại lý trong quận đã đạt giới hạn tối đa (${result.rows[0].max_limit}).`);
  //     } else {
  //       throw new Error('Không tìm thấy đại lý hoặc không thể cập nhật.');
  //     }
  //   }

  //   console.log('Update successful for madaily:', madaily);
  //   return { 
  //     madaily: result.rows[0].madaily 
  //   };
  // }

  // async deleteDaiLy(madaily) {
  //   console.log('Inside deleteDaiLy service with madaily:', madaily);

  //   // Get IDDaiLy from MaDaiLy
  //   const dailyCheckQuery = 'SELECT IDDaiLy, CongNo FROM inventory.DAILY WHERE MaDaiLy = $1 AND DeletedAt IS NULL';
  //   const dailyCheck = await query(dailyCheckQuery, [madaily]);
  //   if (dailyCheck.rowCount === 0) {
  //     throw new Error(`Không tìm thấy đại lý với madaily ${madaily}`);
  //   }

  //   const idDaiLy = dailyCheck.rows[0].iddaily;
  //   const congNo = dailyCheck.rows[0].congno;

  //   if (congNo !== 0) {
  //     throw new Error(`Đại lý ${madaily} chưa thanh toán công nợ.`);
  //   }

  //   const queryString = 'UPDATE inventory.DAILY SET DeletedAt = NOW() WHERE IDDaiLy = $1 AND DeletedAt IS NULL';
  //   console.log('Executing query:', queryString, [idDaiLy]);

  //   const result = await query(queryString, [idDaiLy]);
  //   if (result.rowCount === 0) {
  //     throw new Error('Không tìm thấy đại lý.');
  //   }

  //   console.log('Delete successful for madaily:', madaily);
  //   return { madaily };
  // }

  // async searchDaiLy({ madaily, tendaily, sodienthoai, email, diachi }) {
  //   console.log('Inside searchDaiLy service with criteria:', { tendaily, sodienthoai, email, diachi });

  //   const conditions = [];
  //   const values = [];
  //   let paramIndex = 1;

  //   if (tendaily) {
  //     conditions.push(`LOWER(d.TenDaiLy) LIKE LOWER($${paramIndex++})`);
  //     values.push(`%${tendaily}%`);
  //   }

  //   if (sodienthoai) {
  //     conditions.push(`d.SoDienThoai LIKE $${paramIndex++}`);
  //     values.push(`%${sodienthoai}%`);
  //   }

  //   if (email) {
  //     conditions.push(`LOWER(d.Email) LIKE LOWER($${paramIndex++})`);
  //     values.push(`%${email}%`);
  //   }

  //   if (diachi) {
  //     conditions.push(`LOWER(d.DiaChi) LIKE LOWER($${paramIndex++})`);
  //     values.push(`%${diachi}%`);
  //   }

  //   let whereClause = 'd.DeletedAt IS NULL';
  //   if (conditions.length > 0) {
  //     whereClause += ` AND ${conditions.join(' AND ')}`;
  //   }

  //   const queryString = `
  //     SELECT 
  //       d.MaDaiLy as madaily,
  //       d.TenDaiLy as tendaily,
  //       d.DiaChi as diachi,
  //       d.SoDienThoai as sodienthoai,
  //       d.Email as email,
  //       d.MaQuan as maquan,
  //       d.MaLoaiDaiLy as maloaidaily,
  //       d.NgayTiepNhan as ngaytiepnhan,
  //       d.CongNo as congno,
  //       d.DeletedAt as deletedat,
  //       q.TenQuan as tenquan,
  //       l.TenLoaiDaiLy as tenloaidaily
  //     FROM 
  //       inventory.DAILY d
  //     LEFT JOIN 
  //       inventory.QUAN q ON d.MaQuan = q.MaQuan
  //     LEFT JOIN 
  //       inventory.LOAIDAILY l ON d.MaLoaiDaiLy = l.MaLoaiDaiLy
  //     WHERE 
  //       ${whereClause}
  //     ORDER BY 
  //       d.TenDaiLy`;

  //   console.log('Executing search query with values:', values);
  //   const result = await query(queryString, values);
  //   return result.rows[0];
  // }
}

export default PhieuXuatService;