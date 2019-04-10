
const nodemailer = require('nodemailer')
const { emailUserName, emailPassword } = require('../../.user-config.json')

/**
 * 发送一封邮件
 * @param {*} html 邮件的主体恩内容
 * @param {*} telUser 主题中第三个框中的内容
 * @param {Object} appInfo 邮件的相关信息
 */
// eslint-disable-next-line import/prefer-default-export
export function newEmail(html, telUser, appInfo){
    return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-unused-vars
        nodemailer.createTestAccount((err) => {
            // 建立一个邮箱连接
            const transporter = nodemailer.createTransport({
                host: 'smtp.163.com', // 发件箱地址
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: emailUserName, // 用户名
                    pass: emailPassword // 密码
                }
            });

            // 设置发件内容
            const mailOptions = {
                from: 'strawberrypaper@163.com', // 发件人地址
                to: 'taoacat@163.com', // 收件人地址
                subject: `【${appInfo.emailType}:草莓壁纸】[${appInfo.version}]${telUser}`, // 主题
                text: '', 
                html // 内容
            };
        
            // 发送
            transporter.sendMail(mailOptions, (error, info) => {
                if (error || !info) {
                    reject(error.response)
                } else {
                    resolve(info);
                }
            });
        });
    })
} 
