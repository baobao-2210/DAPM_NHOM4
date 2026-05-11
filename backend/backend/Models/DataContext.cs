using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public partial class DataContext : DbContext
{
    public DataContext()
    {
    }

    public DataContext(DbContextOptions<DataContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cccd> Cccds { get; set; }

    public virtual DbSet<Danhgium> Danhgia { get; set; }

    public virtual DbSet<DanhmucDichvu> DanhmucDichvus { get; set; }

    public virtual DbSet<DichvuCuuho> DichvuCuuhos { get; set; }

    public virtual DbSet<HosoDangkyNhanvien> HosoDangkyNhanviens { get; set; }

    public virtual DbSet<Khachhang> Khachhangs { get; set; }

    public virtual DbSet<Khieunai> Khieunais { get; set; }

    public virtual DbSet<LichSuTrangThaiYeuCau> LichSuTrangThaiYeuCaus { get; set; }

    public virtual DbSet<LoaiXe> LoaiXes { get; set; }

    public virtual DbSet<NhanvienCuuho> NhanvienCuuhos { get; set; }

    public virtual DbSet<PhuongXa> PhuongXas { get; set; }

    public virtual DbSet<Taikhoan> Taikhoans { get; set; }

    public virtual DbSet<Thanhtoan> Thanhtoans { get; set; }

    public virtual DbSet<Thongbao> Thongbaos { get; set; }

    public virtual DbSet<TinhThanh> TinhThanhs { get; set; }

    public virtual DbSet<Tinnhan> Tinnhans { get; set; }

    public virtual DbSet<XeKhachhang> XeKhachhangs { get; set; }

    public virtual DbSet<YeucauCuuho> YeucauCuuhos { get; set; }

   
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cccd>(entity =>
        {
            entity.HasKey(e => e.IdCccd).HasName("PK__CCCD__5CB8261800EED78E");

            entity.ToTable("CCCD");

            entity.Property(e => e.IdCccd)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Id_CCCD");
            entity.Property(e => e.NoiCap).HasMaxLength(100);
            entity.Property(e => e.TrangThaiXacMinh).HasMaxLength(50);
        });

        modelBuilder.Entity<Danhgium>(entity =>
        {
            entity.HasKey(e => e.IdDanhGia).HasName("PK__DANHGIA__908B4E8C082EBAB9");

            entity.ToTable("DANHGIA", tb =>
                {
                    tb.HasTrigger("trg_CheckDanhGia");
                    tb.HasTrigger("trg_UpdateDiemTB_NhanVien");
                });

            entity.Property(e => e.IdDanhGia).HasColumnName("Id_DanhGia");
            entity.Property(e => e.IdKhachHang).HasColumnName("Id_KhachHang");
            entity.Property(e => e.IdNhanVien).HasColumnName("Id_NhanVien");
            entity.Property(e => e.IdYeuCau).HasColumnName("Id_YeuCau");
            entity.Property(e => e.NhanXet).HasMaxLength(300);
            entity.Property(e => e.ThoiGian)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdKhachHangNavigation).WithMany(p => p.Danhgia)
                .HasForeignKey(d => d.IdKhachHang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DANHGIA_KHACHHANG");

            entity.HasOne(d => d.IdNhanVienNavigation).WithMany(p => p.Danhgia)
                .HasForeignKey(d => d.IdNhanVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DANHGIA_NHANVIEN");

            entity.HasOne(d => d.IdYeuCauNavigation).WithMany(p => p.Danhgia)
                .HasForeignKey(d => d.IdYeuCau)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DANHGIA_YEUCAU");
        });

        modelBuilder.Entity<DanhmucDichvu>(entity =>
        {
            entity.HasKey(e => e.IdDanhMuc).HasName("PK__DANHMUC___9008DCCFDCF619DC");

            entity.ToTable("DANHMUC_DICHVU");

            entity.Property(e => e.IdDanhMuc).HasColumnName("Id_DanhMuc");
            entity.Property(e => e.MoTa).HasMaxLength(200);
            entity.Property(e => e.TenDanhMuc).HasMaxLength(100);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(50)
                .HasDefaultValue("HoatDong");
        });

        modelBuilder.Entity<DichvuCuuho>(entity =>
        {
            entity.HasKey(e => e.IdDichVu).HasName("PK__DICHVU_C__5D11860D5AC7487E");

            entity.ToTable("DICHVU_CUUHO");

            entity.Property(e => e.IdDichVu).HasColumnName("Id_DichVu");
            entity.Property(e => e.GiaCoBan)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.IdDanhMuc).HasColumnName("Id_DanhMuc");
            entity.Property(e => e.MoTa).HasMaxLength(200);
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TenDichVu).HasMaxLength(100);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(50)
                .HasDefaultValue("HoatDong");

            entity.HasOne(d => d.IdDanhMucNavigation).WithMany(p => p.DichvuCuuhos)
                .HasForeignKey(d => d.IdDanhMuc)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DICHVU_DANHMUC");
        });

        modelBuilder.Entity<HosoDangkyNhanvien>(entity =>
        {
            entity.HasKey(e => e.IdHoSo).HasName("PK__HOSO_DAN__FD78F52B372F64F3");

            entity.ToTable("HOSO_DANGKY_NHANVIEN");

            entity.Property(e => e.IdHoSo).HasColumnName("Id_HoSo");
            entity.Property(e => e.GiayTo).HasMaxLength(200);
            entity.Property(e => e.IdTaiKhoan).HasColumnName("Id_TaiKhoan");
            entity.Property(e => e.KinhNghiem).HasMaxLength(200);
            entity.Property(e => e.LyDoTuChoi).HasMaxLength(200);
            entity.Property(e => e.NgayDuyet).HasColumnType("datetime");
            entity.Property(e => e.NgayNop)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TenNguoiDuyet).HasMaxLength(100);
            entity.Property(e => e.ThongTinXe).HasMaxLength(200);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(50)
                .HasDefaultValue("DangCho");

            entity.HasOne(d => d.IdTaiKhoanNavigation).WithMany(p => p.HosoDangkyNhanviens)
                .HasForeignKey(d => d.IdTaiKhoan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_HOSO_TAIKHOAN");
        });

        modelBuilder.Entity<Khachhang>(entity =>
        {
            entity.HasKey(e => e.IdKhachHang).HasName("PK__KHACHHAN__D0112EAF3E2D036C");

            entity.ToTable("KHACHHANG");

            entity.Property(e => e.IdKhachHang).HasColumnName("Id_KhachHang");
            entity.Property(e => e.IdPhuongXa).HasColumnName("Id_Phuong_Xa");
            entity.Property(e => e.IdTaiKhoan).HasColumnName("Id_TaiKhoan");

            entity.HasOne(d => d.IdPhuongXaNavigation).WithMany(p => p.Khachhangs)
                .HasForeignKey(d => d.IdPhuongXa)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_KHACHHANG_PHUONGXA");

            entity.HasOne(d => d.IdTaiKhoanNavigation).WithMany(p => p.Khachhangs)
                .HasForeignKey(d => d.IdTaiKhoan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_KHACHHANG_TAIKHOAN");
        });

        modelBuilder.Entity<Khieunai>(entity =>
        {
            entity.HasKey(e => e.IdKhieuNai).HasName("PK__KHIEUNAI__12161D0F482BF6B3");

            entity.ToTable("KHIEUNAI");

            entity.Property(e => e.IdKhieuNai).HasColumnName("Id_KhieuNai");
            entity.Property(e => e.IdKhachHang).HasColumnName("Id_KhachHang");
            entity.Property(e => e.IdNhanVien).HasColumnName("Id_NhanVien");
            entity.Property(e => e.IdYeuCau).HasColumnName("Id_YeuCau");
            entity.Property(e => e.KetQuaXuLy).HasMaxLength(300);
            entity.Property(e => e.LoaiKhieuNai).HasMaxLength(50);
            entity.Property(e => e.NoiDung).HasMaxLength(500);
            entity.Property(e => e.ThoiGianCapNhat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ThoiGianTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TrangThai).HasMaxLength(50);

            entity.HasOne(d => d.IdKhachHangNavigation).WithMany(p => p.Khieunais)
                .HasForeignKey(d => d.IdKhachHang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_KHIEUNAI_KHACHHANG");

            entity.HasOne(d => d.IdNhanVienNavigation).WithMany(p => p.Khieunais)
                .HasForeignKey(d => d.IdNhanVien)
                .HasConstraintName("FK_KHIEUNAI_NHANVIEN");

            entity.HasOne(d => d.IdYeuCauNavigation).WithMany(p => p.Khieunais)
                .HasForeignKey(d => d.IdYeuCau)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_KHIEUNAI_YEUCAU");
        });

        modelBuilder.Entity<LichSuTrangThaiYeuCau>(entity =>
        {
            entity.HasKey(e => e.IdLichSu).HasName("PK__LICH_SU___AA34A582A06D19DE");

            entity.ToTable("LICH_SU_TRANG_THAI_YEU_CAU");

            entity.Property(e => e.IdLichSu).HasColumnName("Id_LichSu");
            entity.Property(e => e.GhiChu).HasMaxLength(200);
            entity.Property(e => e.IdNhanVien).HasColumnName("Id_NhanVien");
            entity.Property(e => e.IdYeuCau).HasColumnName("Id_YeuCau");
            entity.Property(e => e.ThoiGianCapNhat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TrangThai).HasMaxLength(50);

            entity.HasOne(d => d.IdNhanVienNavigation).WithMany(p => p.LichSuTrangThaiYeuCaus)
                .HasForeignKey(d => d.IdNhanVien)
                .HasConstraintName("FK_LS_NHANVIEN");

            entity.HasOne(d => d.IdYeuCauNavigation).WithMany(p => p.LichSuTrangThaiYeuCaus)
                .HasForeignKey(d => d.IdYeuCau)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LS_YEUCAU");
        });

        modelBuilder.Entity<LoaiXe>(entity =>
        {
            entity.HasKey(e => e.IdLoaiXe).HasName("PK__LOAI_XE__673A623A33D38316");

            entity.ToTable("LOAI_XE");

            entity.Property(e => e.IdLoaiXe).HasColumnName("Id_LoaiXe");
            entity.Property(e => e.MoTa).HasMaxLength(200);
            entity.Property(e => e.TenLoaiXe).HasMaxLength(100);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(50)
                .HasDefaultValue("HoatDong");
        });

        modelBuilder.Entity<NhanvienCuuho>(entity =>
        {
            entity.HasKey(e => e.IdNhanVien).HasName("PK__NHANVIEN__670CF929C2F7820B");

            entity.ToTable("NHANVIEN_CUUHO");

            entity.Property(e => e.IdNhanVien).HasColumnName("Id_NhanVien");
            entity.Property(e => e.DiemTb)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(3, 2)")
                .HasColumnName("DiemTB");
            entity.Property(e => e.IdTaiKhoan).HasColumnName("Id_TaiKhoan");
            entity.Property(e => e.MoTa).HasMaxLength(200);
            entity.Property(e => e.TrangThaiNhanViec).HasDefaultValue(true);

            entity.HasOne(d => d.IdTaiKhoanNavigation).WithMany(p => p.NhanvienCuuhos)
                .HasForeignKey(d => d.IdTaiKhoan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_NHANVIEN_TAIKHOAN");

            entity.HasMany(d => d.IdDichVus).WithMany(p => p.IdNhanViens)
                .UsingEntity<Dictionary<string, object>>(
                    "NhanvienDichvu",
                    r => r.HasOne<DichvuCuuho>().WithMany()
                        .HasForeignKey("IdDichVu")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_NVDV_DICHVU"),
                    l => l.HasOne<NhanvienCuuho>().WithMany()
                        .HasForeignKey("IdNhanVien")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_NVDV_NHANVIEN"),
                    j =>
                    {
                        j.HasKey("IdNhanVien", "IdDichVu").HasName("PK__NHANVIEN__A2DDE149F4482AE2");
                        j.ToTable("NHANVIEN_DICHVU");
                        j.IndexerProperty<int>("IdNhanVien").HasColumnName("Id_NhanVien");
                        j.IndexerProperty<int>("IdDichVu").HasColumnName("Id_DichVu");
                    });

            entity.HasMany(d => d.IdPhuongXas).WithMany(p => p.IdNhanViens)
                .UsingEntity<Dictionary<string, object>>(
                    "NhanvienKhuvuc",
                    r => r.HasOne<PhuongXa>().WithMany()
                        .HasForeignKey("IdPhuongXa")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_NVKV_PHUONGXA"),
                    l => l.HasOne<NhanvienCuuho>().WithMany()
                        .HasForeignKey("IdNhanVien")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_NVKV_NHANVIEN"),
                    j =>
                    {
                        j.HasKey("IdNhanVien", "IdPhuongXa").HasName("PK__NHANVIEN__4F5C7399DEF9835D");
                        j.ToTable("NHANVIEN_KHUVUC");
                        j.IndexerProperty<int>("IdNhanVien").HasColumnName("Id_NhanVien");
                        j.IndexerProperty<int>("IdPhuongXa").HasColumnName("Id_Phuong_Xa");
                    });
        });

        modelBuilder.Entity<PhuongXa>(entity =>
        {
            entity.HasKey(e => e.IdPhuongXa).HasName("PK__PHUONG_X__8508AB03A892F233");

            entity.ToTable("PHUONG_XA");

            entity.Property(e => e.IdPhuongXa).HasColumnName("Id_Phuong_Xa");
            entity.Property(e => e.IdTinhThanh).HasColumnName("Id_Tinh_Thanh");
            entity.Property(e => e.KinhDo).HasColumnType("decimal(10, 6)");
            entity.Property(e => e.MaPhuongXa)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Ma_Phuong_Xa");
            entity.Property(e => e.TenPhuongXa)
                .HasMaxLength(100)
                .HasColumnName("Ten_Phuong_Xa");
            entity.Property(e => e.ViDo).HasColumnType("decimal(10, 6)");

            entity.HasOne(d => d.IdTinhThanhNavigation).WithMany(p => p.PhuongXas)
                .HasForeignKey(d => d.IdTinhThanh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PHUONGXA_TINH");
        });

        modelBuilder.Entity<Taikhoan>(entity =>
        {
            entity.HasKey(e => e.IdTaiKhoan).HasName("PK__TAIKHOAN__B246CCA92E748A37");

            entity.ToTable("TAIKHOAN");

            entity.Property(e => e.IdTaiKhoan).HasColumnName("Id_TaiKhoan");
            entity.Property(e => e.Avatar)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.HoTen).HasMaxLength(100);
            entity.Property(e => e.IdCccd)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Id_CCCD");
            entity.Property(e => e.LanDangNhapCuoi).HasColumnType("datetime");
            entity.Property(e => e.MatKhauHash)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.TrangThai).HasMaxLength(50);
            entity.Property(e => e.VaiTro).HasMaxLength(50);

            entity.HasOne(d => d.IdCccdNavigation).WithMany(p => p.Taikhoans)
                .HasForeignKey(d => d.IdCccd)
                .HasConstraintName("FK_TAIKHOAN_CCCD");
        });

        modelBuilder.Entity<Thanhtoan>(entity =>
        {
            entity.HasKey(e => e.IdThanhToan).HasName("PK__THANHTOA__1B4D845BDF7B6408");

            entity.ToTable("THANHTOAN", tb => tb.HasTrigger("trg_CheckThanhToan"));

            entity.Property(e => e.IdThanhToan).HasColumnName("Id_ThanhToan");
            entity.Property(e => e.IdYeuCau).HasColumnName("Id_YeuCau");
            entity.Property(e => e.LoaiGiaoDich).HasMaxLength(50);
            entity.Property(e => e.MaGiaoDich)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.PhuongThuc).HasMaxLength(50);
            entity.Property(e => e.SoTien)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ThoiGian)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TrangThai).HasMaxLength(50);

            entity.HasOne(d => d.IdYeuCauNavigation).WithMany(p => p.Thanhtoans)
                .HasForeignKey(d => d.IdYeuCau)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_THANHTOAN_YEUCAU");
        });

        modelBuilder.Entity<Thongbao>(entity =>
        {
            entity.HasKey(e => e.IdThongBao).HasName("PK__THONGBAO__2308CABBC093998D");

            entity.ToTable("THONGBAO");

            entity.Property(e => e.IdThongBao).HasColumnName("Id_ThongBao");
            entity.Property(e => e.DaDoc).HasDefaultValue(false);
            entity.Property(e => e.IdTaiKhoanNhan).HasColumnName("Id_TaiKhoanNhan");
            entity.Property(e => e.Loai).HasMaxLength(50);
            entity.Property(e => e.NoiDung).HasMaxLength(500);
            entity.Property(e => e.RefType).HasMaxLength(50);
            entity.Property(e => e.ThoiGian)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TieuDe).HasMaxLength(200);

            entity.HasOne(d => d.IdTaiKhoanNhanNavigation).WithMany(p => p.Thongbaos)
                .HasForeignKey(d => d.IdTaiKhoanNhan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_THONGBAO_TAIKHOAN");
        });

        modelBuilder.Entity<TinhThanh>(entity =>
        {
            entity.HasKey(e => e.IdTinhThanh).HasName("PK__TINH_THA__1386C52D41216B41");

            entity.ToTable("TINH_THANH");

            entity.Property(e => e.IdTinhThanh).HasColumnName("Id_Tinh_Thanh");
            entity.Property(e => e.MaTinh)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Ma_Tinh");
            entity.Property(e => e.TenTinh)
                .HasMaxLength(100)
                .HasColumnName("Ten_Tinh");
        });

        modelBuilder.Entity<Tinnhan>(entity =>
        {
            entity.HasKey(e => e.IdTinNhan).HasName("PK__TINNHAN__8D9DCEFD407863CA");

            entity.ToTable("TINNHAN");

            entity.Property(e => e.IdTinNhan).HasColumnName("Id_TinNhan");
            entity.Property(e => e.FileUrl)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.IdTaiKhoanGui).HasColumnName("Id_TaiKhoanGui");
            entity.Property(e => e.IdYeuCau).HasColumnName("Id_YeuCau");
            entity.Property(e => e.Loai).HasMaxLength(50);
            entity.Property(e => e.NoiDung).HasMaxLength(500);
            entity.Property(e => e.ThoiGianGui)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdTaiKhoanGuiNavigation).WithMany(p => p.Tinnhans)
                .HasForeignKey(d => d.IdTaiKhoanGui)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TINNHAN_TAIKHOAN");

            entity.HasOne(d => d.IdYeuCauNavigation).WithMany(p => p.Tinnhans)
                .HasForeignKey(d => d.IdYeuCau)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TINNHAN_YEUCAU");
        });

        modelBuilder.Entity<XeKhachhang>(entity =>
        {
            entity.HasKey(e => e.IdXe).HasName("PK__XE_KHACH__16EBB38063755C25");

            entity.ToTable("XE_KHACHHANG");

            entity.Property(e => e.IdXe).HasColumnName("Id_Xe");
            entity.Property(e => e.BienSo)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.DongXe).HasMaxLength(50);
            entity.Property(e => e.GhiChu).HasMaxLength(200);
            entity.Property(e => e.HangXe).HasMaxLength(50);
            entity.Property(e => e.IdKhachHang).HasColumnName("Id_KhachHang");
            entity.Property(e => e.IdLoaiXe).HasColumnName("Id_LoaiXe");
            entity.Property(e => e.MauXe).HasMaxLength(50);
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.IdKhachHangNavigation).WithMany(p => p.XeKhachhangs)
                .HasForeignKey(d => d.IdKhachHang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_XE_KHACHHANG");

            entity.HasOne(d => d.IdLoaiXeNavigation).WithMany(p => p.XeKhachhangs)
                .HasForeignKey(d => d.IdLoaiXe)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_XE_LOAIXE");
        });

        modelBuilder.Entity<YeucauCuuho>(entity =>
        {
            entity.HasKey(e => e.IdYeuCau).HasName("PK__YEUCAU_C__9BBAD74A4A9EC1A7");

            entity.ToTable("YEUCAU_CUUHO", tb =>
                {
                    tb.HasTrigger("trg_CheckXeThuocKhachHang");
                    tb.HasTrigger("trg_DeleteYeuCau");
                    tb.HasTrigger("trg_InsertYeuCau_AddLichSu");
                    tb.HasTrigger("trg_UpdateTrangThaiYeuCau");
                });

            entity.Property(e => e.IdYeuCau).HasColumnName("Id_YeuCau");
            entity.Property(e => e.ChiPhiDuKien)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ChiPhiThucTe)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.IdDichVu).HasColumnName("Id_DichVu");
            entity.Property(e => e.IdKhachHang).HasColumnName("Id_KhachHang");
            entity.Property(e => e.IdNhanVien).HasColumnName("Id_NhanVien");
            entity.Property(e => e.IdPhuongXa).HasColumnName("Id_Phuong_Xa");
            entity.Property(e => e.IdXe).HasColumnName("Id_Xe");
            entity.Property(e => e.LyDoHuy).HasMaxLength(200);
            entity.Property(e => e.MoTaSuCo).HasMaxLength(300);
            entity.Property(e => e.NgayHoanThanh).HasColumnType("datetime");
            entity.Property(e => e.NgayHuy).HasColumnType("datetime");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NoiSuCo).HasMaxLength(200);
            entity.Property(e => e.PhiDichVu)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TrangThaiHienTai)
                .HasMaxLength(50)
                .HasDefaultValue("TiepNhan");

            entity.HasOne(d => d.IdDichVuNavigation).WithMany(p => p.YeucauCuuhos)
                .HasForeignKey(d => d.IdDichVu)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_YC_DICHVU");

            entity.HasOne(d => d.IdKhachHangNavigation).WithMany(p => p.YeucauCuuhos)
                .HasForeignKey(d => d.IdKhachHang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_YC_KHACHHANG");

            entity.HasOne(d => d.IdNhanVienNavigation).WithMany(p => p.YeucauCuuhos)
                .HasForeignKey(d => d.IdNhanVien)
                .HasConstraintName("FK_YC_NHANVIEN");

            entity.HasOne(d => d.IdPhuongXaNavigation).WithMany(p => p.YeucauCuuhos)
                .HasForeignKey(d => d.IdPhuongXa)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_YC_PHUONGXA");

            entity.HasOne(d => d.IdXeNavigation).WithMany(p => p.YeucauCuuhos)
                .HasForeignKey(d => d.IdXe)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_YC_XE");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
