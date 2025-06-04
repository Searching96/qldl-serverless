-- =========================
-- INVENTORY MANAGEMENT SYSTEM - PART 1: SCHEMA & INITIAL DATA
-- Current Date: 2025-06-03 17:34:51 UTC
-- User: thinh0704hcm
-- =========================

-- =========================
-- 1. SCHEMA DROP & CREATE
-- =========================
BEGIN;
DROP SCHEMA IF EXISTS inventory CASCADE;
COMMIT;

BEGIN;
CREATE SCHEMA inventory;
COMMIT;

-- =========================
-- 2. TABLES
-- =========================
BEGIN;
CREATE TABLE inventory.DONVITINH (
    IDDonViTinh UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    MaDonViTinh VARCHAR(8) UNIQUE,
    TenDonViTinh VARCHAR(50) NOT NULL,
    DeletedAt TIMESTAMP DEFAULT NULL
);
COMMIT;

BEGIN;
CREATE TABLE inventory.LOAIDAILY (
    IDLoaiDaiLy UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    MaLoaiDaiLy VARCHAR(8) UNIQUE,
    TenLoaiDaiLy VARCHAR(50) NOT NULL,
    NoToiDa INTEGER NOT NULL,
    DeletedAt TIMESTAMP DEFAULT NULL
);
COMMIT;

BEGIN;
CREATE TABLE inventory.QUAN (
    IDQuan UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    MaQuan VARCHAR(8) UNIQUE,
    TenQuan VARCHAR(50) NOT NULL,
    NgayTiepNhan DATE,
    NoDaiLy INTEGER DEFAULT 0,  -- Static value - set during data insertion
    DeletedAt TIMESTAMP DEFAULT NULL
);
COMMIT;

BEGIN;
CREATE TABLE inventory.MATHANG (
    IDMatHang UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    MaMatHang VARCHAR(8) UNIQUE,
    TenMatHang VARCHAR(100) NOT NULL,
    IDDonViTinh UUID NOT NULL,
    SoLuongTon INTEGER NOT NULL,
    DeletedAt TIMESTAMP DEFAULT NULL
);
COMMIT;

BEGIN;
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
    CongNo INTEGER DEFAULT 0,  -- AGGREGATE COLUMN - will be calculated in Part 2
    DeletedAt TIMESTAMP DEFAULT NULL
);
COMMIT;

BEGIN;
CREATE TABLE inventory.PHIEUTHU (
    IDPhieuThu UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    MaPhieuThu VARCHAR(8) UNIQUE,
    IDDaiLy UUID NOT NULL,
    NgayThuTien DATE NOT NULL,
    SoTienThu INTEGER NOT NULL,
    DeletedAt TIMESTAMP DEFAULT NULL
);
COMMIT;

BEGIN;
CREATE TABLE inventory.PHIEUXUAT (
    IDPhieuXuat UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    MaPhieuXuat VARCHAR(8) UNIQUE,
    IDDaiLy UUID NOT NULL,
    NgayLap DATE NOT NULL,
    TongGiaTri INTEGER DEFAULT 0,  -- AGGREGATE COLUMN - will be calculated in Part 2
    DeletedAt TIMESTAMP DEFAULT NULL
);
COMMIT;

BEGIN;
CREATE TABLE inventory.CTPHIEUXUAT (
    IDPhieuXuat UUID,
    IDMatHang UUID,
    SoLuongXuat INTEGER NOT NULL,
    DonGiaXuat INTEGER NOT NULL,
    ThanhTien INTEGER DEFAULT 0,  -- AGGREGATE COLUMN - will be calculated in Part 2
    DeletedAt TIMESTAMP DEFAULT NULL,
    PRIMARY KEY (IDPhieuXuat, IDMatHang)
);
COMMIT;

BEGIN;
CREATE TABLE inventory.THAMSO (
    IDThamSo UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    MaThamSo VARCHAR(8) UNIQUE,
    SoLuongDaiLyToiDa INTEGER NOT NULL,
    QuyDinhTienThuTienNo INTEGER NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DeletedAt TIMESTAMP DEFAULT NULL
);
COMMIT;

BEGIN;
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
COMMIT;

