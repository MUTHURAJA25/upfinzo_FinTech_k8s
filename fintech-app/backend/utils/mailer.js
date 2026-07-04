const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const viewsPath = (fileName) => {
  return path.resolve(__dirname, process.env.ROOT_PATH , "views", "emails", fileName);
};

// Gmail for smtp create
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, emailContent) => {
  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: emailContent,
  };
  await transporter.sendMail(mailOptions);
};

const sendResetPassword = async (to, subject, userDetails) => {
  try {
    const emailContent = await ejs.renderFile(viewsPath("resetPassword.ejs"), {
      userDetails,
    });

    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  sendEmail,
  sendResetPassword
};