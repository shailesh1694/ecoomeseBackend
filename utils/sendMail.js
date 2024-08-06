const nodemailer = require("nodemailer")


const sendMail = (options, callback) => {

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.USER_NAME,
            pass: process.env.PASSWORD
        }
    })

    async function main() {
        // send mail with defined transport object
        const info = await transport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: options.email, // list of receivers
            subject: options.subject, // Subject line
            text: options.message, // plain text body
            html: "<b>Hello world?</b>", // html body
        });
    }

    main().catch(() => { callback() });
}
