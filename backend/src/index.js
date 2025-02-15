import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./db.js";
import eventRoutes from "./routes/events.js";
import registrationRoutes from "./routes/registrations.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Configure CORS to accept requests from any origin during development
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
