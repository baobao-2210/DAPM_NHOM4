using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace backend.Hubs
{
    // [Authorize] // Bật Authorize nếu muốn chỉ client có JWT mới kết nối được
    public class NotificationHub : Hub
    {
        // Khi một client kết nối thành công
        public override async Task OnConnectedAsync()
        {
            // Có thể lấy thông tin user từ Context.User nếu có JWT
            var connectionId = Context.ConnectionId;
            await Clients.Caller.SendAsync("ReceiveMessage", "Hệ thống", $"Bạn đã kết nối thành công với ConnectionId: {connectionId}");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
        }

        // Method cho client gọi để gửi tin nhắn cho mọi người
        public async Task SendMessageToAll(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
        
        // Method cho client gọi để gửi thông báo vị trí hoặc trạng thái cuốc xe
        public async Task UpdateLocation(string driverId, decimal lat, decimal lng)
        {
            // Ở đây có thể lưu vị trí vào DB, sau đó broadcast cho client (ví dụ Khách hàng)
            await Clients.All.SendAsync("LocationUpdated", driverId, lat, lng);
        }
    }
}
