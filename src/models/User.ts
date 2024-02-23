var jwt = require("jsonwebtoken")

export class User {
    email: string;
    password: string;
    token: string;
    role: string;

    constructor(email: string, password: string, role: string) {
        this.email = email;
        this.password = password;
        this.token = jwt.sign({ email: email }, 'secret_key', { algorithm: 'HS256' });
        this.role = role;
    }
}