import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { fetchProductsMiddleware } from "../middleware/products";
import { error_handler } from "../middleware/error";
import { stripe_checkout_session, stripe_webhook } from "../controllers/stripe";
import { CustomRequest } from "../config/express";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(fetchProductsMiddleware);

app.get("/api/data", async (req, res) => {
  res.send("Hello, world!");
});

app.get(
  "/api/random_products",
  async (req: CustomRequest, res: Response, next: NextFunction) => {
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
  }
);

app.get(
  "/api/product/:id",
  async (req: CustomRequest, res: Response, next: NextFunction) => {
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
  }
);

app.get("/api/products/search", (req: CustomRequest, res: Response) => {
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
});

app.get("/api/products/category", (req: CustomRequest, res: Response) => {
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
  console.log(result);

  if (result.length === 0) {
    throw new Error("No products found matching your search query.");
  }

  res.status(200).json(result);
});

app.post("/api/checkout_session", stripe_checkout_session);

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  stripe_webhook
);

app.use(error_handler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
