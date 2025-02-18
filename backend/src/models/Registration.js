import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import { Event } from "./Event.js";

export const Registration = sequelize.define("Registration", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Events",
      key: "id",
    },
  },
  eventName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  neighborhood: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isMinor: {
    type: DataTypes.ENUM("sim", "nao"),
    allowNull: false,
  },
  minorDocument: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  hasAllergies: {
    type: DataTypes.ENUM("sim", "nao"),
    allowNull: false,
  },
  allergiesNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pendente", "confirmado", "cancelado"),
    defaultValue: "pendente",
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM("não pago", "pago"),
    defaultValue: "não pago",
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

Registration.belongsTo(Event);
Event.hasMany(Registration);

// Sync the model with the database
Registration.sync({ alter: true }).then(() => {
  console.log("Registration model synchronized");
});
