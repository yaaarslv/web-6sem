import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Products {
    @PrimaryGeneratedColumn()
    productid: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    category: string;

    @Column()
    brand: string;

    @Column()
    imageurl: string;

    @Column()
    availability: boolean;

    @Column()
    rating: number;

    @Column()
    count: number;

    @Column()
    ratingcount: number;

    @Column()
    addedby: string;

    constructor(name: string, description: string, price: number, category: string, brand: string, imageurl: string, availability: boolean, rating: number, count: number, addedby: string, ratingcount: number) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.brand = brand;
        this.imageurl = imageurl;
        this.availability = availability;
        this.rating = rating;
        this.count = count;
        this.addedby = addedby;
        this.ratingcount = ratingcount;
    }
}