-- =========================
-- 3. INDEXES
-- =========================
BEGIN; CREATE INDEX ASYNC IF NOT EXISTS idx_daily_loaidaily ON inventory.DAILY (IDLoaiDaiLy); COMMIT;
BEGIN; CREATE INDEX ASYNC IF NOT EXISTS idx_daily_quan ON inventory.DAILY (IDQuan); COMMIT;
BEGIN; CREATE INDEX ASYNC IF NOT EXISTS idx_phieuxuat_daily ON inventory.PHIEUXUAT (IDDaiLy); COMMIT;
BEGIN; CREATE INDEX ASYNC IF NOT EXISTS idx_ctphieuxuat_mathang ON inventory.CTPHIEUXUAT (IDMatHang); COMMIT;
BEGIN; CREATE INDEX ASYNC IF NOT EXISTS idx_daily_madaily ON inventory.DAILY (MaDaiLy); COMMIT;
BEGIN; CREATE INDEX ASYNC IF NOT EXISTS idx_loaidaily_maloaidaily ON inventory.LOAIDAILY (MaLoaiDaiLy); COMMIT;
BEGIN; CREATE INDEX ASYNC IF NOT EXISTS idx_quan_maquan ON inventory.QUAN (MaQuan); COMMIT;
BEGIN; CREATE INDEX ASYNC IF NOT EXISTS idx_mathang_mamathang ON inventory.MATHANG (MaMatHang); COMMIT;
BEGIN; CREATE INDEX ASYNC IF NOT EXISTS idx_donvitinh_madonvitinh ON inventory.DONVITINH (MaDonViTinh); COMMIT;
BEGIN; CREATE INDEX ASYNC IF NOT EXISTS idx_phieuxuat_maphieuxuat ON inventory.PHIEUXUAT (MaPhieuXuat); COMMIT;
BEGIN; CREATE INDEX ASYNC IF NOT EXISTS idx_phieuthu_maphieuthu ON inventory.PHIEUTHU (MaPhieuThu); COMMIT;

-- =========================
-- 4. INITIAL DATA
-- =========================

-- ID TRACKER
BEGIN;
INSERT INTO inventory.ID_TRACKER DEFAULT VALUES;
COMMIT;

-- Đơn vị tính
BEGIN;
INSERT INTO inventory.DONVITINH (MaDonViTinh, TenDonViTinh) VALUES
('DVT00001', 'Cái'),
('DVT00002', 'Hộp'),
('DVT00003', 'Thùng'),
('DVT00004', 'Kg'),
('DVT00005', 'Lít'),
('DVT00006', 'Chai'),
('DVT00007', 'Gói'),
('DVT00008', 'Lon');
COMMIT;

-- Loại đại lý
BEGIN;
INSERT INTO inventory.LOAIDAILY (MaLoaiDaiLy, TenLoaiDaiLy, NoToiDa) VALUES
('LDL00001', 'Nhà phân phối', 300000000),
('LDL00002', 'Đại lý cấp 1', 120000000),
('LDL00003', 'Đại lý cấp 2', 50000000);
COMMIT;

-- Quận huyện HCMC
BEGIN;
INSERT INTO inventory.QUAN (MaQuan, TenQuan, NgayTiepNhan) VALUES
('QUA00001', 'Quận 1', '2024-06-01'),
('QUA00002', 'Quận 2', '2024-06-01'),
('QUA00003', 'Quận 3', '2024-06-01'),
('QUA00004', 'Quận 4', '2024-06-01'),
('QUA00005', 'Quận 5', '2024-06-01'),
('QUA00006', 'Quận 6', '2024-06-01'),
('QUA00007', 'Quận 7', '2024-06-01'),
('QUA00008', 'Quận 8', '2024-06-01'),
('QUA00009', 'Quận 9', '2024-06-01'),
('QUA00010', 'Quận 10', '2024-06-01'),
('QUA00011', 'Quận 11', '2024-06-01'),
('QUA00012', 'Quận 12', '2024-06-01'),
('QUA00013', 'Quận Bình Thạnh', '2024-06-01'),
('QUA00014', 'Quận Gò Vấp', '2024-06-01'),
('QUA00015', 'Quận Phú Nhuận', '2024-06-01'),
('QUA00016', 'Quận Tân Bình', '2024-06-01'),
('QUA00017', 'Quận Tân Phú', '2024-06-01'),
('QUA00018', 'Quận Bình Tân', '2024-06-01'),
('QUA00019', 'Thành phố Thủ Đức', '2024-06-01'),
('QUA00020', 'Huyện Bình Chánh', '2024-06-01'),
('QUA00021', 'Huyện Củ Chi', '2024-06-01'),
('QUA00022', 'Huyện Hóc Môn', '2024-06-01'),
('QUA00023', 'Huyện Nhà Bè', '2024-06-01'),
('QUA00024', 'Huyện Cần Giờ', '2024-06-01');
COMMIT;

