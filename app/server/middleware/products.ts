import axios from "axios";
import { CustomRequest } from "../config/express";
import { NextFunction, Response } from "express";

export const fetchProductsMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    req.products = response.data;
    next();
  } catch (error) {
    console.error("Error fetching API data:", error.message);
    next(error);
  }
};
