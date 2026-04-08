const loginNotificationTemplate = (user, subject) => {
  const loginTime = new Date().toLocaleString("en-NG", {
    timeZone: "Africa/Lagos",
    dateStyle: "full",
    timeStyle: "short",
  });

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 550px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #2c3e50; color: #ffffff; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 20px;">${subject}</h2>
      </div>
      
      <div style="padding: 30px;">
        <p>Hello <strong>${user.name || "User"}</strong>,</p>
        <p>This is a quick notification to let you know that your <strong>Inventory Management System</strong> account was just accessed.</p>
        
        <div style="background-color: #f4f6f7; border-left: 4px solid #e74c3c; padding: 15px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Time:</strong> ${loginTime}</p>
          <p style="margin: 5px 0;"><strong>Account:</strong> ${user.email}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> Success</p>
        </div>

        <p style="font-size: 14px; color: #666;">If this was you, you can safely ignore this email. If you did <strong>not</strong> log in, please reset your password immediately to secure your account.</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="#" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Manage Account</a>
        </div>
      </div>

      <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        <p style="margin: 0;">&copy; 2026 Inventory Management System | Lagos, Nigeria</p>
      </div>
    </div>
  `;
};

module.exports = loginNotificationTemplate;
