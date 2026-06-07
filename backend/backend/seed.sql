USE QL_CUUHOXE;

DECLARE @idPhuongXa INT;
SELECT TOP 1 @idPhuongXa = Id_Phuong_Xa FROM PHUONG_XA;

IF @idPhuongXa IS NULL
BEGIN
    -- Tao tinh thanh
    INSERT INTO TINH_THANH (Ma_Tinh, Ten_Tinh) VALUES ('T-001', N'Hà Nội');
    DECLARE @idTinh INT = SCOPE_IDENTITY();
    
    -- Tao phuong xa
    INSERT INTO PHUONG_XA (Id_Tinh_Thanh, Ma_Phuong_Xa, Ten_Phuong_Xa) VALUES (@idTinh, 'PX-001', N'Phường 1');
    SET @idPhuongXa = SCOPE_IDENTITY();
END

-- Khach 1
INSERT INTO TAIKHOAN (Email, MatKhauHash, HoTen, SoDienThoai, VaiTro, TrangThai) 
VALUES ('khachhang1@gmail.com', '123456', N'Trần Khách Hàng', '0988111111', 'KhachHang', 'HoatDong');
DECLARE @idKhach1 INT = SCOPE_IDENTITY();
INSERT INTO KHACHHANG (Id_TaiKhoan, Id_Phuong_Xa) VALUES (@idKhach1, @idPhuongXa);

-- Khach 2
INSERT INTO TAIKHOAN (Email, MatKhauHash, HoTen, SoDienThoai, VaiTro, TrangThai) 
VALUES ('khachhang2@gmail.com', '123456', N'Lê Khách Hàng', '0988222222', 'KhachHang', 'HoatDong');
DECLARE @idKhach2 INT = SCOPE_IDENTITY();
INSERT INTO KHACHHANG (Id_TaiKhoan, Id_Phuong_Xa) VALUES (@idKhach2, @idPhuongXa);

-- Nhan vien 1
INSERT INTO TAIKHOAN (Email, MatKhauHash, HoTen, SoDienThoai, VaiTro, TrangThai) 
VALUES ('nhanvien1@gmail.com', '123456', N'Nguyễn Nhân Viên', '0988333333', 'NhanVien', 'HoatDong');
DECLARE @idNv1 INT = SCOPE_IDENTITY();
INSERT INTO NHANVIEN_CUUHO (Id_TaiKhoan, MoTa, DiemTB, TrangThaiNhanViec) 
VALUES (@idNv1, N'Thợ máy giỏi', 5.0, 1);

-- Nhan vien 2
INSERT INTO TAIKHOAN (Email, MatKhauHash, HoTen, SoDienThoai, VaiTro, TrangThai) 
VALUES ('nhanvien2@gmail.com', '123456', N'Phạm Nhân Viên', '0988444444', 'NhanVien', 'HoatDong');
DECLARE @idNv2 INT = SCOPE_IDENTITY();
INSERT INTO NHANVIEN_CUUHO (Id_TaiKhoan, MoTa, DiemTB, TrangThaiNhanViec) 
VALUES (@idNv2, N'Chuyên vá lốp', 4.5, 1);

PRINT 'Thêm dữ liệu mẫu thành công!';
GO
