using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class DichvuCuuho
{
    public int IdDichVu { get; set; }

    public int IdDanhMuc { get; set; }

    public string TenDichVu { get; set; } = null!;

    public string? MoTa { get; set; }

    public decimal? GiaCoBan { get; set; }

    public string? TrangThai { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual DanhmucDichvu IdDanhMucNavigation { get; set; } = null!;

    public virtual ICollection<YeucauCuuho> YeucauCuuhos { get; set; } = new List<YeucauCuuho>();

    public virtual ICollection<NhanvienCuuho> IdNhanViens { get; set; } = new List<NhanvienCuuho>();
}
