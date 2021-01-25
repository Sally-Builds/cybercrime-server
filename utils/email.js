const pug = require('pug');
const sgMail = require('@sendgrid/mail');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.cyberCrime = user.type;
    this.from = `NCCRA <${process.env.EMAIL_FROM}>`;
  }

  async send(template, subject, tips = ['hello']) {
    //1) render html based template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
      tips,
      cyberCrime: this.cyberCrime,
    });
    //2) Define email Options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };
    //3) createe a transport and send email

    // await this.newTransport().sendMail(mailOptions);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMail.send(mailOptions);
  }

  //Welcome email
  async sendWelcome() {
    await this.send('welcome', 'welcome aloha!!');
  }

  //Reset password Email
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token. Valid for only 10 mins'
    );
  }

  //cyber tips
  async cyberTips(cyber) {
    await this.send('preventionTips', 'prevention tips', cyber);
  }
};
