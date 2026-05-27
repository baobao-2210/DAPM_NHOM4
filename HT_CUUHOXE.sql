-- ============================================
-- TẠO DATABASE
-- ============================================
IF DB_ID('QL_CUUHOXE') IS NOT NULL
BEGIN
    ALTER DATABASE QL_CUUHOXE SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE QL_CUUHOXE;
END
GO

CREATE DATABASE QL_CUUHOXE;
GO

USE QL_CUUHOXE;
GO


-- ============================================
-- 1) ĐỊA CHỈ: TỈNH THÀNH + PHƯỜNG XÃ 
-- ============================================
CREATE TABLE TINH_THANH (
    Id_Tinh_Thanh INT IDENTITY(1,1) PRIMARY KEY,
    Ma_Tinh VARCHAR(10) NOT NULL,
    Ten_Tinh NVARCHAR(100) NOT NULL
);
GO

CREATE TABLE PHUONG_XA (
    Id_Phuong_Xa INT IDENTITY(1,1) PRIMARY KEY,
    Id_Tinh_Thanh INT NOT NULL,         -- FK THẲNG TỚI TỈNH
    Ma_Phuong_Xa VARCHAR(10) NOT NULL,
    Ten_Phuong_Xa NVARCHAR(100) NOT NULL,
    KinhDo DECIMAL(10,6),
    ViDo DECIMAL(10,6),

    CONSTRAINT FK_PHUONGXA_TINH
        FOREIGN KEY (Id_Tinh_Thanh)
        REFERENCES TINH_THANH(Id_Tinh_Thanh)
);
GO


-- ============================================
-- 2) CCCD
-- ============================================
CREATE TABLE CCCD (
    Id_CCCD VARCHAR(20) PRIMARY KEY,
    NgayCap DATE,
    NoiCap NVARCHAR(100),
    TrangThaiXacMinh NVARCHAR(50)
);
GO


-- ============================================
-- 3) TÀI KHOẢN
-- ============================================
CREATE TABLE TAIKHOAN (
    Id_TaiKhoan INT IDENTITY(1,1) PRIMARY KEY,
    Id_CCCD VARCHAR(20) NULL,

    Email VARCHAR(100) NOT NULL,
    MatKhauHash VARCHAR(200) NOT NULL,
    SoDienThoai VARCHAR(20) NOT NULL,

    VaiTro NVARCHAR(50) NOT NULL,
    TrangThai NVARCHAR(50) NOT NULL,

    NgayTao DATETIME DEFAULT GETDATE(),
    LanDangNhapCuoi DATETIME,

    HoTen NVARCHAR(100),
    NgaySinh DATE,
    Avatar VARCHAR(200),

    CONSTRAINT FK_TAIKHOAN_CCCD
        FOREIGN KEY (Id_CCCD)
        REFERENCES CCCD(Id_CCCD)
);
GO


-- ============================================
-- 4) THÔNG BÁO
-- ============================================
CREATE TABLE THONGBAO (
    Id_ThongBao INT IDENTITY(1,1) PRIMARY KEY,
    Id_TaiKhoanNhan INT NOT NULL,

    TieuDe NVARCHAR(200),
    NoiDung NVARCHAR(500),
    Loai NVARCHAR(50),

    RefType NVARCHAR(50),
    RefId INT,

    DaDoc BIT DEFAULT 0,
    ThoiGian DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_THONGBAO_TAIKHOAN
        FOREIGN KEY (Id_TaiKhoanNhan)
        REFERENCES TAIKHOAN(Id_TaiKhoan)
);
GO


-- ============================================
-- 5) KHÁCH HÀNG
-- ============================================
CREATE TABLE KHACHHANG (
    Id_KhachHang INT IDENTITY(1,1) PRIMARY KEY,
    Id_TaiKhoan INT NOT NULL,
    Id_Phuong_Xa INT NOT NULL,

    CONSTRAINT FK_KHACHHANG_TAIKHOAN
        FOREIGN KEY (Id_TaiKhoan)
        REFERENCES TAIKHOAN(Id_TaiKhoan),

    CONSTRAINT FK_KHACHHANG_PHUONGXA
        FOREIGN KEY (Id_Phuong_Xa)
        REFERENCES PHUONG_XA(Id_Phuong_Xa)
);
GO


