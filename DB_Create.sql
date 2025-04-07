-- Drop the schema and all its objects
DROP SCHEMA IF EXISTS inventory CASCADE;

-- Recreate the schema
CREATE SCHEMA inventory;

-- Create tables
CREATE TABLE inventory.DONVITINH (
    IDDonViTinh UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    MaDonViTinh VARCHAR(8) UNIQUE,
    TenDonViTinh VARCHAR(50) NOT NULL,
    DeletedAt TIMESTAMP DEFAULT NULL
);

CREATE TABLE inventory.LOAIDAILY (
    IDLoaiDaiLy UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    MaLoaiDaiLy VARCHAR(8) UNIQUE,
    TenLoaiDaiLy VARCHAR(50) NOT NULL,
    NoToiDa INTEGER NOT NULL,
    DeletedAt TIMESTAMP DEFAULT NULL
);

CREATE TABLE inventory.QUAN (
    IDQuan UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    MaQuan VARCHAR(8) UNIQUE,
    TenQuan VARCHAR(50) NOT NULL,
    NgayTiepNhan DATE,
    NoDaiLy INTEGER DEFAULT 0,
    DeletedAt TIMESTAMP DEFAULT NULL
);

CREATE TABLE inventory.MATHANG (
    IDMatHang UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    MaMatHang VARCHAR(8) UNIQUE,
    TenMatHang VARCHAR(100) NOT NULL,
    IDDonViTinh UUID NOT NULL,
    SoLuongTon INTEGER NOT NULL,
    DeletedAt TIMESTAMP DEFAULT NULL
);

CREATE TABLE inventory.DAILY (
    IDDaiLy UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    MaDaiLy VARCHAR(8) UNIQUE,
    TenDaiLy VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(15),
    DiaChi VARCHAR(200),
    Email VARCHAR(100),
    IDLoaiDaiLy UUID NOT NULL,
    IDQuan UUID NOT NULL,
    NgayTiepNhan DATE NOT NULL,
    CongNo INTEGER DEFAULT 0,
    DeletedAt TIMESTAMP DEFAULT NULL
);

CREATE TABLE inventory.PHIEUTHU (
    IDPhieuThu UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    MaPhieuThu VARCHAR(8) UNIQUE,
    IDDaiLy UUID NOT NULL,
    NgayThuTien DATE NOT NULL,
    SoTienThu INTEGER NOT NULL,
    DeletedAt TIMESTAMP DEFAULT NULL
);

CREATE TABLE inventory.PHIEUXUAT (
    IDPhieuXuat UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    MaPhieuXuat VARCHAR(8) UNIQUE,
    IDDaiLy UUID NOT NULL,
    NgayLap DATE NOT NULL,
    TongGiaTri INTEGER NOT NULL,
    DeletedAt TIMESTAMP DEFAULT NULL
);

CREATE TABLE inventory.CTPHIEUXUAT (
    IDPhieuXuat UUID,
    IDMatHang UUID,
    SoLuongXuat INTEGER NOT NULL,
    DonGiaXuat INTEGER NOT NULL,
    ThanhTien INTEGER NOT NULL,
    DeletedAt TIMESTAMP DEFAULT NULL,
    PRIMARY KEY (IDPhieuXuat, IDMatHang)
);

CREATE TABLE inventory.THAMSO (
    IDThamSo UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    MaThamSo VARCHAR(8) UNIQUE,
    SoLuongDaiLyToiDa INTEGER NOT NULL,
    QuyDinhTienThuTienNo INTEGER NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DeletedAt TIMESTAMP DEFAULT NULL
);

CREATE TABLE inventory.ID_TRACKER (
    IDTracker UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    MaDaiLyCuoi INTEGER DEFAULT 0,
    MaDonViTinhCuoi INTEGER DEFAULT 0,
    MaLoaiDaiLyCuoi INTEGER DEFAULT 0,
    MaQuanCuoi INTEGER DEFAULT 0,
    MaMatHangCuoi INTEGER DEFAULT 0,
    MaPhieuThuCuoi INTEGER DEFAULT 0,
    MaPhieuXuatCuoi INTEGER DEFAULT 0
);