-- Mặt hàng
BEGIN;
WITH dv AS (
    SELECT IDDonViTinh, TenDonViTinh FROM inventory.DONVITINH
)
INSERT INTO inventory.MATHANG (MaMatHang, TenMatHang, IDDonViTinh, SoLuongTon)
SELECT 'MHH00001', 'Gạo Nàng Hương', IDDonViTinh, 1500 FROM dv WHERE TenDonViTinh = 'Kg'
UNION ALL SELECT 'MHH00002', 'Sữa tươi Vinamilk', IDDonViTinh, 800 FROM dv WHERE TenDonViTinh = 'Lít'
UNION ALL SELECT 'MHH00003', 'Bánh Oreo', IDDonViTinh, 300 FROM dv WHERE TenDonViTinh = 'Hộp'
UNION ALL SELECT 'MHH00004', 'Tivi Samsung 55"', IDDonViTinh, 30 FROM dv WHERE TenDonViTinh = 'Cái'
UNION ALL SELECT 'MHH00005', 'Bia Tiger', IDDonViTinh, 120 FROM dv WHERE TenDonViTinh = 'Thùng'
UNION ALL SELECT 'MHH00006', 'Nước mắm Nam Ngư', IDDonViTinh, 280 FROM dv WHERE TenDonViTinh = 'Chai'
UNION ALL SELECT 'MHH00007', 'Mì tôm Hảo Hảo', IDDonViTinh, 1200 FROM dv WHERE TenDonViTinh = 'Gói'
UNION ALL SELECT 'MHH00008', 'Nước ngọt Coca Cola', IDDonViTinh, 500 FROM dv WHERE TenDonViTinh = 'Lon'
UNION ALL SELECT 'MHH00009', 'Dầu ăn Neptune', IDDonViTinh, 250 FROM dv WHERE TenDonViTinh = 'Lít'
UNION ALL SELECT 'MHH00010', 'Sữa đặc Ông Thọ', IDDonViTinh, 400 FROM dv WHERE TenDonViTinh = 'Hộp';
COMMIT;

-- 90 AGENTS - PRECALCULATED CHRONOLOGICAL DATES FROM 07/2024 TO 06/2025
BEGIN;
INSERT INTO inventory.DAILY (MaDaiLy, TenDaiLy, SoDienThoai, DiaChi, Email, IDLoaiDaiLy, IDQuan, NgayTiepNhan)
VALUES
-- July 2024 (5 agents)
('DL00001', 'Công ty TNHH Thực phẩm Sài Gòn', '0970054670', '107 Đồng Khởi', 'thucpham.saigon@phanphoi.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 1'), '2024-07-03'),
('DL00002', 'Tập đoàn Phân phối Đại Dương', '0970109340', '114 Lê Lợi', 'info@daiduong.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 3'), '2024-07-08'),
('DL00003', 'Siêu thị Go!', '0990012340', '53 Alexandre de Rhodes', 'contact@go.supermarket.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 1'), '2024-07-15'),
('DL00004', 'Circle K', '0980024130', '34 Huyền Quang', 'circlek.q1@circlek.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 1'), '2024-07-22'),
('DL00005', 'Siêu thị Co.opmart', '0990024680', '56 Bà Lê Chân', 'info@coopmart.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 3'), '2024-07-29'),

-- August 2024 (8 agents)
('DL00006', 'Công ty CP Sản xuất Minh Tâm', '0970164010', '121 Hai Bà Trưng', 'contact@minhtam.corp', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 4'), '2024-08-02'),
('DL00007', 'FamilyMart', '0980072260', '38 Huyền Trân Công Chúa', 'family.q3@familymart.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 3'), '2024-08-06'),
('DL00008', 'Aeon Mall', '0990037020', '59 Bùi Thị Xuân', 'customer@aeonmall.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 4'), '2024-08-12'),
('DL00009', 'Winmart', '0990049360', '62 Bùi Viện', 'support@winmart.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 5'), '2024-08-16'),
('DL00010', 'Doanh nghiệp tư nhân Nhập khẩu Đông Á', '0970218680', '128 Nam Kỳ Khởi Nghĩa', 'dongA.import@gmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 5'), '2024-08-20'),
('DL00011', 'GS25', '0980120390', '42 Huỳnh Khương Ninh', 'gs25.q4@gs25.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 4'), '2024-08-24'),
('DL00012', 'Winmart+', '0990061700', '65 Cách Mạng Tháng Tám', 'plus@winmart.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 6'), '2024-08-28'),
('DL00013', '7-Eleven', '0980168520', '46 Huỳnh Thúc Kháng', 'seven.q5@7eleven.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 5'), '2024-08-31'),