-- ============================================
-- 6) LOẠI XE
-- ============================================
CREATE TABLE LOAI_XE (
    Id_LoaiXe INT IDENTITY(1,1) PRIMARY KEY,
    TenLoaiXe NVARCHAR(100) NOT NULL,
    MoTa NVARCHAR(200),
    TrangThai NVARCHAR(50) DEFAULT N'HoatDong'
);
GO


-- ============================================
-- 7) XE KHÁCH HÀNG
-- ============================================
CREATE TABLE XE_KHACHHANG (
    Id_Xe INT IDENTITY(1,1) PRIMARY KEY,
    Id_KhachHang INT NOT NULL,
    Id_LoaiXe INT NOT NULL,

    BienSo VARCHAR(20) NOT NULL,
    HangXe NVARCHAR(50),
    DongXe NVARCHAR(50),
    MauXe NVARCHAR(50),
    GhiChu NVARCHAR(200),

    NgayTao DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_XE_KHACHHANG
        FOREIGN KEY (Id_KhachHang)
        REFERENCES KHACHHANG(Id_KhachHang),

    CONSTRAINT FK_XE_LOAIXE
        FOREIGN KEY (Id_LoaiXe)
        REFERENCES LOAI_XE(Id_LoaiXe)
);
GO


-- ============================================
-- 8) NHÂN VIÊN CỨU HỘ
-- ============================================
CREATE TABLE NHANVIEN_CUUHO (
    Id_NhanVien INT IDENTITY(1,1) PRIMARY KEY,
    Id_TaiKhoan INT NOT NULL,

    TrangThaiNhanViec BIT DEFAULT 1,
    DiemTB DECIMAL(3,2) DEFAULT 0,
    MoTa NVARCHAR(200),

    CONSTRAINT FK_NHANVIEN_TAIKHOAN
        FOREIGN KEY (Id_TaiKhoan)
        REFERENCES TAIKHOAN(Id_TaiKhoan)
);
GO


-- ============================================
-- 9) NHÂN VIÊN - KHU VỰC
-- ============================================
CREATE TABLE NHANVIEN_KHUVUC (
    Id_NhanVien INT NOT NULL,
    Id_Phuong_Xa INT NOT NULL,

    PRIMARY KEY (Id_NhanVien, Id_Phuong_Xa),

    CONSTRAINT FK_NVKV_NHANVIEN
        FOREIGN KEY (Id_NhanVien)
        REFERENCES NHANVIEN_CUUHO(Id_NhanVien),

    CONSTRAINT FK_NVKV_PHUONGXA
        FOREIGN KEY (Id_Phuong_Xa)
        REFERENCES PHUONG_XA(Id_Phuong_Xa)
);
GO


-- ============================================
-- 10) HỒ SƠ ĐĂNG KÝ NHÂN VIÊN
-- ============================================
CREATE TABLE HOSO_DANGKY_NHANVIEN (
    Id_HoSo INT IDENTITY(1,1) PRIMARY KEY,
    Id_TaiKhoan INT NOT NULL,

    ThongTinXe NVARCHAR(200),
    KinhNghiem NVARCHAR(200),
    GiayTo NVARCHAR(200),

    TrangThai NVARCHAR(50) DEFAULT N'DangCho',
    LyDoTuChoi NVARCHAR(200),

    NgayNop DATETIME DEFAULT GETDATE(),
    NgayDuyet DATETIME,
    TenNguoiDuyet NVARCHAR(100),

    CONSTRAINT FK_HOSO_TAIKHOAN
        FOREIGN KEY (Id_TaiKhoan)
        REFERENCES TAIKHOAN(Id_TaiKhoan)
);
GO


-- ============================================
-- 11) DANH MỤC DỊCH VỤ
-- ============================================
CREATE TABLE DANHMUC_DICHVU (
    Id_DanhMuc INT IDENTITY(1,1) PRIMARY KEY,
    TenDanhMuc NVARCHAR(100) NOT NULL,
    MoTa NVARCHAR(200),
    TrangThai NVARCHAR(50) DEFAULT N'HoatDong'
);
GO


-- ============================================
-- 12) DỊCH VỤ CỨU HỘ
-- ============================================
CREATE TABLE DICHVU_CUUHO (
    Id_DichVu INT IDENTITY(1,1) PRIMARY KEY,
    Id_DanhMuc INT NOT NULL,

    TenDichVu NVARCHAR(100) NOT NULL,
    MoTa NVARCHAR(200),
    GiaCoBan DECIMAL(18,2) DEFAULT 0,

    TrangThai NVARCHAR(50) DEFAULT N'HoatDong',
    NgayCapNhat DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_DICHVU_DANHMUC
        FOREIGN KEY (Id_DanhMuc)
        REFERENCES DANHMUC_DICHVU(Id_DanhMuc)
);
GO


