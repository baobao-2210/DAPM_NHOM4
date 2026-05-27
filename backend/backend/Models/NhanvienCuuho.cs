using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class NhanvienCuuho
{
    public int IdNhanVien { get; set; }

    public int IdTaiKhoan { get; set; }

    public bool? TrangThaiNhanViec { get; set; }

    public decimal? DiemTb { get; set; }

    public string? MoTa { get; set; }

    public virtual ICollection<Danhgium> Danhgia { get; set; } = new List<Danhgium>();

    public virtual Taikhoan IdTaiKhoanNavigation { get; set; } = null!;

    public virtual ICollection<Khieunai> Khieunais { get; set; } = new List<Khieunai>();

    public virtual ICollection<LichSuTrangThaiYeuCau> LichSuTrangThaiYeuCaus { get; set; } = new List<LichSuTrangThaiYeuCau>();

    public virtual ICollection<YeucauCuuho> YeucauCuuhos { get; set; } = new List<YeucauCuuho>();

    public virtual ICollection<DichvuCuuho> IdDichVus { get; set; } = new List<DichvuCuuho>();

    public virtual ICollection<PhuongXa> IdPhuongXas { get; set; } = new List<PhuongXa>();
}
