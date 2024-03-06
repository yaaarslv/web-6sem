import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Subscribers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    constructor(id: number, email: string) {
        this.id = id;
        this.email = email;
    }
}