using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class PhuongXa
{
    public int IdPhuongXa { get; set; }

    public int IdTinhThanh { get; set; }

    public string MaPhuongXa { get; set; } = null!;

    public string TenPhuongXa { get; set; } = null!;

    public decimal? KinhDo { get; set; }

    public decimal? ViDo { get; set; }

    public virtual TinhThanh IdTinhThanhNavigation { get; set; } = null!;

    public virtual ICollection<Khachhang> Khachhangs { get; set; } = new List<Khachhang>();

    public virtual ICollection<YeucauCuuho> YeucauCuuhos { get; set; } = new List<YeucauCuuho>();

    public virtual ICollection<NhanvienCuuho> IdNhanViens { get; set; } = new List<NhanvienCuuho>();
}
