-- ============================================
-- TẠO DATABASE
-- ============================================
IF DB_ID('QL_CUUHOXE') IS NOT NULL
BEGIN
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