// src/dai-ly/service.js

import { query } from './database.mjs';

class DaiLyService {
  async getMonthlyRevenueReport(month, year) {
    const queryString = `
      WITH monthly_data AS (
        SELECT 
          d.MaDaiLy as madaily,
          d.TenDaiLy as tendaily,
          COUNT(px.IDPhieuXuat)::INTEGER as soluongphieuxuat,
          COALESCE(SUM(px.TongGiaTri), 0)::INTEGER as tonggiatrigiaodich
        FROM 
          inventory.DAILY d
        LEFT JOIN 
          inventory.PHIEUXUAT px ON d.IDDaiLy = px.IDDaiLy 
            AND EXTRACT(MONTH FROM px.NgayLap) = $1 
            AND EXTRACT(YEAR FROM px.NgayLap) = $2
            AND px.DeletedAt IS NULL
        WHERE 
          d.DeletedAt IS NULL
        GROUP BY 
          d.MaDaiLy, d.TenDaiLy
      ),
      total_revenue AS (
        SELECT COALESCE(SUM(tonggiatrigiaodich), 0)::INTEGER as tongdoanhso
        FROM monthly_data
        WHERE tonggiatrigiaodich > 0
      )
      SELECT 
        md.madaily,
        md.tendaily,
        md.soluongphieuxuat,
        md.tonggiatrigiaodich,
        tr.tongdoanhso,
        CASE 
          WHEN tr.tongdoanhso > 0 THEN 
            ROUND((md.tonggiatrigiaodich::DECIMAL / tr.tongdoanhso::DECIMAL) * 100, 2)
          ELSE 0 
        END as tile_phantram
      FROM 
        monthly_data md
      CROSS JOIN 
        total_revenue tr
      WHERE 
        md.tonggiatrigiaodich > 0
      ORDER BY 
        md.tonggiatrigiaodich DESC, md.madaily`;

    const result = await query(queryString, [month, year]);

    // Comprehensive Debug logging
    console.log('=== COMPREHENSIVE DEBUG OUTPUT ===');
    console.log('Query parameters:', { month, year });
    console.log('Result object keys:', Object.keys(result));
    console.log('Result rowCount:', result.rowCount);
    console.log('Result rows length:', result.rows?.length);

    if (result.rows && result.rows.length > 0) {
      console.log('All rows raw data:');
      result.rows.forEach((row, index) => {
        console.log(`Row ${index}:`, JSON.stringify(row, null, 2));
        console.log(`Row ${index} keys:`, Object.keys(row));
        console.log(`Row ${index} values with types:`);
        Object.entries(row).forEach(([key, value]) => {
          console.log(`  ${key}: ${value} (type: ${typeof value})`);
        });
      });

      console.log('First row detailed analysis:');
      const firstRow = result.rows[0];
      console.log('madaily:', firstRow.madaily, typeof firstRow.madaily);
      console.log('tendaily:', firstRow.tendaily, typeof firstRow.tendaily);
      console.log('soluongphieuxuat:', firstRow.soluongphieuxuat, typeof firstRow.soluongphieuxuat);
      console.log('tonggiatrigiaodich:', firstRow.tonggiatrigiaodich, typeof firstRow.tonggiatrigiaodich);
      console.log('tongdoanhso:', firstRow.tongdoanhso, typeof firstRow.tongdoanhso);
      console.log('tile_phantram:', firstRow.tile_phantram, typeof firstRow.tile_phantram);
    } else {
      console.log('No rows returned from query');
    }
    console.log('=== END DEBUG OUTPUT ===');

    // Calculate summary data
    const tongDoanhSo = result.rows.length > 0 ? parseInt(result.rows[0].tongdoanhso) : 0;
    const soLuongDaiLy = result.rows.length;

    return {
      thang: month,
      nam: year,
      tongdoanhso: tongDoanhSo,
      soluongdaily: soLuongDaiLy,
      chitiet: result.rows.map(row => ({
        madaily: row.madaily,
        tendaily: row.tendaily,
        soluongphieuxuat: parseInt(row.soluongphieuxuat),
        tonggiatrigiaodich: parseInt(row.tonggiatrigiaodich),
        tilephantramdoanhso: parseFloat(row.tile_phantram)
      }))
    };
  }

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
        l.TenLoaiDaiLy as tenloaidaily,
        l.NoToiDa as notoida
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
      throw new Error(`Insert execution failed: ${error.message}`);
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

