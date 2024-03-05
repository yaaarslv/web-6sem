import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Reviews {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    author: string;

    @Column()
    text: string;

    constructor(author: string, text: string) {
        this.author = author;
        this.text = text;
    }
}