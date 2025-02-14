import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./db.js";
import eventRoutes from "./routes/events.js";
import registrationRoutes from "./routes/registrations.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