    // Use provided MaDaiLy or generate new one
    if (!madaily) {
      const idTrackerQuery = `
        UPDATE inventory.ID_TRACKER
        SET MaDaiLyCuoi = MaDaiLyCuoi + 1
        RETURNING 'DL' || LPAD(MaDaiLyCuoi::TEXT, 5, '0') AS formatted_ma_daily`;
      const idTrackerResult = await query(idTrackerQuery);
      madaily = idTrackerResult.rows[0].formatted_ma_daily;
    }
    const mergedQuery = `
    WITH validation_check AS (
      SELECT 
        -- Validate agent type exists
        (SELECT COUNT(*) FROM inventory.LOAIDAILY WHERE IDLoaiDaiLy = $6 AND DeletedAt IS NULL) as agent_type_valid,
        -- Validate district exists  
        (SELECT COUNT(*) FROM inventory.QUAN WHERE IDQuan = $7 AND DeletedAt IS NULL) as district_valid,
        -- Count existing agents in district
        (SELECT COUNT(*) FROM inventory.DAILY WHERE IDQuan = $7 AND DeletedAt IS NULL) as current_agents,
        -- Get max agents limit from parameters (get latest active parameter)
        (SELECT SoLuongDaiLyToiDa FROM inventory.THAMSO WHERE DeletedAt IS NULL ORDER BY CreatedAt DESC LIMIT 1) as max_agents
    ),
    insert_check AS (
      SELECT 
        CASE 
          WHEN agent_type_valid = 0 THEN 'INVALID_AGENT_TYPE'
          WHEN district_valid = 0 THEN 'INVALID_DISTRICT'
          WHEN current_agents >= max_agents THEN 'MAX_AGENTS_EXCEEDED'
          ELSE 'VALID'
        END as validation_result,
        current_agents,
        max_agents,
        agent_type_valid,
        district_valid
      FROM validation_check
    )
    INSERT INTO inventory.DAILY 
      (MaDaiLy, TenDaiLy, SoDienThoai, DiaChi, Email, IDLoaiDaiLy, IDQuan, NgayTiepNhan)
    SELECT 
      $1, $2, $3, $4, $5, $6, $7, $8
    FROM insert_check
    WHERE validation_result = 'VALID'
    RETURNING 
      IDDaiLy as iddaily, 
      MaDaiLy as madaily, 
      'VALID' as validation_result,
      0 as current_agents,
      0 as max_agents;`; console.log('Executing query:', mergedQuery, [madaily, tendaily, sodienthoai, diachi, email, idLoaiDaiLy, idQuan, ngaytiepnhan]);
    const result = await query(mergedQuery, [madaily, tendaily, sodienthoai, diachi, email, idLoaiDaiLy, idQuan, ngaytiepnhan]);

