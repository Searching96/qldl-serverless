  // src/loai-dai-ly/service.js

  import { query } from './database.mjs';
  import { v4 as uuidv4 } from 'uuid';


  class LoaiDaiLyService {
    async createLoaiDaiLy(tenLoaiDaiLy) {
      console.log('Inside createLoaiDaiLy service with tenLoaiDaiLy:', tenLoaiDaiLy);
      if (!tenLoaiDaiLy) {
        throw new Error('Cần nhập tên loại đại lý.');
      }
      const maLoaiDaiLy = uuidv4();
      const queryString = 'INSERT INTO inventory.LoaiDaiLy (MaLoaiDaiLy, TenLoaiDaiLy) VALUES ($1, $2)';
      console.log('Executing query:', queryString, [maLoaiDaiLy, tenLoaiDaiLy]);
      await query(queryString, [maLoaiDaiLy, tenLoaiDaiLy]);
      console.log('Query executed successfully, maLoaiDaiLy:', maLoaiDaiLy);
      return maLoaiDaiLy;
    }

    async getAllLoaiDaiLy() {
      const queryString = 'SELECT MaLoaiDaiLy, TenLoaiDaiLy FROM inventory.LoaiDaiLy WHERE DeletedAt IS NULL';
      const result = await query(queryString);
      return result.rows;
    }

    async getLoaiDaiLy(maLoaiDaiLy) {
      const queryString = 'SELECT MaLoaiDaiLy, TenLoaiDaiLy FROM inventory.LoaiDaiLy WHERE MaLoaiDaiLy = $1 AND DeletedAt IS NULL';
      const result = await query(queryString, [maLoaiDaiLy]);
      return result.rows[0];
    }

    async updateLoaiDaiLy(maLoaiDaiLy, tenLoaiDaiLy) {
      if (!tenLoaiDaiLy) {
        throw new Error('Cần nhập tên loại đại lý.');
      }
      const queryString = 'UPDATE inventory.LoaiDaiLy SET TenLoaiDaiLy = $1 WHERE MaLoaiDaiLy = $2 AND DeletedAt IS NULL';
      const result = await query(queryString, [tenLoaiDaiLy, maLoaiDaiLy]);
      if (result.rowCount === 0) {
        throw new Error('Không tìm thấy loại đại lý.');
      }
    }

    async deleteLoaiDaiLy(maLoaiDaiLy) {
      const queryString = 'UPDATE inventory.LoaiDaiLy SET DeletedAt = NOW() WHERE MaLoaiDaiLy = $1 AND DeletedAt IS NULL';
      const result = await query(queryString, [maLoaiDaiLy]);
      if (result.rowCount === 0) {
        throw new Error('Không tìm thấy loại đại lý.');
      }
    }
  }

  export default LoaiDaiLyService;