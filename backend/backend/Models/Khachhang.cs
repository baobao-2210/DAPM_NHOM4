using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Khachhang
{
    public int IdKhachHang { get; set; }

    public int IdTaiKhoan { get; set; }

    public int IdPhuongXa { get; set; }

    public virtual ICollection<Danhgium> Danhgia { get; set; } = new List<Danhgium>();

    public virtual PhuongXa IdPhuongXaNavigation { get; set; } = null!;

    public virtual Taikhoan IdTaiKhoanNavigation { get; set; } = null!;

    public virtual ICollection<Khieunai> Khieunais { get; set; } = new List<Khieunai>();

    public virtual ICollection<XeKhachhang> XeKhachhangs { get; set; } = new List<XeKhachhang>();

    public virtual ICollection<YeucauCuuho> YeucauCuuhos { get; set; } = new List<YeucauCuuho>();
}
