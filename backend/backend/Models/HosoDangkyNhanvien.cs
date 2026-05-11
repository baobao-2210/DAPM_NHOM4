using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class HosoDangkyNhanvien
{
    public int IdHoSo { get; set; }

    public int IdTaiKhoan { get; set; }

    public string? ThongTinXe { get; set; }

    public string? KinhNghiem { get; set; }

    public string? GiayTo { get; set; }

    public string? TrangThai { get; set; }

    public string? LyDoTuChoi { get; set; }

    public DateTime? NgayNop { get; set; }

    public DateTime? NgayDuyet { get; set; }

    public string? TenNguoiDuyet { get; set; }

    public virtual Taikhoan IdTaiKhoanNavigation { get; set; } = null!;
}
