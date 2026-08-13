import { Router } from "express";
import { expirationsHandler } from "../controllers/bossController";
import { listInventory, updateInventory } from "../controllers/inventoryController";

const router = Router();

router.get("/expirations", expirationsHandler);
router.get("/inventory", listInventory);
router.patch("/inventory/:id", updateInventory);

export default router;
