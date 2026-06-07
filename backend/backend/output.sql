CREATE TABLE [CCCD] (
    [Id_CCCD] varchar(20) NOT NULL,
    [NgayCap] date NULL,
    [NoiCap] nvarchar(100) NULL,
    [TrangThaiXacMinh] nvarchar(50) NULL,
    CONSTRAINT [PK__CCCD__5CB8261800EED78E] PRIMARY KEY ([Id_CCCD])
);
GO


CREATE TABLE [DANHMUC_DICHVU] (
    [Id_DanhMuc] int NOT NULL IDENTITY,
    [TenDanhMuc] nvarchar(100) NOT NULL,
    [MoTa] nvarchar(200) NULL,
    [TrangThai] nvarchar(50) NULL DEFAULT N'HoatDong',
    CONSTRAINT [PK__DANHMUC___9008DCCFDCF619DC] PRIMARY KEY ([Id_DanhMuc])
);
GO


CREATE TABLE [LOAI_XE] (
    [Id_LoaiXe] int NOT NULL IDENTITY,
    [TenLoaiXe] nvarchar(100) NOT NULL,
    [MoTa] nvarchar(200) NULL,
    [TrangThai] nvarchar(50) NULL DEFAULT N'HoatDong',
    CONSTRAINT [PK__LOAI_XE__673A623A33D38316] PRIMARY KEY ([Id_LoaiXe])
);
GO


CREATE TABLE [TINH_THANH] (
    [Id_Tinh_Thanh] int NOT NULL IDENTITY,
    [Ma_Tinh] varchar(10) NOT NULL,
    [Ten_Tinh] nvarchar(100) NOT NULL,
    CONSTRAINT [PK__TINH_THA__1386C52D41216B41] PRIMARY KEY ([Id_Tinh_Thanh])
);
GO


CREATE TABLE [TAIKHOAN] (
    [Id_TaiKhoan] int NOT NULL IDENTITY,
    [Id_CCCD] varchar(20) NULL,
    [Email] varchar(100) NOT NULL,
    [MatKhauHash] varchar(200) NOT NULL,
    [SoDienThoai] varchar(20) NOT NULL,
    [VaiTro] nvarchar(50) NOT NULL,
    [TrangThai] nvarchar(50) NOT NULL,
    [NgayTao] datetime NULL DEFAULT ((getdate())),
    [LanDangNhapCuoi] datetime NULL,
    [HoTen] nvarchar(100) NULL,
    [NgaySinh] date NULL,
    [Avatar] varchar(200) NULL,
    CONSTRAINT [PK__TAIKHOAN__B246CCA92E748A37] PRIMARY KEY ([Id_TaiKhoan]),
    CONSTRAINT [FK_TAIKHOAN_CCCD] FOREIGN KEY ([Id_CCCD]) REFERENCES [CCCD] ([Id_CCCD])
);
GO


CREATE TABLE [DICHVU_CUUHO] (
    [Id_DichVu] int NOT NULL IDENTITY,
    [Id_DanhMuc] int NOT NULL,
    [TenDichVu] nvarchar(100) NOT NULL,
    [MoTa] nvarchar(200) NULL,
    [GiaCoBan] decimal(18,2) NULL DEFAULT 0.0,
    [TrangThai] nvarchar(50) NULL DEFAULT N'HoatDong',
    [NgayCapNhat] datetime NULL DEFAULT ((getdate())),
    CONSTRAINT [PK__DICHVU_C__5D11860D5AC7487E] PRIMARY KEY ([Id_DichVu]),
    CONSTRAINT [FK_DICHVU_DANHMUC] FOREIGN KEY ([Id_DanhMuc]) REFERENCES [DANHMUC_DICHVU] ([Id_DanhMuc])
);
GO


CREATE TABLE [PHUONG_XA] (
    [Id_Phuong_Xa] int NOT NULL IDENTITY,
    [Id_Tinh_Thanh] int NOT NULL,
    [Ma_Phuong_Xa] varchar(10) NOT NULL,
    [Ten_Phuong_Xa] nvarchar(100) NOT NULL,
    [KinhDo] decimal(10,6) NULL,
    [ViDo] decimal(10,6) NULL,
    CONSTRAINT [PK__PHUONG_X__8508AB03A892F233] PRIMARY KEY ([Id_Phuong_Xa]),
    CONSTRAINT [FK_PHUONGXA_TINH] FOREIGN KEY ([Id_Tinh_Thanh]) REFERENCES [TINH_THANH] ([Id_Tinh_Thanh])
);
GO


