import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Stripe from "stripe";
import dotenv from "dotenv";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

interface Item {
  title: string;
  category: string;
  description: string;
  id: number;
  rating: number;
  price: number;
  image: string;
  count: number;
}

app.get("/api/data", async (req, res) => {
  res.send("Hello, world!");
});

app.post("/api/checkout_session", async (req, res) => {
  const { basket, products, userEmail } = req.body;

  const allProducts = {
    items: basket,
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
});

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    let event: Stripe.Event = req.body;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      if (session) {
        console.log(`session was created: ${session.id}`);
      }

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
        } catch (error) {
          console.error("Error adding order to DB:", error);
        }
      } else {
        console.log("Internal server error");
      }
    }

    res.send();
  }
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