-- September 2024 (8 agents)
('DL00014', 'Công ty TNHH MTV Phân phối An Khang', '0970273350', '135 Cách Mạng Tháng Tám', 'ankhang.distribution@yahoo.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 6'), '2024-09-04'),
('DL00015', 'Siêu thị Vincom', '0990074040', '68 Calmette', 'service@vincom.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 7'), '2024-09-08'),
('DL00016', 'Bách Hóa Xanh', '0990086380', '71 Cao Bá Nhạ', 'bhx@bachhoaxanh.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 8'), '2024-09-12'),
('DL00017', 'Ministop', '0980216650', '50 Ký Con', 'ministop.q6@ministop.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 6'), '2024-09-16'),
('DL00018', 'Công ty TNHH Thực phẩm Hưng Thịnh', '0970328020', '142 Nguyễn Huệ', 'hungthinhfood@outlook.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 7'), '2024-09-20'),
('DL00019', 'Siêu thị MM Mega Market', '0990098720', '74 Cao Bá Quát', 'megamarket@mm.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 10'), '2024-09-24'),
('DL00020', 'AEON Citimart', '0980264780', '54 Lê Anh Xuân', 'citimart.q7@aeon.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 7'), '2024-09-28'),
('DL00021', 'Siêu thị Go!', '0990111060', '77 Cô Bắc', 'go.q11@supermarket.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 11'), '2024-09-30'),

-- October 2024 (9 agents)
('DL00022', 'Tập đoàn Thương mại Tân Bình', '0970382690', '149 Lê Thánh Tôn', 'tanbinh.trade@hotmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 8'), '2024-10-03'),
('DL00023', 'Siêu thị Co.opmart', '0990123400', '80 Cô Giang', 'coop.q12@coopmart.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 12'), '2024-10-07'),
('DL00024', 'TH True Mart', '0980312910', '58 Lê Công Kiều', 'truemart.q8@th.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 8'), '2024-10-11'),
('DL00025', 'Aeon Mall', '0990135740', '83 Cống Quỳnh', 'aeon.bt@aeonmall.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Bình Thạnh'), '2024-10-15'),
('DL00026', 'Tạp hóa Thanh Hoa', '0980361040', '62 Lê Duẩn', 'thanhhoa.taphoa@gmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 10'), '2024-10-19'),
('DL00027', 'Công ty CP Đầu tư Phú Mỹ', '0970437360', '156 Bùi Viện', 'phumy.investment@gmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 10'), '2024-10-23'),
('DL00028', 'Winmart', '0990148080', '86 Chu Mạnh Trinh', 'winmart.gv@winmart.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Gò Vấp'), '2024-10-27'),
('DL00029', 'Tạp hóa Mỹ Hạnh', '0980409170', '66 Lê Lai', 'myhanh.store@yahoo.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 11'), '2024-10-30'),
('DL00030', 'Winmart+', '0990160420', '89 Chương Dương', 'winplus.pn@winmart.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Phú Nhuận'), '2024-10-31'),

-- November 2024 (8 agents)
('DL00031', 'Doanh nghiệp tư nhân Phân phối Ánh Dương', '0970492030', '163 Nguyễn Du', 'anhduong.dist@yahoo.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 11'), '2024-11-04'),
('DL00032', 'Siêu thị Vincom', '0990172760', '92 Đặng Dung', 'vincom.tb@vincom.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Tân Bình'), '2024-11-08'),
('DL00033', 'Tạp hóa Minh Châu', '0980457300', '70 Lê Lợi', 'minhhau.grocery@hotmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 12'), '2024-11-12'),
('DL00034', 'Bách Hóa Xanh', '0990185100', '95 Đặng Tất', 'bhx.tp@bachhoaxanh.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Tân Phú'), '2024-11-16'),
('DL00035', 'Công ty TNHH Xuất nhập khẩu Kim Long', '0970546700', '170 Đinh Công Tráng', 'kimlong.export@outlook.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 12'), '2024-11-20'),
('DL00036', 'Cửa hàng Gia Hưng', '0980505430', '74 Lê Thánh Tôn', 'giahung.shop@gmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Bình Thạnh'), '2024-11-24'),
('DL00037', 'Siêu thị MM Mega Market', '0990197440', '98 Đặng Thị Nhu', 'mega.bt@mm.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Bình Tân'), '2024-11-28'),
('DL00038', 'Siêu thị Go!', '0990209780', '101 Đặng Trần Côn', 'go.td@supermarket.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Thành phố Thủ Đức'), '2024-11-30'),