    // Check if any rows were returned (insertion happened)
    if (result.rowCount === 0) {
      // No rows returned means validation failed, get the validation result
      const validationQuery = `
        WITH validation_check AS (
          SELECT 
            (SELECT COUNT(*) FROM inventory.LOAIDAILY WHERE IDLoaiDaiLy = $1 AND DeletedAt IS NULL) as agent_type_valid,
            (SELECT COUNT(*) FROM inventory.QUAN WHERE IDQuan = $2 AND DeletedAt IS NULL) as district_valid,
            (SELECT COUNT(*) FROM inventory.DAILY WHERE IDQuan = $2 AND DeletedAt IS NULL) as current_agents,
            (SELECT SoLuongDaiLyToiDa FROM inventory.THAMSO WHERE DeletedAt IS NULL ORDER BY CreatedAt DESC LIMIT 1) as max_agents
        )
        SELECT 
          CASE 
            WHEN agent_type_valid = 0 THEN 'Mã loại đại lý không tồn tại hoặc đã bị xóa'
            WHEN district_valid = 0 THEN 'Mã quận không tồn tại hoặc đã bị xóa'
            WHEN current_agents >= max_agents THEN 'Số lượng đại lý trong quận đã đạt giới hạn tối đa (' || max_agents || ')'
            ELSE 'Lỗi không xác định'
          END as error_message,
          current_agents,
          max_agents
        FROM validation_check`;

      const validationResult = await query(validationQuery, [idLoaiDaiLy, idQuan]);
      throw new Error(validationResult.rows[0].error_message);
    } else {
      console.log('Query executed successfully, result:', {
        iddaily: result.rows[0].iddaily,
        madaily: result.rows[0].madaily
      });
      return result.rows[0].madaily;
    }
  }

  async updateDaiLy(madaily, { tendaily, sodienthoai, diachi, email, maloaidaily, maquan, ngaytiepnhan }) {
    console.log('Inside updateDaiLy service with madaily:', madaily, 'and data:', { tendaily, sodienthoai, diachi, email, maloaidaily, maquan, ngaytiepnhan });

    // Get IDDaiLy from MaDaiLy
    const dailyCheckQuery = 'SELECT IDDaiLy, IDQuan FROM inventory.DAILY WHERE MaDaiLy = $1 AND DeletedAt IS NULL';
    const dailyCheck = await query(dailyCheckQuery, [madaily]);
    if (dailyCheck.rowCount === 0) {
      throw new Error(`Không tìm thấy đại lý với mã ${madaily}`);
    }
    const idDaiLy = dailyCheck.rows[0].iddaily;
    const currentQuan = dailyCheck.rows[0].idquan;

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
    let isQuanChanging = false;
    if (maquan) {
      // Get IDQuan from MaQuan
      const quanCheckQuery = 'SELECT IDQuan FROM inventory.QUAN WHERE MaQuan = $1 AND DeletedAt IS NULL';
      const quanCheck = await query(quanCheckQuery, [maquan]);
      if (quanCheck.rowCount === 0) {
        throw new Error(`Mã quận ${maquan} không tồn tại hoặc đã bị xóa`);
      }
      idQuan = quanCheck.rows[0].idquan;
      isQuanChanging = idQuan !== currentQuan;
    }

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (tendaily) { updates.push(`TenDaiLy = $${paramIndex++}`); values.push(tendaily); }
    if (sodienthoai) { updates.push(`SoDienThoai = $${paramIndex++}`); values.push(sodienthoai); }
    if (diachi) { updates.push(`DiaChi = $${paramIndex++}`); values.push(diachi); }
    if (email) { updates.push(`Email = $${paramIndex++}`); values.push(email); }
    if (idLoaiDaiLy) { updates.push(`IDLoaiDaiLy = $${paramIndex++}`); values.push(idLoaiDaiLy); }
    if (ngaytiepnhan) { updates.push(`NgayTiepNhan = $${paramIndex++}`); values.push(ngaytiepnhan); }
    if (idQuan) { updates.push(`IDQuan = $${paramIndex++}`); values.push(idQuan); }

    if (updates.length === 0) {
      throw new Error('Không có trường nào để cập nhật.');
    }

    values.push(idDaiLy);

    let updateQuery;

    // If district is changing, use the combined limit check + update query
    if (isQuanChanging) {
      console.log("Thay đổi quận từ " + currentQuan + " sang " + idQuan);

      updateQuery = `
        WITH validation_check AS (
          SELECT 
            (SELECT COUNT(*) FROM inventory.QUAN WHERE IDQuan = $${paramIndex - 1} AND DeletedAt IS NULL) as district_valid,
            (SELECT COUNT(*) FROM inventory.DAILY WHERE IDQuan = $${paramIndex - 1} AND DeletedAt IS NULL) as current_agents,
            (SELECT SoLuongDaiLyToiDa FROM inventory.THAMSO WHERE DeletedAt IS NULL ORDER BY CreatedAt DESC LIMIT 1) as max_agents
        ),
        update_check AS (
          SELECT 
            CASE 
              WHEN district_valid = 0 THEN 'INVALID_DISTRICT'
              WHEN current_agents >= max_agents THEN 'MAX_AGENTS_EXCEEDED'
              ELSE 'VALID'
            END as validation_result,
            current_agents,
            max_agents,
            district_valid
          FROM validation_check
        ),
        update_op AS (
          UPDATE inventory.DAILY 
          SET ${updates.join(', ')}
          WHERE IDDaiLy = $${paramIndex} 
            AND DeletedAt IS NULL
            AND (SELECT validation_result FROM update_check) = 'VALID'
          RETURNING MaDaiLy as madaily, 'VALID' as validation_result
        )
        SELECT 
          COALESCE(u.madaily, 'UPDATE_FAILED') as madaily,
          COALESCE(u.validation_result, uc.validation_result) as validation_result,
          uc.max_agents,
          uc.current_agents,
          uc.district_valid
        FROM update_check uc
        LEFT JOIN update_op u ON TRUE;`;
    } else {
      // Standard update without district change validation
      updateQuery = `
        UPDATE inventory.DAILY 
        SET ${updates.join(', ')}
        WHERE IDDaiLy = $${paramIndex} AND DeletedAt IS NULL
        RETURNING MaDaiLy as madaily, 'VALID' as validation_result;
      `;
    }

    console.log('Executing query:', updateQuery, values);
    const result = await query(updateQuery, values);

    if (result.rowCount === 0 || (result.rows[0].validation_result && result.rows[0].validation_result !== 'VALID')) {
      const row = result.rows[0];
      if (row && row.validation_result === 'INVALID_DISTRICT') {
        throw new Error('Mã quận không tồn tại hoặc đã bị xóa');
      } else if (row && row.validation_result === 'MAX_AGENTS_EXCEEDED') {
        throw new Error(`Số lượng đại lý trong quận đã đạt giới hạn tối đa (${row.max_agents}).`);
      } else {
        throw new Error('Không tìm thấy đại lý hoặc không thể cập nhật.');
      }
    }

    console.log('Update successful for madaily:', madaily);
    return {
      madaily: result.rows[0].madaily
    };
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
  async searchDaiLy({
    madaily,
    tendaily,
    sodienthoai,
    email,
    diachi,
    maquan,
    tenquan,
    maloaidaily,
    tenloaidaily,
    ngaytiepnhan_from,
    ngaytiepnhan_to,
    congno_min,
    congno_max,
    has_debt,
    // Advanced export slip criteria
    maphieuxuat_from,
    maphieuxuat_to,
    ngaylap_from,
    ngaylap_to,
    tonggiatri_from,
    tonggiatri_to,
    // Product/item criteria
    mamathang,
    soluongxuat_from,
    soluongxuat_to,
    dongiaxuat_from,
    dongiaxuat_to,
    thanhtien_from,
    thanhtien_to,
    soluongton_from,
    soluongton_to,
    madonvitinh
  }) {
    console.log('Inside searchDaiLy service with criteria:', {
      madaily, tendaily, sodienthoai, email, diachi, maquan, tenquan,
      maloaidaily, tenloaidaily, ngaytiepnhan_from, ngaytiepnhan_to,
      congno_min, congno_max, has_debt,
      maphieuxuat_from, maphieuxuat_to, ngaylap_from, ngaylap_to,
      tonggiatri_from, tonggiatri_to, mamathang, soluongxuat_from,
      soluongxuat_to, dongiaxuat_from, dongiaxuat_to, thanhtien_from,
      thanhtien_to, soluongton_from, soluongton_to, madonvitinh
    });

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    // Agent code search
    if (madaily) {
      conditions.push(`d.MaDaiLy = $${paramIndex++}`);
      values.push(madaily);
    }

    // Agent name search (partial match)
    if (tendaily) {
      conditions.push(`LOWER(d.TenDaiLy) LIKE LOWER($${paramIndex++})`);
      values.push(`%${tendaily}%`);
    }

    // Phone number search (partial match)
    if (sodienthoai) {
      conditions.push(`d.SoDienThoai LIKE $${paramIndex++}`);
      values.push(`%${sodienthoai}%`);
    }

    // Email search (partial match)
    if (email) {
      conditions.push(`LOWER(d.Email) LIKE LOWER($${paramIndex++})`);
      values.push(`%${email}%`);
    }

    // Address search (partial match)
    if (diachi) {
      conditions.push(`LOWER(d.DiaChi) LIKE LOWER($${paramIndex++})`);
      values.push(`%${diachi}%`);
    }

    // District code search
    if (maquan) {
      conditions.push(`q.MaQuan = $${paramIndex++}`);
      values.push(maquan);
    }

    // District name search (partial match)
    if (tenquan) {
      conditions.push(`LOWER(q.TenQuan) LIKE LOWER($${paramIndex++})`);
      values.push(`%${tenquan}%`);
    }

    // Agent type code search
    if (maloaidaily) {
      conditions.push(`l.MaLoaiDaiLy = $${paramIndex++}`);
      values.push(maloaidaily);
    }

    // Agent type name search (partial match)
    if (tenloaidaily) {
      conditions.push(`LOWER(l.TenLoaiDaiLy) LIKE LOWER($${paramIndex++})`);
      values.push(`%${tenloaidaily}%`);
    }

    // Date range search for NgayTiepNhan
    if (ngaytiepnhan_from) {
      conditions.push(`d.NgayTiepNhan >= $${paramIndex++}`);
      values.push(ngaytiepnhan_from);
    }

    if (ngaytiepnhan_to) {
      conditions.push(`d.NgayTiepNhan <= $${paramIndex++}`);
      values.push(ngaytiepnhan_to);
    }

    // Outstanding debt range search
    if (congno_min !== undefined && congno_min !== null) {
      conditions.push(`d.CongNo >= $${paramIndex++}`);
      values.push(congno_min);
    }

    if (congno_max !== undefined && congno_max !== null) {
      conditions.push(`d.CongNo <= $${paramIndex++}`);
      values.push(congno_max);
    }    // Filter by debt status
    if (has_debt === 'true') {
      conditions.push(`d.CongNo > 0`);
    } else if (has_debt === 'false') {
      conditions.push(`d.CongNo = 0`);
    }

    // Advanced export slip search criteria
    if (maphieuxuat_from) {
      conditions.push(`px.MaPhieuXuat >= $${paramIndex++}`);
      values.push(maphieuxuat_from);
    }

    if (maphieuxuat_to) {
      conditions.push(`px.MaPhieuXuat <= $${paramIndex++}`);
      values.push(maphieuxuat_to);
    }

    if (ngaylap_from) {
      conditions.push(`px.NgayLap >= $${paramIndex++}`);
      values.push(ngaylap_from);
    }

    if (ngaylap_to) {
      conditions.push(`px.NgayLap <= $${paramIndex++}`);
      values.push(ngaylap_to);
    }

    if (tonggiatri_from !== undefined && tonggiatri_from !== null) {
      conditions.push(`px.TongGiaTri >= $${paramIndex++}`);
      values.push(tonggiatri_from);
    }

    if (tonggiatri_to !== undefined && tonggiatri_to !== null) {
      conditions.push(`px.TongGiaTri <= $${paramIndex++}`);
      values.push(tonggiatri_to);
    }

    // Product/item search criteria
    if (mamathang) {
      conditions.push(`mh.MaMatHang LIKE $${paramIndex++}`);
      values.push(`%${mamathang}%`);
    }

    if (soluongxuat_from !== undefined && soluongxuat_from !== null) {
      conditions.push(`ct.SoLuongXuat >= $${paramIndex++}`);
      values.push(soluongxuat_from);
    }

    if (soluongxuat_to !== undefined && soluongxuat_to !== null) {
      conditions.push(`ct.SoLuongXuat <= $${paramIndex++}`);
      values.push(soluongxuat_to);
    }

    if (dongiaxuat_from !== undefined && dongiaxuat_from !== null) {
      conditions.push(`ct.DonGiaXuat >= $${paramIndex++}`);
      values.push(dongiaxuat_from);
    }

    if (dongiaxuat_to !== undefined && dongiaxuat_to !== null) {
      conditions.push(`ct.DonGiaXuat <= $${paramIndex++}`);
      values.push(dongiaxuat_to);
    }

    if (thanhtien_from !== undefined && thanhtien_from !== null) {
      conditions.push(`ct.ThanhTien >= $${paramIndex++}`);
      values.push(thanhtien_from);
    }

    if (thanhtien_to !== undefined && thanhtien_to !== null) {
      conditions.push(`ct.ThanhTien <= $${paramIndex++}`);
      values.push(thanhtien_to);
    }

    if (soluongton_from !== undefined && soluongton_from !== null) {
      conditions.push(`mh.SoLuongTon >= $${paramIndex++}`);
      values.push(soluongton_from);
    }

    if (soluongton_to !== undefined && soluongton_to !== null) {
      conditions.push(`mh.SoLuongTon <= $${paramIndex++}`);
      values.push(soluongton_to);
    }

    if (madonvitinh) {
      conditions.push(`dvt.MaDonViTinh LIKE $${paramIndex++}`);
      values.push(`%${madonvitinh}%`);
    }

    let whereClause = 'd.DeletedAt IS NULL';
    if (conditions.length > 0) {
      whereClause += ` AND ${conditions.join(' AND ')}`;
    } const queryString = `
      SELECT DISTINCT
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
        l.TenLoaiDaiLy as tenloaidaily,
        l.NoToiDa as notoida,        -- Export slip information (aggregated)
        COUNT(DISTINCT px.IDPhieuXuat) as so_phieu_xuat,
        MAX(px.NgayLap) as ngay_lap_gan_nhat,
        SUM(px.TongGiaTri) as tong_gia_tri_xuat,
        -- Product information (aggregated)
        COUNT(DISTINCT mh.IDMatHang) as so_mat_hang,
        SUM(ct.SoLuongXuat) as tong_so_luong_xuat,
        SUM(ct.ThanhTien) as tong_thanh_tien
      FROM 
        inventory.DAILY d
      LEFT JOIN 
        inventory.QUAN q ON d.IDQuan = q.IDQuan
      LEFT JOIN 
        inventory.LOAIDAILY l ON d.IDLoaiDaiLy = l.IDLoaiDaiLy
      LEFT JOIN 
        inventory.PHIEUXUAT px ON d.IDDaiLy = px.IDDaiLy AND px.DeletedAt IS NULL
      LEFT JOIN 
        inventory.CTPHIEUXUAT ct ON px.IDPhieuXuat = ct.IDPhieuXuat AND ct.DeletedAt IS NULL
      LEFT JOIN 
        inventory.MATHANG mh ON ct.IDMatHang = mh.IDMatHang AND mh.DeletedAt IS NULL
      LEFT JOIN 
        inventory.DONVITINH dvt ON mh.IDDonViTinh = dvt.IDDonViTinh AND dvt.DeletedAt IS NULL
      WHERE 
        ${whereClause}
      GROUP BY 
        d.IDDaiLy, d.MaDaiLy, d.TenDaiLy, d.DiaChi, d.SoDienThoai, d.Email, 
        q.MaQuan, l.MaLoaiDaiLy, d.NgayTiepNhan, d.CongNo, d.DeletedAt, 
        q.TenQuan, l.TenLoaiDaiLy, l.NoToiDa
      ORDER BY 
        d.TenDaiLy, d.MaDaiLy`;

    console.log('Executing search query with values:', values);
    const result = await query(queryString, values);
    return result.rows; // Return all matching rows, not just the first one
  }
}

export default DaiLyService;