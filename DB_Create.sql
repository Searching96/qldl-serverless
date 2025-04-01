-- Drop the schema and all its objects
DROP SCHEMA IF EXISTS inventory CASCADE;

-- Recreate the schema
CREATE SCHEMA inventory;

-- Create tables
CREATE TABLE inventory.DONVITINH (
    MaDonViTinh VARCHAR(36) PRIMARY KEY,
    TenDonViTinh VARCHAR(50),
    DeletedAt TIMESTAMP DEFAULT NULL
);

CREATE TABLE inventory.LOAIDAILY (
    MaLoaiDaiLy VARCHAR(36) PRIMARY KEY,
    TenLoaiDaiLy VARCHAR(50),
    NoToiDa INTEGER,
    DeletedAt TIMESTAMP DEFAULT NULL
);

CREATE TABLE inventory.QUAN (
    MaQuan VARCHAR(36) PRIMARY KEY,
    TenQuan VARCHAR(50),
    NgayTiepNhan DATE,
    NoDaiLy INTEGER,
    DeletedAt TIMESTAMP DEFAULT NULL
);

CREATE TABLE inventory.MATHANG (
    MaMatHang VARCHAR(36) PRIMARY KEY,
    TenMatHang VARCHAR(100),
    MaDonViTinh VARCHAR(36),
    SoLuongTon INTEGER,
    DeletedAt TIMESTAMP DEFAULT NULL
);

CREATE TABLE inventory.DAILY (
    MaDaiLy VARCHAR(36) PRIMARY KEY,
    TenDaiLy VARCHAR(100),
    SoDienThoai VARCHAR(15),
    DiaChi VARCHAR(200),
    Email VARCHAR(100),
    MaLoaiDaiLy VARCHAR(36),
    MaQuan VARCHAR(36),
    NgayTiepNhan DATE,
    CongNo INTEGER DEFAULT 0,
    DeletedAt TIMESTAMP DEFAULT NULL
);

CREATE TABLE inventory.PHIEUTHU (
    MaPhieuThu VARCHAR(36) PRIMARY KEY,
    MaDaiLy VARCHAR(36),
    NgayThuTien DATE,
    SoTienThu INTEGER,
    DeletedAt TIMESTAMP DEFAULT NULL
);

CREATE TABLE inventory.PHIEUXUAT (
    MaPhieuXuat VARCHAR(36) PRIMARY KEY,
    MaDaiLy VARCHAR(36),
    NgayLap DATE,
    TongGiaTri INTEGER,
    DeletedAt TIMESTAMP DEFAULT NULL
);

CREATE TABLE inventory.CTPHIEUXUAT (
    MaPhieuXuat VARCHAR(36),
    MaMatHang VARCHAR(36),
    SoLuongXuat INTEGER,
    DonGiaXuat INTEGER,
    ThanhTien INTEGER,
    DeletedAt TIMESTAMP DEFAULT NULL,
    PRIMARY KEY (MaPhieuXuat, MaMatHang)
);

CREATE TABLE inventory.THAMSO (
    SoLuongDaiLyToiDa INTEGER,
    QuyDinhTienThuTienNo INTEGER
);

-- Create a single script that properly handles random UUID generation with realistic data
-- Use CTEs to create and reference UUIDs between related tables

