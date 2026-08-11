import { Router } from "express";
import {
  createPreferenceHandler,
  verifyPaymentHandler,
} from "../controllers/paymentsController";

const router = Router();

router.post("/create_preference", createPreferenceHandler);
router.get("/verify_payment", verifyPaymentHandler);

export default router;
