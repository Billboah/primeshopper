import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { fetchProductsMiddleware } from "../middleware/products";
import { error_handler } from "../middleware/error";
import { stripe_checkout_session, stripe_webhook } from "../controllers/stripe";
import {
  category_product,
  random_products,
  searched_product,
  specific_product,
} from "../controllers/product";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(fetchProductsMiddleware);

app.get("/api/data", async (req, res) => {
  res.send("Hello, world!");
});

app.get("/api/random_products", random_products);

app.get("/api/product/:id", specific_product);

app.get("/api/products/search", searched_product);

app.get("/api/products/category", category_product);

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