-- ============================================
-- 13) NHÂN VIÊN - DỊCH VỤ
-- ============================================
CREATE TABLE NHANVIEN_DICHVU (
    Id_NhanVien INT NOT NULL,
    Id_DichVu INT NOT NULL,

    PRIMARY KEY (Id_NhanVien, Id_DichVu),

    CONSTRAINT FK_NVDV_NHANVIEN
        FOREIGN KEY (Id_NhanVien)
        REFERENCES NHANVIEN_CUUHO(Id_NhanVien),

    CONSTRAINT FK_NVDV_DICHVU
        FOREIGN KEY (Id_DichVu)
        REFERENCES DICHVU_CUUHO(Id_DichVu)
);
GO


-- ============================================
-- 14) YÊU CẦU CỨU HỘ
-- ============================================
CREATE TABLE YEUCAU_CUUHO (
    Id_YeuCau INT IDENTITY(1,1) PRIMARY KEY,

    Id_KhachHang INT NOT NULL,
    Id_Xe INT NOT NULL,
    Id_DichVu INT NOT NULL,
    Id_NhanVien INT NULL,
    Id_Phuong_Xa INT NOT NULL,

    MoTaSuCo NVARCHAR(300),
    NoiSuCo NVARCHAR(200),
    TrangThaiHienTai NVARCHAR(50) DEFAULT N'TiepNhan',

    PhiDichVu DECIMAL(18,2) DEFAULT 0,
    ChiPhiDuKien DECIMAL(18,2) DEFAULT 0,
    ChiPhiThucTe DECIMAL(18,2) DEFAULT 0,

    NgayTao DATETIME DEFAULT GETDATE(),
    NgayHoanThanh DATETIME,
    NgayHuy DATETIME,
    LyDoHuy NVARCHAR(200),

    CONSTRAINT FK_YC_KHACHHANG
        FOREIGN KEY (Id_KhachHang)
        REFERENCES KHACHHANG(Id_KhachHang),

    CONSTRAINT FK_YC_XE
        FOREIGN KEY (Id_Xe)
        REFERENCES XE_KHACHHANG(Id_Xe),

    CONSTRAINT FK_YC_DICHVU
        FOREIGN KEY (Id_DichVu)
        REFERENCES DICHVU_CUUHO(Id_DichVu),

    CONSTRAINT FK_YC_NHANVIEN
        FOREIGN KEY (Id_NhanVien)
        REFERENCES NHANVIEN_CUUHO(Id_NhanVien),

    CONSTRAINT FK_YC_PHUONGXA
        FOREIGN KEY (Id_Phuong_Xa)
        REFERENCES PHUONG_XA(Id_Phuong_Xa)
);
GO


-- ============================================
-- 15) LỊCH SỬ TRẠNG THÁI YÊU CẦU
-- ============================================
CREATE TABLE LICH_SU_TRANG_THAI_YEU_CAU (
    Id_LichSu INT IDENTITY(1,1) PRIMARY KEY,
    Id_YeuCau INT NOT NULL,
    Id_NhanVien INT NULL,

    TrangThai NVARCHAR(50),
    GhiChu NVARCHAR(200),
    ThoiGianCapNhat DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_LS_YEUCAU
        FOREIGN KEY (Id_YeuCau)
        REFERENCES YEUCAU_CUUHO(Id_YeuCau),

    CONSTRAINT FK_LS_NHANVIEN
        FOREIGN KEY (Id_NhanVien)
        REFERENCES NHANVIEN_CUUHO(Id_NhanVien)
);
GO


-- ============================================
-- 16) THANH TOÁN
-- ============================================
CREATE TABLE THANHTOAN (
    Id_ThanhToan INT IDENTITY(1,1) PRIMARY KEY,
    Id_YeuCau INT NOT NULL,

    SoTien DECIMAL(18,2) DEFAULT 0,
    PhuongThuc NVARCHAR(50),
    TrangThai NVARCHAR(50),
    MaGiaoDich VARCHAR(100),
    LoaiGiaoDich NVARCHAR(50),

    ThoiGian DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_THANHTOAN_YEUCAU
        FOREIGN KEY (Id_YeuCau)
        REFERENCES YEUCAU_CUUHO(Id_YeuCau)
);
GO


