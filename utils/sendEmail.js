const nodeMailer = require("nodemailer");

const sendEmail = async ({ emailTo, subject, code, content }) => {
  if (!emailTo) {
    throw new Error("No recipients defined");
  }

  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: process.env.SMTP_MAIL,
    to: emailTo,
    subject,
    html: `
    <div>
      <h3>Use this below code to ${content}</h3>
      <p><strong>Code: </strong>${code}</p>
    </div>
    `,
  };
  await transporter.sendMail(message);
};

module.exports = sendEmail;
