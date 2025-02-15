import express from "express";
import { Event } from "../models/Event.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll();
    console.log("Events found:", events); // Debug log
    res.json(events || []);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("Creating event with data:", req.body); // Debug log
    const eventData = {
      name: req.body.name,
      description: req.body.description,
      date: new Date(req.body.date),
      price: parseFloat(req.body.price),
      capacity: parseInt(req.body.capacity),
      location: {
        address: req.body.location?.address || "",
      },
    };

    const event = await Event.create(eventData);
    console.log("Event created:", event); // Debug log
    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(400).json({
      error: "Error creating event",
      details: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const eventData = {
      name: req.body.name,
      description: req.body.description,
      date: new Date(req.body.date),
      price: parseFloat(req.body.price),
      capacity: parseInt(req.body.capacity),
      location: {
        address: req.body.location?.address || "",
      },
    };

    const [updated] = await Event.update(eventData, {
      where: { id: req.params.id },
    });

    if (updated) {
      const updatedEvent = await Event.findByPk(req.params.id);
      res.json(updatedEvent);
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(400).json({
      error: "Error updating event",
      details: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Event.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(400).json({
      error: "Error deleting event",
      details: error.message,
    });
  }
});

export default router;