-- ============================================
-- 17) TIN NHẮN
-- ============================================
CREATE TABLE TINNHAN (
    Id_TinNhan INT IDENTITY(1,1) PRIMARY KEY,
    Id_YeuCau INT NOT NULL,
    Id_TaiKhoanGui INT NOT NULL,

    NoiDung NVARCHAR(500),
    Loai NVARCHAR(50),
    FileUrl VARCHAR(200),
    ThoiGianGui DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_TINNHAN_YEUCAU
        FOREIGN KEY (Id_YeuCau)
        REFERENCES YEUCAU_CUUHO(Id_YeuCau),

    CONSTRAINT FK_TINNHAN_TAIKHOAN
        FOREIGN KEY (Id_TaiKhoanGui)
        REFERENCES TAIKHOAN(Id_TaiKhoan)
);
GO


-- ============================================
-- 18) ĐÁNH GIÁ
-- ============================================
CREATE TABLE DANHGIA (
    Id_DanhGia INT IDENTITY(1,1) PRIMARY KEY,

    Id_YeuCau INT NOT NULL,
    Id_KhachHang INT NOT NULL,
    Id_NhanVien INT NOT NULL,

    SoSao INT CHECK (SoSao >= 1 AND SoSao <= 5),
    NhanXet NVARCHAR(300),
    ThoiGian DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_DANHGIA_YEUCAU
        FOREIGN KEY (Id_YeuCau)
        REFERENCES YEUCAU_CUUHO(Id_YeuCau),

    CONSTRAINT FK_DANHGIA_KHACHHANG
        FOREIGN KEY (Id_KhachHang)
        REFERENCES KHACHHANG(Id_KhachHang),

    CONSTRAINT FK_DANHGIA_NHANVIEN
        FOREIGN KEY (Id_NhanVien)
        REFERENCES NHANVIEN_CUUHO(Id_NhanVien)
);
GO


-- ============================================
-- 19) KHIẾU NẠI
-- ============================================
CREATE TABLE KHIEUNAI (
    Id_KhieuNai INT IDENTITY(1,1) PRIMARY KEY,

    Id_YeuCau INT NOT NULL,
    Id_KhachHang INT NOT NULL,
    Id_NhanVien INT NULL,

    LoaiKhieuNai NVARCHAR(50),
    NoiDung NVARCHAR(500),
    TrangThai NVARCHAR(50),
    KetQuaXuLy NVARCHAR(300),

    ThoiGianTao DATETIME DEFAULT GETDATE(),
    ThoiGianCapNhat DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_KHIEUNAI_YEUCAU
        FOREIGN KEY (Id_YeuCau)
        REFERENCES YEUCAU_CUUHO(Id_YeuCau),

    CONSTRAINT FK_KHIEUNAI_KHACHHANG
        FOREIGN KEY (Id_KhachHang)
        REFERENCES KHACHHANG(Id_KhachHang),

    CONSTRAINT FK_KHIEUNAI_NHANVIEN
        FOREIGN KEY (Id_NhanVien)
        REFERENCES NHANVIEN_CUUHO(Id_NhanVien)
);
GO
CREATE FUNCTION fn_TinhKhoangCach_KM
(
    @lat1 FLOAT, @lon1 FLOAT,
    @lat2 FLOAT, @lon2 FLOAT
)
RETURNS FLOAT
AS
BEGIN
    DECLARE @R FLOAT = 6371; -- bán kính trái đất (km)
    DECLARE @dLat FLOAT = RADIANS(@lat2 - @lat1);
    DECLARE @dLon FLOAT = RADIANS(@lon2 - @lon1);

    DECLARE @a FLOAT =
        SIN(@dLat/2) * SIN(@dLat/2) +
        COS(RADIANS(@lat1)) * COS(RADIANS(@lat2)) *
        SIN(@dLon/2) * SIN(@dLon/2);

    DECLARE @c FLOAT = 2 * ATN2(SQRT(@a), SQRT(1-@a));

    RETURN @R * @c;