-- Insert into DONVITINH, LOAIDAILY, and QUAN tables with CTEs
WITH inserted_donvitinh AS (
    INSERT INTO inventory.DONVITINH (MaDonViTinh, TenDonViTinh)
    VALUES
        (gen_random_uuid(), 'Cái'),
        (gen_random_uuid(), 'Hộp'),
        (gen_random_uuid(), 'Thùng'),
        (gen_random_uuid(), 'Kg'),
        (gen_random_uuid(), 'Lít'),
        (gen_random_uuid(), 'Chai'),
        (gen_random_uuid(), 'Gói'),
        (gen_random_uuid(), 'Lon')
    RETURNING MaDonViTinh, TenDonViTinh
),
inserted_loaidaily AS (
    INSERT INTO inventory.LOAIDAILY (MaLoaiDaiLy, TenLoaiDaiLy, NoToiDa)
    VALUES
        (gen_random_uuid(), 'Loại 1', 20000000),
        (gen_random_uuid(), 'Loại 2', 50000000),
        (gen_random_uuid(), 'Loại 3', 100000000)
    RETURNING MaLoaiDaiLy, TenLoaiDaiLy
),
inserted_quan AS (
    INSERT INTO inventory.QUAN (MaQuan, TenQuan)
    VALUES
        (gen_random_uuid(), 'Quận 1'), (gen_random_uuid(), 'Quận 2'), (gen_random_uuid(), 'Quận 3'),
        (gen_random_uuid(), 'Quận 4'), (gen_random_uuid(), 'Quận 5'), (gen_random_uuid(), 'Quận 6'),
        (gen_random_uuid(), 'Quận 7'), (gen_random_uuid(), 'Quận 8'), (gen_random_uuid(), 'Quận 9'),
        (gen_random_uuid(), 'Quận 10'), (gen_random_uuid(), 'Quận 11'), (gen_random_uuid(), 'Quận 12'),
        (gen_random_uuid(), 'Quận Bình Thạnh'), (gen_random_uuid(), 'Quận Gò Vấp'), (gen_random_uuid(), 'Quận Tân Bình'),
        (gen_random_uuid(), 'Quận Tân Phú'), (gen_random_uuid(), 'Quận Phú Nhuận'), (gen_random_uuid(), 'Quận Thủ Đức'),
        (gen_random_uuid(), 'Quận Bình Tân'), (gen_random_uuid(), 'Huyện Củ Chi')
    RETURNING MaQuan, TenQuan
),
-- Insert into MATHANG using the DONVITINH CTE with more realistic products and quantities
inserted_mathang AS (
    INSERT INTO inventory.MATHANG (MaMatHang, TenMatHang, MaDonViTinh, SoLuongTon)
    SELECT
        gen_random_uuid(), 'Gạo Nàng Hương', MaDonViTinh, floor(random() * 2000) + 500 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Kg'
    UNION ALL
    SELECT
        gen_random_uuid(), 'Sữa tươi Vinamilk', MaDonViTinh, floor(random() * 1000) + 200 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Lít'
    UNION ALL
    SELECT
        gen_random_uuid(), 'Bánh Oreo', MaDonViTinh, floor(random() * 500) + 100 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Hộp'
    UNION ALL
    SELECT
        gen_random_uuid(), 'Tivi Samsung 55"', MaDonViTinh, floor(random() * 50) + 10 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Cái'
    UNION ALL
    SELECT
        gen_random_uuid(), 'Bia Tiger', MaDonViTinh, floor(random() * 200) + 50 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Thùng'
    UNION ALL
    SELECT
        gen_random_uuid(), 'Nước mắm Nam Ngư', MaDonViTinh, floor(random() * 300) + 150 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Chai'
    UNION ALL
    SELECT
        gen_random_uuid(), 'Mì tôm Hảo Hảo', MaDonViTinh, floor(random() * 1000) + 500 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Gói'
    UNION ALL
    SELECT
        gen_random_uuid(), 'Nước ngọt Coca Cola', MaDonViTinh, floor(random() * 800) + 300 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Lon'
    UNION ALL
    SELECT
        gen_random_uuid(), 'Dầu ăn Neptune', MaDonViTinh, floor(random() * 400) + 100 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Lít'
    UNION ALL
    SELECT
        gen_random_uuid(), 'Sữa đặc Ông Thọ', MaDonViTinh, floor(random() * 600) + 200 
        FROM inserted_donvitinh WHERE TenDonViTinh = 'Hộp'
    RETURNING MaMatHang, TenMatHang
),
-- Insert into DAILY using the LOAIDAILY and QUAN CTEs with realistic dates and improved data variation
inserted_daily AS (
    INSERT INTO inventory.DAILY (MaDaiLy, TenDaiLy, SoDienThoai, DiaChi, Email, MaLoaiDaiLy, MaQuan, NgayTiepNhan)
    SELECT
        gen_random_uuid(), 'Đại lý Phương Nam', '0901234567', '123 Lê Lợi', 'phuongnam@example.com',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận 1'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Siêu thị Mini Tân Phát', '0912345678', '456 Trần Hưng Đạo', 'tanphat@example.com',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận 2'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Cửa hàng Tiện Lợi 24/7', '0923456789', '789 Nguyễn Huệ', 'tienloi247@example.com',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận 1'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Đại lý Kim Cương', '0934567890', '101 Điện Biên Phủ', 'kimcuong@example.com',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận 3'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Tạp hóa Minh Tâm', '0945678901', '202 Võ Văn Tần', 'minhtam@example.com',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận 4'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Đại lý Thành Công', '0966112233', '15 Nguyễn Văn Bảo', 'thanhcong@email.com',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận Gò Vấp'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Cửa hàng Thịnh Vượng', '0977445566', '99 Võ Văn Ngân', 'thinhvuong@mail.vn',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận Thủ Đức'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Chi nhánh Phát Đạt', '0988778899', '34 Điện Biên Phủ', 'phatdat@company.net',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận Bình Thạnh'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Đại lý Tân Tiến', '0999009900', '1A Trường Chinh', 'tantien@service.org',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận 12'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Siêu thị mini Hạnh Phúc', '0911223344', '123 Trần Hưng Đạo', 'hanhphuc@any.com',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận 5'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Đại lý Phú Quý', '0922334455', '456 Lê Văn Lương', 'phuquy@best.info',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận 7'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Cửa hàng Tân Phước', '0933445566', '789 3 Tháng 2', 'tanphuoc@good.co.in',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận 11'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Tạp hóa Phú Mỹ', '0944556677', '101 Nguyễn Trãi', 'phumy@perfect.org',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận 8'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Đại lý Hoàng Kim', '0955667788', '202 Cách Mạng Tháng 8', 'hoangkim@excellent.com',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận 10'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Cửa hàng Như Ý', '0966778899', '303 Trần Phú', 'nhuy@finest.net',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận 1'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Đại lý Tấn Phát', '0977889900', '404 Lê Văn Sỹ', 'tanphat@supreme.co',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận 3'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Siêu thị mini Phúc Lộc', '0988990011', '505 Hậu Giang', 'phucloc@ultimate.org',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận 6'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Cửa hàng An Phát', '0999112233', '606 Nguyễn Thị Minh Khai', 'anphat@pinnacle.com',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận Tân Bình'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    UNION ALL
    SELECT
        gen_random_uuid(), 'Đại lý Tiến Phát', '0911223344', '707 Hoàng Diệu', 'tienphat@zenith.net',
        (SELECT MaLoaiDaiLy FROM inserted_loaidaily ORDER BY random() LIMIT 1),
        (SELECT MaQuan FROM inserted_quan WHERE TenQuan = 'Quận 4'),
        (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
    RETURNING MaDaiLy, TenDaiLy
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
    INSERT INTO inventory.PHIEUXUAT (MaPhieuXuat, MaDaiLy, NgayLap, TongGiaTri)
    SELECT
        gen_random_uuid(),
        MaDaiLy,
        d.random_date,
        v.random_value
    FROM 
        inserted_daily,
        random_dates d,
        random_values v
    WHERE random() < 0.3
    LIMIT 15
    RETURNING MaPhieuXuat, MaDaiLy, NgayLap, TongGiaTri
),
-- Generate realistic CTPHIEUXUAT entries
inserted_ctphieuxuat AS (
    INSERT INTO inventory.CTPHIEUXUAT (MaPhieuXuat, MaMatHang, SoLuongXuat, DonGiaXuat, ThanhTien)
    SELECT
        px.MaPhieuXuat,
        mh.MaMatHang,
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
    WHERE MaPhieuXuat IN (SELECT MaPhieuXuat FROM inserted_ctphieuxuat)
    RETURNING *
),
-- Update TongGiaTri in PHIEUXUAT to match sum of ThanhTien in CTPHIEUXUAT
updated_phieuxuat AS (
    UPDATE inventory.PHIEUXUAT px
    SET TongGiaTri = (
        SELECT SUM(ThanhTien)
        FROM inventory.CTPHIEUXUAT
        WHERE MaPhieuXuat = px.MaPhieuXuat
    )
    WHERE MaPhieuXuat IN (SELECT MaPhieuXuat FROM inserted_phieuxuat)
    RETURNING *
)
-- Insert into PHIEUTHU with realistic and consistent data
INSERT INTO inventory.PHIEUTHU (MaPhieuThu, MaDaiLy, NgayThuTien, SoTienThu)
SELECT
    gen_random_uuid(),
    px.MaDaiLy,
    (px.NgayLap + (random() * 30)::int * INTERVAL '1 day')::date as NgayThuTien,
    floor(px.TongGiaTri * (random() * 0.7 + 0.3)) as SoTienThu
FROM 
    updated_phieuxuat px
WHERE random() < 0.7;

-- Insert into THAMSO (if not already exists)
INSERT INTO inventory.THAMSO (SoLuongDaiLyToiDa, QuyDinhTienThuTienNo) 
VALUES (4, 1)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX ASYNC IF NOT EXISTS idx_daily_loaidaily ON inventory.DAILY (MaLoaiDaiLy);
CREATE INDEX ASYNC IF NOT EXISTS idx_daily_quan ON inventory.DAILY (MaQuan);
CREATE INDEX ASYNC IF NOT EXISTS idx_phieuxuat_daily ON inventory.PHIEUXUAT (MaDaiLy);
CREATE INDEX ASYNC IF NOT EXISTS idx_ctphieuxuat_mathang ON inventory.CTPHIEUXUAT (MaMatHang);