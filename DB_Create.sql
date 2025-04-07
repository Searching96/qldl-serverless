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

-- Insert initial records
INSERT INTO inventory.THAMSO (MaThamSo, SoLuongDaiLyToiDa, QuyDinhTienThuTienNo)
VALUES ('TS00001', 4, 1);

INSERT INTO inventory.ID_TRACKER DEFAULT VALUES;

-- Insert data into all tables
-- DONVITINH
INSERT INTO inventory.DONVITINH (MaDonViTinh, TenDonViTinh)
SELECT
    'DVT' || LPAD((row_number() OVER ())::TEXT, 5, '0'),
    data.TenDonViTinh
FROM (VALUES
    ('Cái'), ('Hộp'), ('Thùng'), ('Kg'), ('Lít'), ('Chai'), ('Gói'), ('Lon'),
    ('Bịch'), ('Cuộn'), ('Bó'), ('Cây'), ('Bao')
) AS data (TenDonViTinh);

-- LOAIDAILY
INSERT INTO inventory.LOAIDAILY (MaLoaiDaiLy, TenLoaiDaiLy, NoToiDa)
SELECT
    'LDL' || LPAD((row_number() OVER ())::TEXT, 5, '0'),
    data.TenLoaiDaiLy,
    data.NoToiDa
FROM (VALUES
    ('Loại 1', 20000000), ('Loại 2', 50000000), ('Loại 3', 100000000),
    ('Loại Đặc Biệt', 150000000), ('Loại Nhỏ', 10000000)
) AS data (TenLoaiDaiLy, NoToiDa);

-- QUAN
INSERT INTO inventory.QUAN (MaQuan, TenQuan, NgayTiepNhan)
SELECT
    'QUA' || LPAD((row_number() OVER ())::TEXT, 5, '0'),
    data.TenQuan,
    CURRENT_DATE
FROM (VALUES
    ('Quận 1'), ('Quận 2'), ('Quận 3'), ('Quận 4'), ('Quận 5'), ('Quận 6'),
    ('Quận 7'), ('Quận 8'), ('Quận 9'), ('Quận 10'), ('Quận 11'), ('Quận 12'),
    ('Quận Bình Thạnh'), ('Quận Gò Vấp'), ('Quận Tân Bình'),
    ('Quận Tân Phú'), ('Quận Phú Nhuận'), ('Quận Thủ Đức'),
    ('Quận Bình Tân'), ('Huyện Củ Chi')
) AS data (TenQuan);

-- MATHANG
INSERT INTO inventory.MATHANG (MaMatHang, TenMatHang, IDDonViTinh, SoLuongTon)
SELECT
    'MHH' || LPAD((row_number() OVER ())::TEXT, 5, '0'),
    data.TenMatHang,
    (SELECT IDDonViTinh FROM inventory.DONVITINH WHERE TenDonViTinh = data.Unit LIMIT 1),
    floor(random() * 5000) + 200
FROM (VALUES
    ('Gạo Nàng Hương', 'Kg'), ('Sữa tươi Vinamilk', 'Lít'), ('Bánh Oreo', 'Gói'), 
    ('Tivi Samsung 55"', 'Cái'), ('Bia Tiger', 'Lon'), ('Nước mắm Nam Ngư', 'Chai'), 
    ('Mì tôm Hảo Hảo', 'Gói'), ('Nước ngọt Coca Cola', 'Chai'), 
    ('Dầu ăn Neptune', 'Lít'), ('Sữa đặc Ông Thọ', 'Lon'),
    ('Bột giặt Omo', 'Bịch'), ('Nước rửa chén Sunlight', 'Chai'), 
    ('Dầu gội Head & Shoulders', 'Chai'), ('Kem đánh răng Colgate', 'Cái'),
    ('Bánh mì Toast', 'Gói'), ('Nước suối Aquafina', 'Chai'),
    ('Trứng gà', 'Hộp'), ('Thuốc lá 555', 'Bao'),
    ('Kẹo Alpenliebe', 'Gói'), ('Cà phê G7', 'Hộp'),
    ('Bimbim Lays', 'Gói'), ('Bia Heineken', 'Thùng')
) AS data (TenMatHang, Unit);