-- December 2024 (7 agents)
('DL00039', 'Công ty TNHH MTV Chuỗi cung ứng Hòa Bình', '0970601370', '177 Lê Lai', 'hoabinh.supply@gmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Bình Thạnh'), '2024-12-04'),
('DL00040', 'Bách hóa Tuấn Tú', '0980553560', '78 Lê Thị Hồng Gấm', 'tuantu.bachoa@yahoo.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Gò Vấp'), '2024-12-08'),
('DL00041', 'Siêu thị Co.opmart', '0990222120', '104 Đề Thám', 'coop.bc@coopmart.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Huyện Bình Chánh'), '2024-12-12'),
('DL00042', 'Tạp hóa Anh Tuấn', '0980601690', '82 Lê Thị Riêng', 'anhtuan.taphoa@hotmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Phú Nhuận'), '2024-12-16'),
('DL00043', 'Aeon Mall', '0990234460', '107 Đinh Công Tráng', 'aeon.cc@aeonmall.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Huyện Củ Chi'), '2024-12-20'),
('DL00044', 'Tập đoàn Đồng Tiến', '0970656040', '184 Hàm Nghi', 'dongtien.group@hotmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Gò Vấp'), '2024-12-24'),
('DL00045', 'Winmart', '0990246800', '110 Đông Du', 'winmart.hm@winmart.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Huyện Hóc Môn'), '2024-12-28'),

-- January 2025 (8 agents)
('DL00046', 'Cửa hàng Linh Đan', '0980649820', '86 Lê Văn Hưu', 'linhdan.store@gmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Tân Bình'), '2025-01-02'),
('DL00047', 'Winmart+', '0990259140', '113 Đồng Khởi', 'winplus.nb@winmart.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Huyện Nhà Bè'), '2025-01-06'),
('DL00048', 'Công ty CP Phát triển Nam Việt', '0970710710', '191 Cô Giang', 'namviet.dev@yahoo.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Phú Nhuận'), '2025-01-10'),
('DL00049', 'Tạp hóa Ngọc Lan', '0980697950', '90 Lương Hữu Khánh', 'ngoclan.grocery@yahoo.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Tân Phú'), '2025-01-14'),
('DL00050', 'Siêu thị Vincom', '0990271480', '116 Hai Bà Trưng', 'vincom.cg@vincom.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Huyện Cần Giờ'), '2025-01-18'),
('DL00051', 'Doanh nghiệp tư nhân Phân phối Golden', '0970765380', '198 Nguyễn Cư Trinh', 'golden.distribution@outlook.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Tân Bình'), '2025-01-22'),
('DL00052', 'Bách Hóa Xanh', '0990283820', '119 Hải Triều', 'bhx.q1b@bachhoaxanh.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 1'), '2025-01-26'),
('DL00053', 'Tạp hóa Phúc An', '0980746080', '94 Lưu Văn Lang', 'phucan.taphoa@hotmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Bình Tân'), '2025-01-30'),

-- February 2025 (7 agents)
('DL00054', 'Siêu thị MM Mega Market', '0990296160', '122 Hàm Nghi', 'mega.q3b@mm.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 3'), '2025-02-03'),
('DL00055', 'Circle K', '0980794210', '98 Lý Tự Trọng', 'circlek.td@circlek.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Thành phố Thủ Đức'), '2025-02-07'),
('DL00056', 'Công ty TNHH Phân phối Thành Công', '0970820050', '105 Lý Tự Trọng', 'thanhcong.dist@gmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Tân Phú'), '2025-02-11'),
('DL00057', 'Siêu thị Go!', '0990308500', '125 Hàn Thuyên', 'go.q4b@supermarket.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 4'), '2025-02-15'),
('DL00058', 'Siêu thị Co.opmart', '0990320840', '128 Hòa Mỹ', 'coop.q5b@coopmart.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 5'), '2025-02-19'),
('DL00059', 'FamilyMart', '0980842340', '102 Lý Văn Phức', 'family.bc@familymart.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Huyện Bình Chánh'), '2025-02-23'),
('DL00060', 'Công ty TNHH Phân phối Hoàng Gia', '0970874720', '112 Nguyễn Đình Chiểu', 'hoanggia.dist@gmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 11'), '2025-02-27'),

