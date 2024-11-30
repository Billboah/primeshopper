import express, { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { CustomRequest, Item } from "../config/express";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export const stripe_checkout_session = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { basket, userEmail } = req.body;

  const allProducts = {
    items: req.products,
    get: function (id: number) {
      return this.items.find((item: Item) => item.id === id);
    },
  };

  const tranformedItems = basket.map((item: Item) => {
    const storeItem = allProducts.get(item.id);
    return {
      quantity: item.count,
      price_data: {
        currency: "usd",
        unit_amount: storeItem.price * 100,
        product_data: {
          description: storeItem.description,
          name: storeItem.title,
          images: [storeItem.image],
        },
      },
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 500, currency: "usd" },
          display_name: "Next day shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 3 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
    ],
    shipping_address_collection: {
      allowed_countries: ["GH", "US", "CA"],
    },
    line_items: tranformedItems,
    mode: "payment",
    success_url: `${req.headers.origin}/success`,
    cancel_url: `${req.headers.origin}/?canceled=true`,
    metadata: {
      userEmail,
      products: JSON.stringify(
        basket.map(({ image, count }) => ({ image, count }))
      ),
    },
  });

  res.status(201).json({ sessionId: session.id });
};

export const stripe_webhook = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let event: Stripe.Event = req.body;

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (session) {
      try {
        const data = {
          email: session.metadata.userEmail,
          amount: session.amount_total / 100,
          shipingCost: session.shipping_cost.amount_total / 100,
          products: JSON.parse(session.metadata.products),
          timestamp: new Date(),
        };

        console.log(`SUCCESS: Order ${session.id} has been added to DB`);

        const document = doc(
          db,
          "users",
          session.metadata.userEmail,
          "orders",
          session.id
        );

        const dataDB = await setDoc(document, data);

        return dataDB;
      } catch (err) {
        console.error("Error adding order to DB:", err);
        next(err);
      }
    } else {
      throw new Error("Internal server error");
    }
  }

  res.send();
};
