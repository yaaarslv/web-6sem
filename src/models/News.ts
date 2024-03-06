import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class News {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    subject: string;

    @Column()
    text: string;

    @Column({ type: 'timestamp with time zone' })
    date: Date;

    constructor(subject: string, text: string, date: Date) {
        this.subject = subject;
        this.text = text;
        this.date = date;
    }
}