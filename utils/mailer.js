// utils/mailer.js
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

console.log("OAUTH2 CLIENT CREDENTIALS:", oauth2Client.credentials);

async function createTransporter() {
  try {
    const accessTokenResponse = await oauth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    return transporter;
  } catch (error) {
    console.error('Error creating transporter:', error);
    return null;
  }
}

async function sendVerificationEmail(userEmail, verificationLink) {
  const transporter = await createTransporter();
  if (!transporter) {
    console.error('Failed to create transporter.');
    return false;
  }

  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: userEmail,
    subject: 'Verify Your Email Address',
    html: `<p>Hello,</p><p>Please click the following link to verify your email address:</p><p><a href="${verificationLink}">${verificationLink}</a></p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  } finally {
    if (transporter && transporter.close) {
      transporter.close();
    }
  }
}

module.exports = { sendVerificationEmail };