CREATE TABLE [HOSO_DANGKY_NHANVIEN] (
    [Id_HoSo] int NOT NULL IDENTITY,
    [Id_TaiKhoan] int NOT NULL,
    [ThongTinXe] nvarchar(200) NULL,
    [KinhNghiem] nvarchar(200) NULL,
    [GiayTo] nvarchar(200) NULL,
    [TrangThai] nvarchar(50) NULL DEFAULT N'DangCho',
    [LyDoTuChoi] nvarchar(200) NULL,
    [NgayNop] datetime NULL DEFAULT ((getdate())),
    [NgayDuyet] datetime NULL,
    [TenNguoiDuyet] nvarchar(100) NULL,
    CONSTRAINT [PK__HOSO_DAN__FD78F52B372F64F3] PRIMARY KEY ([Id_HoSo]),
    CONSTRAINT [FK_HOSO_TAIKHOAN] FOREIGN KEY ([Id_TaiKhoan]) REFERENCES [TAIKHOAN] ([Id_TaiKhoan])
);
GO


CREATE TABLE [NHANVIEN_CUUHO] (
    [Id_NhanVien] int NOT NULL IDENTITY,
    [Id_TaiKhoan] int NOT NULL,
    [TrangThaiNhanViec] bit NULL DEFAULT CAST(1 AS bit),
    [DiemTB] decimal(3,2) NULL DEFAULT 0.0,
    [MoTa] nvarchar(200) NULL,
    CONSTRAINT [PK__NHANVIEN__670CF929C2F7820B] PRIMARY KEY ([Id_NhanVien]),
    CONSTRAINT [FK_NHANVIEN_TAIKHOAN] FOREIGN KEY ([Id_TaiKhoan]) REFERENCES [TAIKHOAN] ([Id_TaiKhoan])
);
GO


CREATE TABLE [THONGBAO] (
    [Id_ThongBao] int NOT NULL IDENTITY,
    [Id_TaiKhoanNhan] int NOT NULL,
    [TieuDe] nvarchar(200) NULL,
    [NoiDung] nvarchar(500) NULL,
    [Loai] nvarchar(50) NULL,
    [RefType] nvarchar(50) NULL,
    [RefId] int NULL,
    [DaDoc] bit NULL DEFAULT CAST(0 AS bit),
    [ThoiGian] datetime NULL DEFAULT ((getdate())),
    CONSTRAINT [PK__THONGBAO__2308CABBC093998D] PRIMARY KEY ([Id_ThongBao]),
    CONSTRAINT [FK_THONGBAO_TAIKHOAN] FOREIGN KEY ([Id_TaiKhoanNhan]) REFERENCES [TAIKHOAN] ([Id_TaiKhoan])
);
GO


CREATE TABLE [KHACHHANG] (
    [Id_KhachHang] int NOT NULL IDENTITY,
    [Id_TaiKhoan] int NOT NULL,
    [Id_Phuong_Xa] int NOT NULL,
    CONSTRAINT [PK__KHACHHAN__D0112EAF3E2D036C] PRIMARY KEY ([Id_KhachHang]),
    CONSTRAINT [FK_KHACHHANG_PHUONGXA] FOREIGN KEY ([Id_Phuong_Xa]) REFERENCES [PHUONG_XA] ([Id_Phuong_Xa]),
    CONSTRAINT [FK_KHACHHANG_TAIKHOAN] FOREIGN KEY ([Id_TaiKhoan]) REFERENCES [TAIKHOAN] ([Id_TaiKhoan])
);
GO


CREATE TABLE [NHANVIEN_DICHVU] (
    [Id_NhanVien] int NOT NULL,
    [Id_DichVu] int NOT NULL,
    CONSTRAINT [PK__NHANVIEN__A2DDE149F4482AE2] PRIMARY KEY ([Id_NhanVien], [Id_DichVu]),
    CONSTRAINT [FK_NVDV_DICHVU] FOREIGN KEY ([Id_DichVu]) REFERENCES [DICHVU_CUUHO] ([Id_DichVu]),
    CONSTRAINT [FK_NVDV_NHANVIEN] FOREIGN KEY ([Id_NhanVien]) REFERENCES [NHANVIEN_CUUHO] ([Id_NhanVien])
);
GO