END;
GO
CREATE PROCEDURE sp_TaoYeuCauCuuHo
    @Id_KhachHang INT,
    @Id_Xe INT,
    @Id_DichVu INT,
    @Id_Phuong_Xa INT,
    @MoTaSuCo NVARCHAR(300),
    @NoiSuCo NVARCHAR(200)
AS
BEGIN
    INSERT INTO YEUCAU_CUUHO(Id_KhachHang, Id_Xe, Id_DichVu, Id_Phuong_Xa, MoTaSuCo, NoiSuCo)
    VALUES (@Id_KhachHang, @Id_Xe, @Id_DichVu, @Id_Phuong_Xa, @MoTaSuCo, @NoiSuCo);
END;
GO
CREATE PROCEDURE sp_GanNhanVienChoYeuCau
    @Id_YeuCau INT,
    @Id_NhanVien INT
AS
BEGIN
    UPDATE YEUCAU_CUUHO
    SET Id_NhanVien = @Id_NhanVien,
        TrangThaiHienTai = N'DangXuLy'
    WHERE Id_YeuCau = @Id_YeuCau;

    INSERT INTO LICH_SU_TRANG_THAI_YEU_CAU(Id_YeuCau, Id_NhanVien, TrangThai, GhiChu)
    VALUES (@Id_YeuCau, @Id_NhanVien, N'DangXuLy', N'Gán nhân viên cứu hộ');
END;
GO
CREATE PROCEDURE sp_HoanThanhYeuCau
    @Id_YeuCau INT,
    @ChiPhiThucTe DECIMAL(18,2)
AS
BEGIN
    UPDATE YEUCAU_CUUHO
    SET TrangThaiHienTai = N'HoanThanh',
        ChiPhiThucTe = @ChiPhiThucTe,
        NgayHoanThanh = GETDATE()
    WHERE Id_YeuCau = @Id_YeuCau;

    INSERT INTO LICH_SU_TRANG_THAI_YEU_CAU(Id_YeuCau, TrangThai, GhiChu)
    VALUES (@Id_YeuCau, N'HoanThanh', N'Yêu cầu đã hoàn thành');
