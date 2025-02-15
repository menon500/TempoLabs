import express from "express";
import { Event } from "../models/Event.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const eventData = {
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      price: parseFloat(req.body.price),
      capacity: parseInt(req.body.capacity),
      location: {
        address: req.body.location?.address || "",
      },
    };

    const event = await Event.create(eventData);
    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const eventData = {
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
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
    res.status(400).json({ error: error.message });
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
    res.status(400).json({ error: error.message });
  }
});

export default router;