CREATE TABLE [NHANVIEN_KHUVUC] (
    [Id_NhanVien] int NOT NULL,
    [Id_Phuong_Xa] int NOT NULL,
    CONSTRAINT [PK__NHANVIEN__4F5C7399DEF9835D] PRIMARY KEY ([Id_NhanVien], [Id_Phuong_Xa]),
    CONSTRAINT [FK_NVKV_NHANVIEN] FOREIGN KEY ([Id_NhanVien]) REFERENCES [NHANVIEN_CUUHO] ([Id_NhanVien]),
    CONSTRAINT [FK_NVKV_PHUONGXA] FOREIGN KEY ([Id_Phuong_Xa]) REFERENCES [PHUONG_XA] ([Id_Phuong_Xa])
);
GO


CREATE TABLE [XE_KHACHHANG] (
    [Id_Xe] int NOT NULL IDENTITY,
    [Id_KhachHang] int NOT NULL,
    [Id_LoaiXe] int NOT NULL,
    [BienSo] varchar(20) NOT NULL,
    [HangXe] nvarchar(50) NULL,
    [DongXe] nvarchar(50) NULL,
    [MauXe] nvarchar(50) NULL,
    [GhiChu] nvarchar(200) NULL,
    [NgayTao] datetime NULL DEFAULT ((getdate())),
    CONSTRAINT [PK__XE_KHACH__16EBB38063755C25] PRIMARY KEY ([Id_Xe]),
    CONSTRAINT [FK_XE_KHACHHANG] FOREIGN KEY ([Id_KhachHang]) REFERENCES [KHACHHANG] ([Id_KhachHang]),
    CONSTRAINT [FK_XE_LOAIXE] FOREIGN KEY ([Id_LoaiXe]) REFERENCES [LOAI_XE] ([Id_LoaiXe])
);
GO


CREATE TABLE [YEUCAU_CUUHO] (
    [Id_YeuCau] int NOT NULL IDENTITY,
    [Id_KhachHang] int NOT NULL,
    [Id_Xe] int NOT NULL,
    [Id_DichVu] int NOT NULL,
    [Id_NhanVien] int NULL,
    [Id_Phuong_Xa] int NOT NULL,
    [MoTaSuCo] nvarchar(300) NULL,
    [NoiSuCo] nvarchar(200) NULL,
    [TrangThaiHienTai] nvarchar(50) NULL DEFAULT N'TiepNhan',
    [PhiDichVu] decimal(18,2) NULL DEFAULT 0.0,
    [ChiPhiDuKien] decimal(18,2) NULL DEFAULT 0.0,
    [ChiPhiThucTe] decimal(18,2) NULL DEFAULT 0.0,
    [NgayTao] datetime NULL DEFAULT ((getdate())),
    [NgayHoanThanh] datetime NULL,
    [NgayHuy] datetime NULL,
    [LyDoHuy] nvarchar(200) NULL,
    [ImageUrl] nvarchar(max) NULL,
    CONSTRAINT [PK__YEUCAU_C__9BBAD74A4A9EC1A7] PRIMARY KEY ([Id_YeuCau]),
    CONSTRAINT [FK_YC_DICHVU] FOREIGN KEY ([Id_DichVu]) REFERENCES [DICHVU_CUUHO] ([Id_DichVu]),
    CONSTRAINT [FK_YC_KHACHHANG] FOREIGN KEY ([Id_KhachHang]) REFERENCES [KHACHHANG] ([Id_KhachHang]),
    CONSTRAINT [FK_YC_NHANVIEN] FOREIGN KEY ([Id_NhanVien]) REFERENCES [NHANVIEN_CUUHO] ([Id_NhanVien]),
    CONSTRAINT [FK_YC_PHUONGXA] FOREIGN KEY ([Id_Phuong_Xa]) REFERENCES [PHUONG_XA] ([Id_Phuong_Xa]),
    CONSTRAINT [FK_YC_XE] FOREIGN KEY ([Id_Xe]) REFERENCES [XE_KHACHHANG] ([Id_Xe])
);
GO


CREATE TABLE [DANHGIA] (
    [Id_DanhGia] int NOT NULL IDENTITY,
    [Id_YeuCau] int NOT NULL,
    [Id_KhachHang] int NOT NULL,
    [Id_NhanVien] int NOT NULL,
    [SoSao] int NULL,
    [NhanXet] nvarchar(300) NULL,
    [ThoiGian] datetime NULL DEFAULT ((getdate())),
    CONSTRAINT [PK__DANHGIA__908B4E8C082EBAB9] PRIMARY KEY ([Id_DanhGia]),
    CONSTRAINT [FK_DANHGIA_KHACHHANG] FOREIGN KEY ([Id_KhachHang]) REFERENCES [KHACHHANG] ([Id_KhachHang]),
    CONSTRAINT [FK_DANHGIA_NHANVIEN] FOREIGN KEY ([Id_NhanVien]) REFERENCES [NHANVIEN_CUUHO] ([Id_NhanVien]),
    CONSTRAINT [FK_DANHGIA_YEUCAU] FOREIGN KEY ([Id_YeuCau]) REFERENCES [YEUCAU_CUUHO] ([Id_YeuCau])
);
GO


