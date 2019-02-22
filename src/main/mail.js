
const {email_username,email_password}=require('../../.user-config.json')
const nodemailer = require('nodemailer');


// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
export function newEmail(html,telUser,appInfo){
    return new Promise((resolve,reject)=>{

        console.log(email_username,email_password)
        nodemailer.createTestAccount((err) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'smtp.163.com',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: email_username, // generated ethereal user
                    pass: email_password  // generated ethereal password
                }
            });

            console.log(err);
        
            // setup email data with unicode symbols
            let mailOptions = {
                from: 'strawberrypaper@163.com', // sender address
                to: 'taoacat@163.com', // list of receivers
                subject:  `【意见反馈:草莓壁纸】[${appInfo.version}][联系方式:${telUser}]`, // Subject line
                text: '', // plain text body
                html: html
            };
        
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                console.log(error,info);
                if (error||!info) {
                   reject(error.response)
                }
                else{
                    resolve(info);
                }
            });
        });
 
    })
 
} 
