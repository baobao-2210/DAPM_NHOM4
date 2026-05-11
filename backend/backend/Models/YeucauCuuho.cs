using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class YeucauCuuho
{
    public int IdYeuCau { get; set; }

    public int IdKhachHang { get; set; }

    public int IdXe { get; set; }

    public int IdDichVu { get; set; }

    public int? IdNhanVien { get; set; }

    public int IdPhuongXa { get; set; }

    public string? MoTaSuCo { get; set; }

    public string? NoiSuCo { get; set; }

    public string? TrangThaiHienTai { get; set; }

    public decimal? PhiDichVu { get; set; }

    public decimal? ChiPhiDuKien { get; set; }

    public decimal? ChiPhiThucTe { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayHoanThanh { get; set; }

    public DateTime? NgayHuy { get; set; }

    public string? LyDoHuy { get; set; }

    public virtual ICollection<Danhgium> Danhgia { get; set; } = new List<Danhgium>();

    public virtual DichvuCuuho IdDichVuNavigation { get; set; } = null!;

    public virtual Khachhang IdKhachHangNavigation { get; set; } = null!;

    public virtual NhanvienCuuho? IdNhanVienNavigation { get; set; }

    public virtual PhuongXa IdPhuongXaNavigation { get; set; } = null!;

    public virtual XeKhachhang IdXeNavigation { get; set; } = null!;

    public virtual ICollection<Khieunai> Khieunais { get; set; } = new List<Khieunai>();

    public virtual ICollection<LichSuTrangThaiYeuCau> LichSuTrangThaiYeuCaus { get; set; } = new List<LichSuTrangThaiYeuCau>();

    public virtual ICollection<Thanhtoan> Thanhtoans { get; set; } = new List<Thanhtoan>();

    public virtual ICollection<Tinnhan> Tinnhans { get; set; } = new List<Tinnhan>();
}