CREATE TABLE [KHIEUNAI] (
    [Id_KhieuNai] int NOT NULL IDENTITY,
    [Id_YeuCau] int NOT NULL,
    [Id_KhachHang] int NOT NULL,
    [Id_NhanVien] int NULL,
    [LoaiKhieuNai] nvarchar(50) NULL,
    [NoiDung] nvarchar(500) NULL,
    [TrangThai] nvarchar(50) NULL,
    [KetQuaXuLy] nvarchar(300) NULL,
    [ThoiGianTao] datetime NULL DEFAULT ((getdate())),
    [ThoiGianCapNhat] datetime NULL DEFAULT ((getdate())),
    CONSTRAINT [PK__KHIEUNAI__12161D0F482BF6B3] PRIMARY KEY ([Id_KhieuNai]),
    CONSTRAINT [FK_KHIEUNAI_KHACHHANG] FOREIGN KEY ([Id_KhachHang]) REFERENCES [KHACHHANG] ([Id_KhachHang]),
    CONSTRAINT [FK_KHIEUNAI_NHANVIEN] FOREIGN KEY ([Id_NhanVien]) REFERENCES [NHANVIEN_CUUHO] ([Id_NhanVien]),
    CONSTRAINT [FK_KHIEUNAI_YEUCAU] FOREIGN KEY ([Id_YeuCau]) REFERENCES [YEUCAU_CUUHO] ([Id_YeuCau])
);
GO


CREATE TABLE [LICH_SU_TRANG_THAI_YEU_CAU] (
    [Id_LichSu] int NOT NULL IDENTITY,
    [Id_YeuCau] int NOT NULL,
    [Id_NhanVien] int NULL,
    [TrangThai] nvarchar(50) NULL,
    [GhiChu] nvarchar(200) NULL,
    [ThoiGianCapNhat] datetime NULL DEFAULT ((getdate())),
    CONSTRAINT [PK__LICH_SU___AA34A582A06D19DE] PRIMARY KEY ([Id_LichSu]),
    CONSTRAINT [FK_LS_NHANVIEN] FOREIGN KEY ([Id_NhanVien]) REFERENCES [NHANVIEN_CUUHO] ([Id_NhanVien]),
    CONSTRAINT [FK_LS_YEUCAU] FOREIGN KEY ([Id_YeuCau]) REFERENCES [YEUCAU_CUUHO] ([Id_YeuCau])
);
GO


CREATE TABLE [THANHTOAN] (
    [Id_ThanhToan] int NOT NULL IDENTITY,
    [Id_YeuCau] int NOT NULL,
    [SoTien] decimal(18,2) NULL DEFAULT 0.0,
    [PhuongThuc] nvarchar(50) NULL,
    [TrangThai] nvarchar(50) NULL,
    [MaGiaoDich] varchar(100) NULL,
    [LoaiGiaoDich] nvarchar(50) NULL,
    [ThoiGian] datetime NULL DEFAULT ((getdate())),
    CONSTRAINT [PK__THANHTOA__1B4D845BDF7B6408] PRIMARY KEY ([Id_ThanhToan]),
    CONSTRAINT [FK_THANHTOAN_YEUCAU] FOREIGN KEY ([Id_YeuCau]) REFERENCES [YEUCAU_CUUHO] ([Id_YeuCau])
);
GO


CREATE TABLE [TINNHAN] (
    [Id_TinNhan] int NOT NULL IDENTITY,
    [Id_YeuCau] int NOT NULL,
    [Id_TaiKhoanGui] int NOT NULL,
    [NoiDung] nvarchar(500) NULL,
    [Loai] nvarchar(50) NULL,
    [FileUrl] varchar(200) NULL,
    [ThoiGianGui] datetime NULL DEFAULT ((getdate())),
    CONSTRAINT [PK__TINNHAN__8D9DCEFD407863CA] PRIMARY KEY ([Id_TinNhan]),
    CONSTRAINT [FK_TINNHAN_TAIKHOAN] FOREIGN KEY ([Id_TaiKhoanGui]) REFERENCES [TAIKHOAN] ([Id_TaiKhoan]),
    CONSTRAINT [FK_TINNHAN_YEUCAU] FOREIGN KEY ([Id_YeuCau]) REFERENCES [YEUCAU_CUUHO] ([Id_YeuCau])
);
GO


