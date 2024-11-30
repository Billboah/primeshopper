import { Request } from "express";
import { ParsedQs } from "qs";

// Extend the Request type
export interface CustomRequest extends Request {
  products: {
    id: number;
    title: string;
    category: string;
    description: string;
    image: string;
    price: number;
    rating: {
      rate: number;
      count: number;
    };
  }[]
}

export interface Item {
  title: string;
  category: string;
  description: string;
  id: number;
  rating: number;
  price: number;
  image: string;
  count: number;
}
