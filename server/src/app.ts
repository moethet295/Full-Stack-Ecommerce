import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./db/dbConnect";

import productRoutes from "./routes/product";
import userRoutes from "./routes/user";
import orderRoutes from "./routes/order";

import { errorHandler } from "./middlewares/errorHandler";

// =====================================
// ENV
// =====================================

dotenv.config({
  path: ".env",
});

// =====================================
// APP
// =====================================

const app = express();

// =====================================
// CORS
// =====================================

app.use(
  cors({
    origin: "http://localhost:5173",

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// =====================================
// BODY
// =====================================

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(cookieParser());

// =====================================
// TEST ROUTE
// =====================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "FASHION KING API is running",
  });
});

// =====================================
// REQUEST LOGGER
// =====================================

app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.originalUrl}`
  );

  next();
});

// =====================================
// USER ROUTES
// =====================================

app.use(
  "/api",
  userRoutes
);

// =====================================
// PRODUCT ROUTES
// =====================================

app.use(
  "/api",
  productRoutes
);

// =====================================
// ORDER ROUTES
// =====================================

app.use(
  "/api",
  orderRoutes
);

// =====================================
// ERROR HANDLER
// =====================================

app.use(errorHandler);

// =====================================
// PORT
// =====================================

const PORT =
  Number(process.env.PORT) || 8000;

// =====================================
// START SERVER
// =====================================

const startServer = async () => {
  try {

    // Connect MongoDB first
    await connectDB();

    // Start Express only after DB connects
    app.listen(PORT, () => {
      console.log(
        `Server is running on http://localhost:${PORT}`
      );
    });

  } catch (error) {

    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
};

startServer();