-- March 2025 (8 agents)
('DL00061', 'Aeon Mall', '0990333180', '131 Hồ Hảo Hớn', 'aeon.q6b@aeonmall.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 6'), '2025-03-03'),
('DL00062', 'GS25', '0980890470', '106 Mạc Đĩnh Chi', 'gs25.cc@gs25.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Huyện Củ Chi'), '2025-03-07'),
('DL00063', 'Winmart', '0990345520', '134 Hồ Huấn Nghiệp', 'winmart.q7b@winmart.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 7'), '2025-03-11'),
('DL00064', 'Tập đoàn Phân phối Đại Việt', '0970929390', '115 Nguyễn Huệ', 'daiviet.group@outlook.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 12'), '2025-03-15'),
('DL00065', '7-Eleven', '0980938600', '110 Mạc Thị Bưởi', 'seven.hm@7eleven.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Huyện Hóc Môn'), '2025-03-19'),
('DL00066', 'Winmart+', '0990357860', '137 Hồ Tùng Mậu', 'winplus.q8b@winmart.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 8'), '2025-03-23'),
('DL00067', 'Siêu thị Vincom', '0990370200', '140 Hoàng Sa', 'vincom.q10b@vincom.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 10'), '2025-03-27'),
('DL00068', 'Ministop', '0980986730', '114 Mai Thị Lựu', 'ministop.nb@ministop.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Huyện Nhà Bè'), '2025-03-31'),

-- April 2025 (8 agents)
('DL00069', 'Công ty CP Phân phối Hồng Phát', '0970984060', '118 Nguyễn Hữu Cảnh', 'hongphat.corp@yahoo.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Bình Thạnh'), '2025-04-04'),
('DL00070', 'BigC Supercenter', '0990382540', '127 Nguyễn Khắc Nhu', 'bigc.tanbien@bigc.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Tân Bình'), '2025-04-08'),
('DL00071', 'AEON Citimart', '0981034860', '118 Nam Kỳ Khởi Nghĩa', 'citimart.cg@aeon.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Huyện Cần Giờ'), '2025-04-12'),
('DL00072', 'Lotte Mart', '0990394880', '130 Nguyễn Phi Khanh', 'lotte.tanphu@lottemart.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Tân Phú'), '2025-04-16'),
('DL00073', 'Doanh nghiệp tư nhân Lộc Phát', '0971038730', '121 Nguyễn Hữu Cầu', 'locphat.enterprise@hotmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Gò Vấp'), '2025-04-20'),
('DL00074', 'Saigon Co.op', '0990407220', '133 Nguyễn Thái Bình', 'saigon.coop@saigoncoop.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Bình Tân'), '2025-04-24'),
('DL00075', 'TH True Mart', '0981082990', '122 Nam Quốc Cang', 'truemart.q1b@th.com.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 1'), '2025-04-28'),
('DL00076', 'VinMart Premium', '0990419560', '136 Alexandre de Rhodes', 'premium.thuduc@vinmart.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Thành phố Thủ Đức'), '2025-04-30'),

-- May 2025 (8 agents)
('DL00077', 'Công ty TNHH MTV Hòa Phát', '0971093400', '124 Nguyễn Huy Tự', 'hoaphat.ltd@gmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Nhà phân phối'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận Phú Nhuận'), '2025-05-04'),
('DL00078', 'Tạp hóa Thanh Hoa', '0981131120', '126 Ngô Đức Kế', 'thanhhoa2.taphoa@gmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 3'), '2025-05-08'),
('DL00079', 'Emart Vietnam', '0990431900', '139 Bà Lê Chân', 'emart.binhchanh@emart.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 1'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Huyện Bình Chánh'), '2025-05-12'),
('DL00080', 'Tạp hóa Mỹ Hạnh', '0981179250', '130 Ngô Văn Năm', 'myhanh2.store@yahoo.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 4'), '2025-05-16'),
('DL00081', 'Tạp hóa Minh Châu', '0981227380', '134 Nguyễn Bỉnh Khiêm', 'minhhau2.grocery@hotmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 5'), '2025-05-20'),
('DL00082', 'Cửa hàng Gia Hưng', '0981275510', '138 Nguyễn Cảnh Chân', 'giahung2.shop@gmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 6'), '2025-05-24'),
('DL00083', 'Bách hóa Tuấn Tú', '0981323640', '142 Nguyễn Công Trứ', 'tuantu2.bachoa@yahoo.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 7'), '2025-05-28'),
('DL00084', 'Tạp hóa Anh Tuấn', '0981371770', '146 Nguyễn Cư Trinh', 'anhtuan2.taphoa@hotmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 8'), '2025-05-31'),

