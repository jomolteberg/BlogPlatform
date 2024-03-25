using Microsoft.AspNetCore.Identity.UI.Services;

namespace BlogPlatformAPI.Interfaces;

public class DryRunEmailSender : IEmailSender
{
    public Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        // Log email sending action or simply ignore
        Console.WriteLine($"Pretend sending email to {email}: Subject = {subject}, Message = {htmlMessage}");
        return Task.CompletedTask;
    }
}
