var nodemailer = require("nodemailer");

export class Email {
    private readonly petshopEmail: any;
    private readonly petshopPassword: any;
    constructor(petshopEmail) {
        this.petshopEmail = petshopEmail;
        this.petshopPassword = 'iunazzksleioacie';
    }

    async sendMail(subject, recipient, text) {
        try {
            let transporter = nodemailer.createTransport({
                host: 'smtp.yandex.ru',
                port: 587,
                secure: false,
                auth: {
                    user: this.petshopEmail,
                    pass: this.petshopPassword
                }
            });

            let info = await transporter.sendMail({
                from: this.petshopEmail,
                to: recipient,
                subject: subject,
                text: text
            });

            console.log("Письмо успешно отправлено");
        } catch (error) {
            console.error("Ошибка: Невозможно отправить сообщение. Подробности:");
            console.log(error);
        }
    }
}


