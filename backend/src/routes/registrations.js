import express from "express";
import { Registration } from "../models/Registration.js";
import { Event } from "../models/Event.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      include: [Event],
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    // Find the event to get its price
    const event = await Event.findByPk(req.body.eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Create registration with event price and current date
    const registration = await Registration.create({
      ...req.body,
      amount: event.price,
      date: new Date()
    });

    // Return registration with event data
    const registrationWithEvent = await Registration.findByPk(registration.id, {
      include: [Event]
    });

    res.status(201).json(registrationWithEvent);
  } catch (error) {
  try {
    const registration = await Registration.create(req.body);
    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const [updated] = await Registration.update(
      { status: req.body.status },
      { where: { id: req.params.id } },
    );
    if (updated) {
      const updatedRegistration = await Registration.findByPk(req.params.id);
      res.json(updatedRegistration);
    } else {
      res.status(404).json({ error: "Registration not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id/payment", async (req, res) => {
  try {
    const [updated] = await Registration.update(
      { paymentStatus: req.body.paymentStatus },
      { where: { id: req.params.id } },
    );
    if (updated) {
      const updatedRegistration = await Registration.findByPk(req.params.id);
      res.json(updatedRegistration);
    } else {
      res.status(404).json({ error: "Registration not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
