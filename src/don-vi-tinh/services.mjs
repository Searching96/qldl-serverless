  // src/don-vi-tinh/service.js

  import { query } from './database.mjs';
  import { v4 as uuidv4 } from 'uuid';


  class DonViTinhService {
    async createDonViTinh(tenDonViTinh) {
      console.log('Inside createDonViTinh service with tenDonViTinh:', tenDonViTinh);
      if (!tenDonViTinh) {
        throw new Error('Cần nhập tên đơn vị tính.');
      }
      const maDonViTinh = uuidv4();
      const queryString = 'INSERT INTO inventory.DONVITINH (MaDonViTinh, TenDonViTinh) VALUES ($1, $2)';
      console.log('Executing query:', queryString, [maDonViTinh, tenDonViTinh]);
      await query(queryString, [maDonViTinh, tenDonViTinh]);
      console.log('Query executed successfully, maDonViTinh:', maDonViTinh);
      return maDonViTinh;
    }

    async getAllDonViTinh() {
      const queryString = 'SELECT MaDonViTinh, TenDonViTinh FROM inventory.DonViTinh WHERE DeletedAt IS NULL';
      const result = await query(queryString);
      return result.rows;
    }

    async getDonViTinh(maDonViTinh) {
      const queryString = 'SELECT MaDonViTinh, TenDonViTinh FROM inventory.DONVITINH WHERE MaDonViTinh = $1 AND DeletedAt IS NULL';
      const result = await query(queryString, [maDonViTinh]);
      return result.rows[0];
    }

    async updateDonViTinh(maDonViTinh, tenDonViTinh) {
      if (!tenDonViTinh) {
        throw new Error('Cần nhập tên đơn vị tính.');
      }
      const queryString = 'UPDATE inventory.DONVITINH SET TenDonViTinh = $1 WHERE MaDonViTinh = $2 AND DeletedAt IS NULL';
      const result = await query(queryString, [tenDonViTinh, maDonViTinh]);
      if (result.rowCount === 0) {
        throw new Error('Không tìm thấy đơn vị tính.');
      }
    }

    async deleteDonViTinh(maDonViTinh) {
      const queryString = 'UPDATE inventory.DONVITINH SET DeletedAt = NOW() WHERE MaDonViTinh = $1 AND DeletedAt IS NULL';
      const result = await query(queryString, [maDonViTinh]);
      if (result.rowCount === 0) {
        throw new Error('Không tìm thấy đơn vị tính.');
      }
    }
  }

  export default DonViTinhService;