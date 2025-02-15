import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: true, // Temporariamente ativado para debug
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: false,
  },
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
    // Sync models with database
    return sequelize.sync({ force: true }); // Cuidado: isso vai recriar as tabelas
  })
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
