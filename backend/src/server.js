import express from "express";
import logger from "./middlewares/logger.js";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import products from "./routes/products.routes.js";
import { initDB } from "./config/db.js";
import { aj } from "./libs/arcjet.js";

const PORT = process.env.PORT || 8081;

const app = express();

// middlewares
app.use(logger);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// apply arcjet rate limiting to all routes
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({
          error: "Too Many Request ",
        });
      } else if (decision.reason.isBot()) {
        res.status(403).json({
          error: "Bot access denied",
        });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    // check for spoofed bots
    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }

    next();
  } catch (error) {
    console.error("Arcjet error", error);
    next(error);
  }
});

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
