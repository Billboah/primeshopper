import express, { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../config/express";

export const random_products = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.products || !Array.isArray(req.products)) {
      throw new Error("No products found");
    }

    const data = req.products.map((product) => ({
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      rate: product.rating.rate,
    }));

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const specific_product = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = parseInt(req.params.id, 10);

    const product = req.products.find((p) => p.id === productId);

    if (!product) {
      throw new Error("Product not found");
    }

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

export const searched_product = (req: CustomRequest, res: Response) => {
  const { input } = req.query;

  if (!input || typeof input !== "string") {
    throw new Error("Search parameter is required and should be a string.");
  }

  const result = req.products
    .filter(
      (product) =>
        product.title.toLowerCase().includes(input.toLowerCase()) ||
        product.category.toLowerCase().includes(input.toLowerCase())
    )
    .map((product) => ({
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      rate: product.rating.rate,
    }));

  if (result.length === 0) {
    throw new Error("No products found matching your search query.");
  }

  res.status(200).json(result);
};

export const category_product = (req: CustomRequest, res: Response) => {
  const { category } = req.query;

  if (!category || typeof category !== "string") {
    throw new Error("Category parameter is required and should be a string.");
  }

  const result = req.products
    .filter((product) =>
      product.category.toLowerCase().includes(category.toLowerCase())
    )
    .map((product) => ({
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      rate: product.rating.rate,
    }));

  if (result.length === 0) {
    throw new Error("No products found matching your search query.");
  }

  res.status(200).json(result);
};