END;
GO
CREATE TRIGGER trg_CheckXeThuocKhachHang
ON YEUCAU_CUUHO
AFTER INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN XE_KHACHHANG x ON i.Id_Xe = x.Id_Xe
        WHERE x.Id_KhachHang <> i.Id_KhachHang
    )
    BEGIN
        RAISERROR(N'Xe không thuộc khách hàng này!', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO
CREATE TRIGGER trg_CheckDanhGia
ON DANHGIA
AFTER INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN YEUCAU_CUUHO y ON i.Id_YeuCau = y.Id_YeuCau
        WHERE y.TrangThaiHienTai <> N'HoanThanh'
    )
    BEGIN
        RAISERROR(N'Chỉ được đánh giá khi yêu cầu đã hoàn thành!', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO
CREATE TRIGGER trg_CheckThanhToan
ON THANHTOAN
AFTER INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN YEUCAU_CUUHO y ON i.Id_YeuCau = y.Id_YeuCau
        WHERE y.TrangThaiHienTai <> N'HoanThanh'
    )
    BEGIN
        RAISERROR(N'Chỉ thanh toán khi yêu cầu đã hoàn thành!', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO
CREATE TRIGGER trg_InsertYeuCau_AddLichSu
ON YEUCAU_CUUHO
AFTER INSERT
AS
BEGIN
    INSERT INTO LICH_SU_TRANG_THAI_YEU_CAU(Id_YeuCau, Id_NhanVien, TrangThai, GhiChu)
    SELECT Id_YeuCau, Id_NhanVien, TrangThaiHienTai, N'Tạo yêu cầu cứu hộ'
    FROM inserted;
END;
GO
CREATE TRIGGER trg_UpdateTrangThaiYeuCau
ON YEUCAU_CUUHO
AFTER UPDATE
AS
BEGIN
    IF UPDATE(TrangThaiHienTai)
    BEGIN
        INSERT INTO LICH_SU_TRANG_THAI_YEU_CAU(Id_YeuCau, Id_NhanVien, TrangThai, GhiChu)
        SELECT i.Id_YeuCau, i.Id_NhanVien, i.TrangThaiHienTai, N'Cập nhật trạng thái yêu cầu'
        FROM inserted i;
    END
END;
GO
CREATE TRIGGER trg_DeleteYeuCau
ON YEUCAU_CUUHO
INSTEAD OF DELETE
AS
BEGIN
    DELETE FROM TINNHAN
    WHERE Id_YeuCau IN (SELECT Id_YeuCau FROM deleted);

    DELETE FROM LICH_SU_TRANG_THAI_YEU_CAU
    WHERE Id_YeuCau IN (SELECT Id_YeuCau FROM deleted);

    DELETE FROM THANHTOAN
    WHERE Id_YeuCau IN (SELECT Id_YeuCau FROM deleted);

    DELETE FROM DANHGIA
    WHERE Id_YeuCau IN (SELECT Id_YeuCau FROM deleted);

    DELETE FROM KHIEUNAI
    WHERE Id_YeuCau IN (SELECT Id_YeuCau FROM deleted);

    DELETE FROM YEUCAU_CUUHO
    WHERE Id_YeuCau IN (SELECT Id_YeuCau FROM deleted);
END;
GO
CREATE TRIGGER trg_UpdateDiemTB_NhanVien
ON DANHGIA
AFTER INSERT
AS
BEGIN
    UPDATE NHANVIEN_CUUHO
    SET DiemTB = (
        SELECT AVG(CAST(SoSao AS FLOAT))
        FROM DANHGIA
        WHERE Id_NhanVien = NHANVIEN_CUUHO.Id_NhanVien
    )
    WHERE Id_NhanVien IN (SELECT Id_NhanVien FROM inserted);
END;
GO

-- ============================================
-- DỮ LIỆU MẪU (INSERT SCRIPT)
-- ============================================

-- TINH_THANH
INSERT INTO TINH_THANH (Ma_Tinh, Ten_Tinh) VALUES ('79', N'Hồ Chí Minh'), ('01', N'Hà Nội');
GO

-- PHUONG_XA
INSERT INTO PHUONG_XA (Id_Tinh_Thanh, Ma_Phuong_Xa, Ten_Phuong_Xa, KinhDo, ViDo) VALUES 
(1, '26734', N'Phường Bến Nghé, Quận 1', 106.702951, 10.776654),
(1, '26740', N'Phường Bến Thành, Quận 1', 106.695304, 10.772596),
(2, '00001', N'Phường Phúc Xá, Ba Đình', 105.845455, 21.042838);
GO

-- CCCD
INSERT INTO CCCD (Id_CCCD, NgayCap, NoiCap, TrangThaiXacMinh) VALUES
('079099001234', '2020-01-01', N'Cục CSQLHC về TTXH', N'DaXacMinh'),
('079099005678', '2021-05-15', N'Cục CSQLHC về TTXH', N'DaXacMinh');
GO

-- TAIKHOAN (Mật khẩu hash giả lập là 'hash123')
INSERT INTO TAIKHOAN (Id_CCCD, Email, MatKhauHash, SoDienThoai, VaiTro, TrangThai, HoTen, NgaySinh) VALUES
(NULL, 'admin@gmail.com', 'hash123', '0901234567', 'Admin', 'HoatDong', N'Quản Trị Viên', '1990-01-01'),
(NULL, 'khachhang1@gmail.com', 'hash123', '0912345678', 'KhachHang', 'HoatDong', N'Nguyễn Văn Khách', '1995-10-10'),
('079099001234', 'nhanvien1@gmail.com', 'hash123', '0987654321', 'NhanVien', 'HoatDong', N'Trần Cứu Hộ', '1992-05-05'),
('079099005678', 'nhanvien2@gmail.com', 'hash123', '0977777777', 'NhanVien', 'HoatDong', N'Lê Thợ Máy', '1988-08-08');
GO

-- THONGBAO
INSERT INTO THONGBAO (Id_TaiKhoanNhan, TieuDe, NoiDung, Loai) VALUES
(2, N'Chào mừng', N'Chào mừng bạn đến với hệ thống cứu hộ!', N'HeThong');
GO

-- KHACHHANG
INSERT INTO KHACHHANG (Id_TaiKhoan, Id_Phuong_Xa) VALUES
(2, 1);
GO

-- LOAI_XE
INSERT INTO LOAI_XE (TenLoaiXe, MoTa) VALUES
(N'Xe Máy', N'Xe gắn máy 2 bánh'),
(N'Ô Tô 4 chỗ', N'Xe ô tô dưới 5 chỗ ngồi'),
(N'Ô Tô 7 chỗ', N'Xe ô tô 7 chỗ ngồi');
GO

-- XE_KHACHHANG
INSERT INTO XE_KHACHHANG (Id_KhachHang, Id_LoaiXe, BienSo, HangXe, DongXe, MauXe) VALUES
(1, 1, '59A1-123.45', 'Honda', 'AirBlade', 'Đen'),
(1, 2, '51G-567.89', 'Toyota', 'Vios', 'Trắng');
GO

-- NHANVIEN_CUUHO
INSERT INTO NHANVIEN_CUUHO (Id_TaiKhoan, MoTa) VALUES
(3, N'Chuyên sửa xe máy'),
(4, N'Chuyên cứu hộ ô tô');
GO

-- NHANVIEN_KHUVUC
INSERT INTO NHANVIEN_KHUVUC (Id_NhanVien, Id_Phuong_Xa) VALUES
(1, 1),
(1, 2),
(2, 1);
GO

-- HOSO_DANGKY_NHANVIEN
INSERT INTO HOSO_DANGKY_NHANVIEN (Id_TaiKhoan, ThongTinXe, KinhNghiem, GiayTo, TrangThai) VALUES
(3, N'Xe tay ga', N'3 năm sửa xe', N'CCCD, Giấy phép lái xe', N'DaDuyet');
GO

-- DANHMUC_DICHVU
INSERT INTO DANHMUC_DICHVU (TenDanhMuc, MoTa) VALUES
(N'Cứu hộ ắc quy', N'Kích bình, thay ắc quy'),
(N'Cứu hộ lốp', N'Vá lốp, thay lốp dự phòng'),
(N'Kéo xe', N'Kéo xe về gara');
GO

-- DICHVU_CUUHO
INSERT INTO DICHVU_CUUHO (Id_DanhMuc, TenDichVu, MoTa, GiaCoBan) VALUES
(1, N'Kích bình ắc quy xe máy', N'Kích nổ xe máy', 50000),
(1, N'Kích bình ắc quy ô tô', N'Kích nổ ô tô', 150000),
(2, N'Vá lốp xe máy', N'Vá lốp tận nơi', 40000),
(3, N'Kéo xe ô tô 4 chỗ', N'Sử dụng xe chuyên dụng kéo về', 500000);
GO

-- NHANVIEN_DICHVU
INSERT INTO NHANVIEN_DICHVU (Id_NhanVien, Id_DichVu) VALUES
(1, 1), (1, 3),
(2, 2), (2, 4);
GO

-- YEUCAU_CUUHO
INSERT INTO YEUCAU_CUUHO (Id_KhachHang, Id_Xe, Id_DichVu, Id_NhanVien, Id_Phuong_Xa, MoTaSuCo, NoiSuCo, TrangThaiHienTai, PhiDichVu, ChiPhiDuKien) VALUES
(1, 1, 1, 1, 1, N'Xe không nổ máy do hết bình', N'Chợ Bến Thành', N'HoanThanh', 50000, 50000),
(1, 2, 4, 2, 2, N'Xe bị chết máy', N'Nhà thờ Đức Bà', N'DangXuLy', 500000, 500000);
GO

-- LICH_SU_TRANG_THAI_YEU_CAU
INSERT INTO LICH_SU_TRANG_THAI_YEU_CAU (Id_YeuCau, Id_NhanVien, TrangThai, GhiChu) VALUES
(1, NULL, N'TiepNhan', N'Tạo yêu cầu'),
(1, 1, N'DangXuLy', N'Nhận cuốc'),
(1, 1, N'HoanThanh', N'Hoàn thành');
GO

-- THANHTOAN
INSERT INTO THANHTOAN (Id_YeuCau, SoTien, PhuongThuc, TrangThai) VALUES
(1, 50000, N'TienMat', N'DaThanhToan');
GO

-- TINNHAN
INSERT INTO TINNHAN (Id_YeuCau, Id_TaiKhoanGui, NoiDung, Loai) VALUES
(1, 2, N'Anh tới nhanh nha xe tôi đang kẹt', N'Text'),
(1, 3, N'Tôi đang trên đường tới', N'Text');
GO

-- DANHGIA
INSERT INTO DANHGIA (Id_YeuCau, Id_KhachHang, Id_NhanVien, SoSao, NhanXet) VALUES
(1, 1, 1, 5, N'Nhân viên nhiệt tình, xử lý nhanh.');
GO

-- KHIEUNAI
-- Chưa có khiếu nại