-- DAILY
INSERT INTO inventory.DAILY (MaDaiLy, TenDaiLy, SoDienThoai, DiaChi, Email, IDLoaiDaiLy, IDQuan, NgayTiepNhan)
SELECT
    'DL' || LPAD((row_number() OVER ())::TEXT, 5, '0'),
    data.TenDaiLy, data.SoDienThoai, data.DiaChi, data.Email,
    (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY ORDER BY random() LIMIT 1),
    (SELECT IDQuan FROM inventory.QUAN ORDER BY random() LIMIT 1),
    (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date
FROM (VALUES
    ('Đại lý Phương Nam', '0901234567', '123 Lê Lợi', 'phuongnam@example.com'),
    ('Siêu thị Mini Tân Phát', '0912345678', '456 Trần Hưng Đạo', 'tanphat@example.com'),
    ('Cửa hàng Tiện Lợi 24/7', '0923456789', '789 Nguyễn Huệ', 'tienloi247@example.com'),
    ('Đại lý Kim Cương', '0934567890', '101 Điện Biên Phủ', 'kimcuong@example.com'),
    ('Tạp hóa Minh Tâm', '0945678901', '202 Võ Văn Tần', 'minhtam@example.com'),
    ('Cửa hàng Đức Thịnh', '0876543210', '15 Phan Đình Phùng', 'ducthinhstore@example.com'),
    ('Tạp hóa Thành Tâm', '0965432109', '78 Nguyễn Đình Chiểu', 'thanhtam@example.com'),
    ('Siêu thị mini Nam An', '0954321098', '22 Trần Phú', 'naman@example.com'),
    ('Đại lý Hoàng Gia', '0943210987', '199 Lê Duẩn', 'hoanggia@example.com'),
    ('Tạp hóa Bình Minh', '0932109876', '55 Lý Thường Kiệt', 'binhminh@example.com'),
    ('Cửa hàng Quốc Thái', '0921098765', '33 Bàu Cát', 'quocthai@example.com'),
    ('Đại lý Phước Lộc', '0910987654', '97 Lê Hồng Phong', 'phuocloc@example.com'),
    ('Tiệm tạp hóa Phương Đông', '0898765432', '44 Võ Thị Sáu', 'phuongdong@example.com'),
    ('Đại lý Thái Nguyên', '0887654321', '112 Lý Thái Tổ', 'thainguyen@example.com'),
    ('Cửa hàng Hiệp Thành', '0976543210', '201 Minh Phụng', 'hiepthanh@example.com'),
    ('Tạp hóa Thiên Phúc', '0995432109', '63 Tùng Thiện Vương', 'thienphuc@example.com'),
    ('Siêu thị mini Gia Phát', '0984321098', '15 Phan Huy Ích', 'giaphat@example.com'),
    ('Đại lý Thiên An', '0973210987', '88 Âu Cơ', 'thienan@example.com'),
    ('Tạp hóa Tấn Lợi', '0962109876', '132 Tô Hiến Thành', 'tanloi@example.com'),
    ('Cửa hàng Thái Hòa', '0951098765', '275 Hậu Giang', 'thaihoa@example.com')
) AS data (TenDaiLy, SoDienThoai, DiaChi, Email);

-- PHIEUXUAT
INSERT INTO inventory.PHIEUXUAT (MaPhieuXuat, IDDaiLy, NgayLap, TongGiaTri)
SELECT
    'PX' || LPAD((row_number() OVER ())::TEXT, 5, '0'),
    IDDaiLy,
    (DATE '2023-01-01' + (random() * 365)::int * INTERVAL '1 day')::date,
    0 -- Placeholder, will be updated later
FROM inventory.DAILY
WHERE random() < 0.5
LIMIT 10;

-- CTPHIEUXUAT
INSERT INTO inventory.CTPHIEUXUAT (IDPhieuXuat, IDMatHang, SoLuongXuat, DonGiaXuat, ThanhTien)
SELECT
    px.IDPhieuXuat,
    mh.IDMatHang,
    floor(random() * 50) + 1 AS SoLuongXuat,
    floor(random() * 500000) + 10000 AS DonGiaXuat,
    0 -- Placeholder, will be updated
FROM inventory.PHIEUXUAT px
CROSS JOIN inventory.MATHANG mh
WHERE random() < 0.3
LIMIT 30;

-- Update ThanhTien in CTPHIEUXUAT
UPDATE inventory.CTPHIEUXUAT
SET ThanhTien = SoLuongXuat * DonGiaXuat;

-- Update TongGiaTri in PHIEUXUAT
UPDATE inventory.PHIEUXUAT px
SET TongGiaTri = (
    SELECT COALESCE(SUM(ThanhTien), 0)
    FROM inventory.CTPHIEUXUAT
    WHERE IDPhieuXuat = px.IDPhieuXuat
);

-- Update SoLuongTon in MATHANG
UPDATE inventory.MATHANG mh
SET SoLuongTon = SoLuongTon - (
    SELECT COALESCE(SUM(SoLuongXuat), 0)
    FROM inventory.CTPHIEUXUAT
    WHERE IDMatHang = mh.IDMatHang
);

-- Update CongNo in DAILY based on PHIEUXUAT
UPDATE inventory.DAILY d
SET CongNo = CongNo + (
    SELECT COALESCE(SUM(TongGiaTri), 0)
    FROM inventory.PHIEUXUAT
    WHERE IDDaiLy = d.IDDaiLy
);

-- PHIEUTHU
INSERT INTO inventory.PHIEUTHU (MaPhieuThu, IDDaiLy, NgayThuTien, SoTienThu)
SELECT
    'PT' || LPAD((row_number() OVER ())::TEXT, 5, '0'),
    px.IDDaiLy,
    (px.NgayLap + (random() * 30)::int * INTERVAL '1 day')::date,
    floor(px.TongGiaTri * (random() * 0.7 + 0.3)) AS SoTienThu
FROM inventory.PHIEUXUAT px
WHERE random() < 0.7
LIMIT 8;

-- Update CongNo in DAILY based on PHIEUTHU
UPDATE inventory.DAILY d
SET CongNo = CongNo - (
    SELECT COALESCE(SUM(SoTienThu), 0)
    FROM inventory.PHIEUTHU
    WHERE IDDaiLy = d.IDDaiLy
);

-- Update ID_TRACKER with maximum values after all insertions
UPDATE inventory.ID_TRACKER
SET
    MaDonViTinhCuoi = (SELECT COALESCE(MAX(CAST(SUBSTRING(MaDonViTinh, 4) AS INTEGER)), 0) FROM inventory.DONVITINH),
    MaLoaiDaiLyCuoi = (SELECT COALESCE(MAX(CAST(SUBSTRING(MaLoaiDaiLy, 4) AS INTEGER)), 0) FROM inventory.LOAIDAILY),
    MaQuanCuoi = (SELECT COALESCE(MAX(CAST(SUBSTRING(MaQuan, 4) AS INTEGER)), 0) FROM inventory.QUAN),
    MaMatHangCuoi = (SELECT COALESCE(MAX(CAST(SUBSTRING(MaMatHang, 4) AS INTEGER)), 0) FROM inventory.MATHANG),
    MaDaiLyCuoi = (SELECT COALESCE(MAX(CAST(SUBSTRING(MaDaiLy, 3) AS INTEGER)), 0) FROM inventory.DAILY),
    MaPhieuThuCuoi = (SELECT COALESCE(MAX(CAST(SUBSTRING(MaPhieuThu, 3) AS INTEGER)), 0) FROM inventory.PHIEUTHU),
    MaPhieuXuatCuoi = (SELECT COALESCE(MAX(CAST(SUBSTRING(MaPhieuXuat, 3) AS INTEGER)), 0) FROM inventory.PHIEUXUAT);

-- Create indexes for better performance
CREATE index ASYNC IF NOT EXISTS idx_daily_loaidaily ON inventory.DAILY (IDLoaiDaiLy);
CREATE index ASYNC IF NOT EXISTS idx_daily_quan ON inventory.DAILY (IDQuan);
CREATE index ASYNC IF NOT EXISTS idx_phieuxuat_daily ON inventory.PHIEUXUAT (IDDaiLy);
CREATE index ASYNC IF NOT EXISTS idx_ctphieuxuat_mathang ON inventory.CTPHIEUXUAT (IDMatHang);