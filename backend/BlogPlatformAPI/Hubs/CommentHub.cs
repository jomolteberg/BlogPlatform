using Microsoft.AspNetCore.SignalR;

namespace BlogPlatformAPI.Hubs;

public class CommentHub : Hub
{
    public async Task SendComment(string user, string message)
    {
        // Kringkast meldingen til alle tilkoblede klienter
        await Clients.All.SendAsync("ReceiveComment", user, message);
    }
}
