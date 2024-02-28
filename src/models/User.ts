import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

var jwt = require("jsonwebtoken")

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    token: string;

    @Column()
    role: string;

    @Column()
    is_banned: string;

    @Column()
    emailconfirmed: string;

    constructor(email: string, password: string, role: string, is_banned: string,  emailconfirmed: string) {
        this.email = email;
        this.password = password;
        this.token = jwt.sign({ email: email }, 'secret_key', { algorithm: 'HS256' });
        this.role = role;
        this.is_banned = is_banned;
        this.emailconfirmed = emailconfirmed;
    }
}