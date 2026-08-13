import type { Request, Response } from "express";
import { getExpirations } from "../services/expirationService";

export function expirationsHandler(_req: Request, res: Response): void {
  res.json(getExpirations());
}