CREATE INDEX [IX_DANHGIA_Id_KhachHang] ON [DANHGIA] ([Id_KhachHang]);
GO


CREATE INDEX [IX_DANHGIA_Id_NhanVien] ON [DANHGIA] ([Id_NhanVien]);
GO


CREATE INDEX [IX_DANHGIA_Id_YeuCau] ON [DANHGIA] ([Id_YeuCau]);
GO


CREATE INDEX [IX_DICHVU_CUUHO_Id_DanhMuc] ON [DICHVU_CUUHO] ([Id_DanhMuc]);
GO


CREATE INDEX [IX_HOSO_DANGKY_NHANVIEN_Id_TaiKhoan] ON [HOSO_DANGKY_NHANVIEN] ([Id_TaiKhoan]);
GO


CREATE INDEX [IX_KHACHHANG_Id_Phuong_Xa] ON [KHACHHANG] ([Id_Phuong_Xa]);
GO


CREATE INDEX [IX_KHACHHANG_Id_TaiKhoan] ON [KHACHHANG] ([Id_TaiKhoan]);
GO


CREATE INDEX [IX_KHIEUNAI_Id_KhachHang] ON [KHIEUNAI] ([Id_KhachHang]);
GO


CREATE INDEX [IX_KHIEUNAI_Id_NhanVien] ON [KHIEUNAI] ([Id_NhanVien]);
GO


CREATE INDEX [IX_KHIEUNAI_Id_YeuCau] ON [KHIEUNAI] ([Id_YeuCau]);
GO


CREATE INDEX [IX_LICH_SU_TRANG_THAI_YEU_CAU_Id_NhanVien] ON [LICH_SU_TRANG_THAI_YEU_CAU] ([Id_NhanVien]);
GO


CREATE INDEX [IX_LICH_SU_TRANG_THAI_YEU_CAU_Id_YeuCau] ON [LICH_SU_TRANG_THAI_YEU_CAU] ([Id_YeuCau]);
GO


CREATE INDEX [IX_NHANVIEN_CUUHO_Id_TaiKhoan] ON [NHANVIEN_CUUHO] ([Id_TaiKhoan]);
GO


CREATE INDEX [IX_NHANVIEN_DICHVU_Id_DichVu] ON [NHANVIEN_DICHVU] ([Id_DichVu]);
GO


CREATE INDEX [IX_NHANVIEN_KHUVUC_Id_Phuong_Xa] ON [NHANVIEN_KHUVUC] ([Id_Phuong_Xa]);
GO


CREATE INDEX [IX_PHUONG_XA_Id_Tinh_Thanh] ON [PHUONG_XA] ([Id_Tinh_Thanh]);
GO


CREATE INDEX [IX_TAIKHOAN_Id_CCCD] ON [TAIKHOAN] ([Id_CCCD]);
GO


CREATE INDEX [IX_THANHTOAN_Id_YeuCau] ON [THANHTOAN] ([Id_YeuCau]);
GO


CREATE INDEX [IX_THONGBAO_Id_TaiKhoanNhan] ON [THONGBAO] ([Id_TaiKhoanNhan]);
GO


CREATE INDEX [IX_TINNHAN_Id_TaiKhoanGui] ON [TINNHAN] ([Id_TaiKhoanGui]);
GO


CREATE INDEX [IX_TINNHAN_Id_YeuCau] ON [TINNHAN] ([Id_YeuCau]);
GO


CREATE INDEX [IX_XE_KHACHHANG_Id_KhachHang] ON [XE_KHACHHANG] ([Id_KhachHang]);
GO


CREATE INDEX [IX_XE_KHACHHANG_Id_LoaiXe] ON [XE_KHACHHANG] ([Id_LoaiXe]);
GO


CREATE INDEX [IX_YEUCAU_CUUHO_Id_DichVu] ON [YEUCAU_CUUHO] ([Id_DichVu]);
GO


CREATE INDEX [IX_YEUCAU_CUUHO_Id_KhachHang] ON [YEUCAU_CUUHO] ([Id_KhachHang]);
GO


CREATE INDEX [IX_YEUCAU_CUUHO_Id_NhanVien] ON [YEUCAU_CUUHO] ([Id_NhanVien]);
GO


CREATE INDEX [IX_YEUCAU_CUUHO_Id_Phuong_Xa] ON [YEUCAU_CUUHO] ([Id_Phuong_Xa]);
GO


CREATE INDEX [IX_YEUCAU_CUUHO_Id_Xe] ON [YEUCAU_CUUHO] ([Id_Xe]);
GO


