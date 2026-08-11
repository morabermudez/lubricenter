import { Router } from "express";
import {
  listAppointments,
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from "../controllers/appointmentsController";

const router = Router();

router.get("/", listAppointments);
router.post("/", createAppointment);
router.delete("/:id", deleteAppointment);
router.patch("/:id", updateAppointment);

export default router;
