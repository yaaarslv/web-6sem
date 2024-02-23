export class Product {
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    imageURL: string;
    availability: boolean;
    rating: number;

    constructor(name: string, description: string, price: number, category: string, brand: string, imageURL: string, availability: boolean, rating: number) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.brand = brand;
        this.imageURL = imageURL;
        this.availability = availability;
        this.rating = rating;
    }
}