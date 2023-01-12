const nodemailer = require("nodemailer");
// const sgMail = require("@sendgrid/mail");

require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const { META_PASSWORD, MAIL_USERNAME } = process.env;
// const { SENDGRID_API_KEY } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465, // 25, 465, 2525
  secure: true,
  auth: {
    user: MAIL_USERNAME,
    pass: META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = {
    ...data,
    from: MAIL_USERNAME,
  };
  await transport
    .sendMail(email)
    .then((info) => console.log(info))
    .catch((err) => console.log(err));
};

// sgMail.setApiKey(SENDGRID_API_KEY);

// const sendEmail = async (data) => {
//   const email = {
//     ...data,
//     from: "0688138@gmail.com",
//   };
//   await sgMail.send(email);
//   return true;
// };

module.exports = sendEmail;
