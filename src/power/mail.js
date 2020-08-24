
const nodemailer = require('nodemailer')
const userConfig = require('../../.user-config')

const { emailUserName, emailPassword } = userConfig

/**
 * 发送一封邮件
 * @param {Object} subject 主题
 * @param {*} data 邮件内容
 * @param {String} mailType 标记邮件分类
 */

function sendMail(subject, data, mailType = ''){
    return new Promise((resolve, reject) => {
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
            })

            // 设置发件内容
            const mailOptions = {
                from: 'strawberrypaper@163.com', // 发件人地址
                to: 'strawberrypaper@163.com', // 收件人地址
                subject: `【${mailType}${mailType ? ':' : ''}草莓壁纸】${subject}`, // 主题
                text: '', 
                html: (() => {
                    let html = ''
                    if (typeof data === 'string'){
                        return data
                    }
                    for (const [key, value] of Object.entries(data)){
                        html += `<div><strong>${key}:</strong><span>${value}</span><div>`
                    }
                    return html
                })()
            }
        
            // 发送
            transporter.sendMail(mailOptions, (error, info) => {
                if (error || !info) {
                    reject(error.response)
                } else {
                    resolve(info)
                }
            })
        })
    })
}

module.exports = {
    sendMail
}
