const nodeMailer = require("nodemailer");

const email = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASS;

console.log("Sender's email and password:", email, password);

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: password,
  },
  tls: {
    rejectUnauthorized: false, // This bypasses the 'self-signed certificate' error
  },
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Inventory System" <${email}>`,
    to: Array.isArray(to) ? to.join(", ") : to, // Converts ['a@b.com', 'c@d.com'] to "a@b.com, c@d.com"
    subject,
    html,
  });
};

module.exports = sendEmail;
