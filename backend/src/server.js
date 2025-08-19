import express from "express";
import logger from "./middlewares/logger.js";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import products from "./routes/products.routes.js";
import { initDB } from "./config/db.js";

const PORT = process.env.PORT || 8081;

const app = express();

// middlewares
app.use(logger);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// routes
app.get("/", (req, res) => {
  //   console.log(res.getHeaders());
  res.send("Hello");
});

app.use("/api/products", products);

initDB().then(() =>
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  })
);