-- Create a single script that properly handles random UUID generation with realistic data
-- Use CTEs to create and reference UUIDs between related tables

-- Insert initial records
INSERT INTO inventory.ID_TRACKER DEFAULT VALUES;

-- Insert into DONVITINH, LOAIDAILY, and QUAN tables with CTEs
WITH inserted_donvitinh AS (
    INSERT INTO inventory.DONVITINH (IDDonViTinh, MaDonViTinh, TenDonViTinh)
    VALUES
        (gen_random_uuid(), 'DVT00001', 'Cái'),
        (gen_random_uuid(), 'DVT00002', 'Hộp'),
        (gen_random_uuid(), 'DVT00003', 'Thùng'),
        (gen_random_uuid(), 'DVT00004', 'Kg'),
        (gen_random_uuid(), 'DVT00005', 'Lít'),
        (gen_random_uuid(), 'DVT00006', 'Chai'),
        (gen_random_uuid(), 'DVT00007', 'Gói'),
        (gen_random_uuid(), 'DVT00008', 'Lon')
    RETURNING IDDonViTinh, TenDonViTinh
),
inserted_loaidaily AS (
    INSERT INTO inventory.LOAIDAILY (IDLoaiDaiLy, MaLoaiDaiLy, TenLoaiDaiLy, NoToiDa)
    VALUES
        (gen_random_uuid(), 'LDL00001', 'Loại 1', 20000000),
        (gen_random_uuid(), 'LDL00002', 'Loại 2', 50000000),
        (gen_random_uuid(), 'LDL00003', 'Loại 3', 100000000)
    RETURNING IDLoaiDaiLy, TenLoaiDaiLy
),
inserted_quan AS (
    INSERT INTO inventory.QUAN (IDQuan, MaQuan, TenQuan, NgayTiepNhan)
    VALUES
        (gen_random_uuid(), 'QUA00001', 'Quận 1', CURRENT_DATE), 
        (gen_random_uuid(), 'QUA00002', 'Quận 2', CURRENT_DATE), 
        (gen_random_uuid(), 'QUA00003', 'Quận 3', CURRENT_DATE),
        (gen_random_uuid(), 'QUA00004', 'Quận 4', CURRENT_DATE), 
        (gen_random_uuid(), 'QUA00005', 'Quận 5', CURRENT_DATE), 
        (gen_random_uuid(), 'QUA00006', 'Quận 6', CURRENT_DATE),
        (gen_random_uuid(), 'QUA00007', 'Quận 7', CURRENT_DATE), 
        (gen_random_uuid(), 'QUA00008', 'Quận 8', CURRENT_DATE), 
        (gen_random_uuid(), 'QUA00009', 'Quận 9', CURRENT_DATE),
        (gen_random_uuid(), 'QUA00010', 'Quận 10', CURRENT_DATE), 
        (gen_random_uuid(), 'QUA00011', 'Quận 11', CURRENT_DATE), 
        (gen_random_uuid(), 'QUA00012', 'Quận 12', CURRENT_DATE),
        (gen_random_uuid(), 'QUA00013', 'Quận Bình Thạnh', CURRENT_DATE), 
        (gen_random_uuid(), 'QUA00014', 'Quận Gò Vấp', CURRENT_DATE), 
        (gen_random_uuid(), 'QUA00015', 'Quận Tân Bình', CURRENT_DATE),
        (gen_random_uuid(), 'QUA00016', 'Quận Tân Phú', CURRENT_DATE), 
        (gen_random_uuid(), 'QUA00017', 'Quận Phú Nhuận', CURRENT_DATE), 
        (gen_random_uuid(), 'QUA00018', 'Quận Thủ Đức', CURRENT_DATE),
        (gen_random_uuid(), 'QUA00019', 'Quận Bình Tân', CURRENT_DATE), 
        (gen_random_uuid(), 'QUA00020', 'Huyện Củ Chi', CURRENT_DATE)
    RETURNING IDQuan, TenQuan
),
-- Insert into MATHANG using the DONVITINH CTE with more realistic products and quantities
inserted_mathang AS (
    INSERT INTO inventory.MATHANG (IDMatHang, MaMatHang, TenMatHang, IDDonViTinh, SoLuongTon)
    SELECT
        gen_random_uuid(), 'MHH00001', 'Gạo Nàng Hương', IDDonViTinh, floor(random() * 2000) + 500 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Kg'
    UNION ALL
    SELECT
        gen_random_uuid(), 'MHH00002', 'Sữa tươi Vinamilk', IDDonViTinh, floor(random() * 1000) + 200 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Lít'
    UNION ALL
    SELECT
        gen_random_uuid(), 'MHH00003', 'Bánh Oreo', IDDonViTinh, floor(random() * 500) + 100 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Hộp'
    UNION ALL
    SELECT
        gen_random_uuid(), 'MHH00004', 'Tivi Samsung 55"', IDDonViTinh, floor(random() * 50) + 10 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Cái'
    UNION ALL
    SELECT
        gen_random_uuid(), 'MHH00005', 'Bia Tiger', IDDonViTinh, floor(random() * 200) + 50 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Thùng'
    UNION ALL
    SELECT
        gen_random_uuid(), 'MHH00006', 'Nước mắm Nam Ngư', IDDonViTinh, floor(random() * 300) + 150 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Chai'
    UNION ALL
    SELECT
        gen_random_uuid(), 'MHH00007', 'Mì tôm Hảo Hảo', IDDonViTinh, floor(random() * 1000) + 500 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Gói'
    UNION ALL
    SELECT
        gen_random_uuid(), 'MHH00008', 'Nước ngọt Coca Cola', IDDonViTinh, floor(random() * 800) + 300 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Lon'
    UNION ALL
    SELECT
        gen_random_uuid(), 'MHH00009', 'Dầu ăn Neptune', IDDonViTinh, floor(random() * 400) + 100 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Lít'
    UNION ALL
    SELECT
        gen_random_uuid(), 'MHH00010', 'Sữa đặc Ông Thọ', IDDonViTinh, floor(random() * 600) + 200 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Hộp'
    RETURNING IDMatHang, TenMatHang
),
-- Insert into DAILY using the LOAIDAILY and QUAN CTEs with realistic dates and improved data variation
inserted_daily AS (
    INSERT INTO inventory.DAILY (IDDaiLy, MaDaiLy, TenDaiLy, SoDienThoai, DiaChi, Email, IDLoaiDaiLy, IDQuan, NgayTiepNhan)
    SELECT
        gen_random_uuid(), 'DL00001', 'Đại lý Phương Nam', '0901234567', '123 Lê Lợi', 'phuongnam@example.com',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận 1'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00002', 'Siêu thị Mini Tân Phát', '0912345678', '456 Trần Hưng Đạo', 'tanphat@example.com',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận 2'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00003', 'Cửa hàng Tiện Lợi 24/7', '0923456789', '789 Nguyễn Huệ', 'tienloi247@example.com',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận 1'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00004', 'Đại lý Kim Cương', '0934567890', '101 Điện Biên Phủ', 'kimcuong@example.com',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận 3'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00005', 'Tạp hóa Minh Tâm', '0945678901', '202 Võ Văn Tần', 'minhtam@example.com',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận 4'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00006', 'Đại lý Thành Công', '0966112233', '15 Nguyễn Văn Bảo', 'thanhcong@email.com',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận Gò Vấp'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00007', 'Cửa hàng Thịnh Vượng', '0977445566', '99 Võ Văn Ngân', 'thinhvuong@mail.vn',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận Thủ Đức'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00008', 'Chi nhánh Phát Đạt', '0988778899', '34 Điện Biên Phủ', 'phatdat@company.net',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận Bình Thạnh'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00009', 'Đại lý Tân Tiến', '0999009900', '1A Trường Chinh', 'tantien@service.org',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận 12'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00010', 'Siêu thị mini Hạnh Phúc', '0911223344', '123 Trần Hưng Đạo', 'hanhphuc@any.com',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận 5'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00011', 'Đại lý Phú Quý', '0922334455', '456 Lê Văn Lương', 'phuquy@best.info',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận 7'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00012', 'Cửa hàng Tân Phước', '0933445566', '789 3 Tháng 2', 'tanphuoc@good.co.in',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận 11'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00013', 'Tạp hóa Phú Mỹ', '0944556677', '101 Nguyễn Trãi', 'phumy@perfect.org',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận 8'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00014', 'Đại lý Hoàng Kim', '0955667788', '202 Cách Mạng Tháng 8', 'hoangkim@excellent.com',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận 10'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00015', 'Cửa hàng Như Ý', '0966778899', '303 Trần Phú', 'nhuy@finest.net',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận 1'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00016', 'Đại lý Tấn Phát', '0977889900', '404 Lê Văn Sỹ', 'tanphat@supreme.co',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận 3'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00017', 'Siêu thị mini Phúc Lộc', '0988990011', '505 Hậu Giang', 'phucloc@ultimate.org',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận 6'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00018', 'Cửa hàng An Phát', '0999112233', '606 Nguyễn Thị Minh Khai', 'anphat@pinnacle.com',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận Tân Bình'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'DL00019', 'Đại lý Tiến Phát', '0911223344', '707 Hoàng Diệu', 'tienphat@zenith.net',
        (SELECT IDLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT IDQuan FROM inserted_quan WHERE TenQuan = 'Quận 4'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    RETURNING IDDaiLy, TenDaiLy
),
-- Insert into PHIEUXUAT table with realistic values
inserted_phieuxuat AS (
    WITH random_dates AS (
        SELECT (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date as random_date
        FROM generate_series(1, 15)
    ),
    random_values AS (
        SELECT floor(random() * 9000000) + 1000000 as random_value
        FROM generate_series(1, 15)
    )
    INSERT INTO inventory.PHIEUXUAT (IDPhieuXuat, MaPhieuXuat, IDDaiLy, NgayLap, TongGiaTri)
    SELECT
        gen_random_uuid(),
        'PX' || LPAD(row_number() OVER()::TEXT, 5, '0'),
        d.IDDaiLy,
        rd.random_date,
        rv.random_value
    FROM 
        inserted_daily d,
        random_dates rd,
        random_values rv
    WHERE random() < 0.3
    LIMIT 15
    RETURNING IDPhieuXuat, IDDaiLy, NgayLap, TongGiaTri
),
-- Generate realistic CTPHIEUXUAT entries
inserted_ctphieuxuat AS (
    INSERT INTO inventory.CTPHIEUXUAT (IDPhieuXuat, IDMatHang, SoLuongXuat, DonGiaXuat, ThanhTien)
    SELECT
        px.IDPhieuXuat,
        mh.IDMatHang,
        floor(random() * 50) + 1 as SoLuongXuat,
        floor(random() * 500000) + 10000 as DonGiaXuat,
        0 as ThanhTien
    FROM 
        inserted_phieuxuat px,
        inserted_mathang mh
    WHERE random() < 0.3
    LIMIT 50
    RETURNING *
),
-- Update ThanhTien in CTPHIEUXUAT to be consistent with SoLuongXuat and DonGiaXuat
updated_ctphieuxuat AS (
    UPDATE inventory.CTPHIEUXUAT
    SET ThanhTien = SoLuongXuat * DonGiaXuat
    WHERE IDPhieuXuat IN (SELECT IDPhieuXuat FROM inserted_ctphieuxuat)
    RETURNING *
),
-- Update TongGiaTri in PHIEUXUAT to match sum of ThanhTien in CTPHIEUXUAT
updated_phieuxuat AS (
    UPDATE inventory.PHIEUXUAT px
    SET TongGiaTri = (
        SELECT COALESCE(SUM(ThanhTien), 0)
        FROM inventory.CTPHIEUXUAT
        WHERE IDPhieuXuat = px.IDPhieuXuat
    )
    WHERE IDPhieuXuat IN (SELECT IDPhieuXuat FROM inserted_phieuxuat)
    RETURNING *
)
-- Insert into PHIEUTHU with realistic and consistent data
INSERT INTO inventory.PHIEUTHU (IDPhieuThu, MaPhieuThu, IDDaiLy, NgayThuTien, SoTienThu)
SELECT
    gen_random_uuid(),
    'PT' || LPAD(row_number() OVER()::TEXT, 5, '0'),
    px.IDDaiLy,
    (px.NgayLap + (random() * 30)::int * INTERVAL '1 day')::date as NgayThuTien,
    floor(px.TongGiaTri * (random() * 0.7 + 0.3)) as SoTienThu
FROM 
    updated_phieuxuat px
WHERE random() < 0.7;

-- Insert into THAMSO (if not already exists)
INSERT INTO inventory.THAMSO (IDThamSo, MaThamSo, SoLuongDaiLyToiDa, QuyDinhTienThuTienNo) 
VALUES (gen_random_uuid(), 'TS00001', 4, 1)
ON CONFLICT DO NOTHING;

-- Update ID_TRACKER with maximum values
UPDATE inventory.ID_TRACKER
SET
    MaDaiLyCuoi = 19,
    MaDonViTinhCuoi = 8,
    MaLoaiDaiLyCuoi = 3,
    MaQuanCuoi = 20,
    MaMatHangCuoi = 10,
    MaPhieuThuCuoi = (SELECT COUNT(*) FROM inventory.PHIEUTHU),
    MaPhieuXuatCuoi = 15;

-- Create indexes for better performance
CREATE index ASYNC IF NOT EXISTS idx_daily_loaidaily ON inventory.DAILY (IDLoaiDaiLy);
CREATE index ASYNC IF NOT EXISTS idx_daily_quan ON inventory.DAILY (IDQuan);
CREATE index ASYNC IF NOT EXISTS idx_phieuxuat_daily ON inventory.PHIEUXUAT (IDDaiLy);
CREATE index ASYNC IF NOT EXISTS idx_ctphieuxuat_mathang ON inventory.CTPHIEUXUAT (IDMatHang);

-- Create additional indexes for Ma* fields for faster lookups
CREATE index ASYNC IF NOT EXISTS idx_daily_madaily ON inventory.DAILY (MaDaiLy);
CREATE index ASYNC IF NOT EXISTS idx_loaidaily_maloaidaily ON inventory.LOAIDAILY (MaLoaiDaiLy);
CREATE index ASYNC IF NOT EXISTS idx_quan_maquan ON inventory.QUAN (MaQuan);
CREATE index ASYNC IF NOT EXISTS idx_mathang_mamathang ON inventory.MATHANG (MaMatHang);
CREATE index ASYNC IF NOT EXISTS idx_donvitinh_madonvitinh ON inventory.DONVITINH (MaDonViTinh);
CREATE index ASYNC IF NOT EXISTS idx_phieuxuat_maphieuxuat ON inventory.PHIEUXUAT (MaPhieuXuat);
CREATE index ASYNC IF NOT EXISTS idx_phieuthu_maphieuthu ON inventory.PHIEUTHU (MaPhieuThu);