-- June 2025 (6 agents - up to current date)
('DL00085', 'Cửa hàng Linh Đan', '0981419900', '150 Nguyễn Du', 'linhdan2.store@gmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 10'), '2025-06-01'),
('DL00086', 'B''s Mart', '0981468030', '154 Bùi Thị Xuân', 'bsmart.cuchi@bsmart.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Huyện Củ Chi'), '2025-06-01'),
('DL00087', 'Shop&Go', '0981516160', '158 Bùi Viện', 'shopgo.hocmon@shopgo.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Huyện Hóc Môn'), '2025-06-02'),
('DL00088', 'Cheers Convenience', '0981564290', '162 Cách Mạng Tháng Tám', 'cheers.nhabe@cheers.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Huyện Nhà Bè'), '2025-06-03'),
('DL00089', 'VinMart+', '0981612420', '166 Calmette', 'vinplus.cangio@vinmart.vn', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Huyện Cần Giờ'), '2025-06-04'),
('DL00090', 'Tạp hóa Hương Sen', '0981660550', '170 Cao Bá Nhạ', 'huongsen.taphoa@gmail.com', (SELECT IDLoaiDaiLy FROM inventory.LOAIDAILY WHERE TenLoaiDaiLy = 'Đại lý cấp 2'), (SELECT IDQuan FROM inventory.QUAN WHERE TenQuan = 'Quận 1'), '2025-06-04');
COMMIT;

-- THAM SỐ
BEGIN;
INSERT INTO inventory.THAMSO (MaThamSo, SoLuongDaiLyToiDa, QuyDinhTienThuTienNo) 
VALUES ('TS00001', 5, 1)
ON CONFLICT (MaThamSo) DO NOTHING;
COMMIT;

-- =========================
-- 5. PHIẾU XUẤT, PHIẾU THU, CHI TIẾT PHIẾU XUẤT (BASIC DATA ONLY - NO AGGREGATES)
-- =========================

-- Generate basic transaction data without calculating aggregate values
BEGIN;
WITH
agents AS (
    SELECT IDDaiLy, MaDaiLy, NgayTiepNhan,
           CAST(SUBSTRING(MaDaiLy FROM 3) AS INTEGER) as agent_num
    FROM inventory.DAILY
    ORDER BY agent_num
),
products AS (
    SELECT IDMatHang, MaMatHang,
           CAST(SUBSTRING(MaMatHang FROM 4) AS INTEGER) as product_num
    FROM inventory.MATHANG
),
-- Generate export receipts - NO TOTALS CALCULATED YET
export_receipts AS (
    INSERT INTO inventory.PHIEUXUAT (MaPhieuXuat, IDDaiLy, NgayLap, TongGiaTri)
    SELECT 
        'PX' || LPAD(ROW_NUMBER() OVER (ORDER BY agent_num)::text, 5, '0'),
        IDDaiLy,
        LEAST((NgayTiepNhan + ((agent_num * 17) % 90) * INTERVAL '1 day'), CURRENT_DATE)::date as NgayLap,
        0  -- Will be calculated in Part 2
    FROM agents
    WHERE (agent_num * 7) % 100 < 85  -- 85% of agents get export receipts
    RETURNING IDPhieuXuat, IDDaiLy, NgayLap, MaPhieuXuat
),
-- Generate receipt details with basic data - NO CALCULATIONS YET
receipt_details AS (
    INSERT INTO inventory.CTPHIEUXUAT (IDPhieuXuat, IDMatHang, SoLuongXuat, DonGiaXuat, ThanhTien)
    SELECT 
        er.IDPhieuXuat,
        p.IDMatHang,
        1 + ((CAST(SUBSTRING(er.MaPhieuXuat FROM 3) AS INTEGER) * p.product_num * 13) % 8) as SoLuongXuat,
        25000 + ((CAST(SUBSTRING(er.MaPhieuXuat FROM 3) AS INTEGER) * p.product_num * 27) % 375000) as DonGiaXuat,
        0 as ThanhTien  -- Will be calculated in Part 2
    FROM export_receipts er
    CROSS JOIN products p
    WHERE ((CAST(SUBSTRING(er.MaPhieuXuat FROM 3) AS INTEGER) * p.product_num) % 100) < 30  -- ~30% chance per product per receipt
    RETURNING IDPhieuXuat, IDMatHang, SoLuongXuat, DonGiaXuat
)
-- Generate payment receipts with basic amounts - NO DEBT CALCULATIONS YET
INSERT INTO inventory.PHIEUTHU (MaPhieuThu, IDDaiLy, NgayThuTien, SoTienThu)
SELECT 
    'PT' || LPAD(ROW_NUMBER() OVER (ORDER BY MaPhieuXuat)::text, 5, '0'),
    IDDaiLy,
    LEAST((NgayLap + (1 + ((CAST(SUBSTRING(MaPhieuXuat FROM 3) AS INTEGER) * 11) % 30)) * INTERVAL '1 day'), CURRENT_DATE)::date,
    50000 + ((CAST(SUBSTRING(MaPhieuXuat FROM 3) AS INTEGER) * 19) % 500000) as SoTienThu  -- Random amounts for now
FROM export_receipts 
WHERE ((CAST(SUBSTRING(MaPhieuXuat FROM 3) AS INTEGER) * 23) % 100) < 70;  -- 70% get payments
COMMIT;

-- =========================
-- 6. THAM SỐ
-- =========================
BEGIN;
INSERT INTO inventory.THAMSO (MaThamSo, SoLuongDaiLyToiDa, QuyDinhTienThuTienNo) 
VALUES ('TS00001', 5, 1)
ON CONFLICT (MaThamSo) DO NOTHING;
COMMIT;

-- =========================
-- 7. UPDATE AGGREGATE COLUMNS
-- =========================

-- Update receipt detail totals (ThanhTien = SoLuongXuat * DonGiaXuat)
BEGIN;
UPDATE inventory.CTPHIEUXUAT
SET ThanhTien = SoLuongXuat * DonGiaXuat
WHERE ThanhTien = 0;
COMMIT;

-- Update export receipt totals (TongGiaTri = SUM of ThanhTien)
BEGIN;
UPDATE inventory.PHIEUXUAT px
SET TongGiaTri = COALESCE((
    SELECT SUM(ThanhTien) 
    FROM inventory.CTPHIEUXUAT ct 
    WHERE ct.IDPhieuXuat = px.IDPhieuXuat
), 0)
WHERE px.TongGiaTri = 0;
COMMIT;

-- Update ID Tracker with final counts
BEGIN;
UPDATE inventory.ID_TRACKER
SET 
    MaDaiLyCuoi = 90,
    MaDonViTinhCuoi = 8,
    MaLoaiDaiLyCuoi = 3,
    MaQuanCuoi = 24,
    MaMatHangCuoi = 10,
    MaPhieuThuCuoi = (SELECT COUNT(*) FROM inventory.PHIEUTHU),
    MaPhieuXuatCuoi = (SELECT COUNT(*) FROM inventory.PHIEUXUAT);
COMMIT;

-- Update debt calculations with correct logic
BEGIN;
UPDATE inventory.DAILY d
SET CongNo = COALESCE((
    SELECT 
        COALESCE(SUM(px.TongGiaTri), 0) - COALESCE(SUM(pt.SoTienThu), 0)
    FROM inventory.PHIEUXUAT px
    LEFT JOIN inventory.PHIEUTHU pt ON px.IDDaiLy = pt.IDDaiLy 
    WHERE px.IDDaiLy = d.IDDaiLy
), 0);
COMMIT;

-- Update district agent counts (if needed - you mentioned NoDaiLy is static)
BEGIN;
UPDATE inventory.QUAN q
SET NoDaiLy = (
    SELECT COUNT(*)
    FROM inventory.DAILY d
    WHERE d.IDQuan = q.IDQuan
      AND d.DeletedAt IS NULL
);
COMMIT;

-- =========================
-- VERIFICATION QUERIES
-- =========================
-- Uncomment to verify data:
-- SELECT 'Agents by type' as check_type, TenLoaiDaiLy, COUNT(*) FROM inventory.DAILY d JOIN inventory.LOAIDAILY l ON d.IDLoaiDaiLy = l.IDLoaiDaiLy GROUP BY TenLoaiDaiLy;
-- SELECT 'Export receipts' as check_type, COUNT(*) FROM inventory.PHIEUXUAT;
-- SELECT 'Payment receipts' as check_type, COUNT(*) FROM inventory.PHIEUTHU;
-- SELECT 'Receipt details' as check_type, COUNT(*) FROM inventory.CTPHIEUXUAT;
-- SELECT 'Agents with debt' as check_type, COUNT(*) FROM inventory.DAILY WHERE CongNo > 0;

-- =========================
-- FINISHED!
-- =========================