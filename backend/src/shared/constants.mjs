// shared/constants.mjs

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

export const ERROR_MESSAGES = {
  MISSING_REQUIRED_FIELDS: 'Thiếu các trường bắt buộc',
  DAILY_NOT_FOUND: 'Không tìm thấy đại lý',
  DISTRICT_NOT_FOUND: 'Không tìm thấy quận',
  PRODUCT_NOT_FOUND: 'Không tìm thấy mặt hàng',
  UNIT_NOT_FOUND: 'Không tìm thấy đơn vị tính',
  QUERY_EXECUTION_FAILED: 'Thực thi truy vấn thất bại',
  INSERT_EXECUTION_FAILED: 'Thực thi chèn dữ liệu thất bại',
  INVALID_EMAIL: 'Email không hợp lệ',
  INVALID_PHONE: 'Số điện thoại không hợp lệ',
  INVALID_DATE: 'Ngày không hợp lệ'
};

export const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

export const DATABASE_CONFIG = {
  MAX_CONNECTIONS: 10,
  IDLE_TIMEOUT: 120000,
  CONNECTION_TIMEOUT: 30000,
  PORT: 5432
};