const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `Gönüllü Platformu <${process.env.EMAIL_FROM || 'noreply@gonullu.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || undefined 
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`E-posta başarıyla gönderildi: ${info.messageId}`);
    return info;

  } catch (error) {
    console.error('E-posta gönderim hatası:', error.message);
    return null; 
  }
};

module.exports = sendEmail;