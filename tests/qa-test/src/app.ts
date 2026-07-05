import express, { type Request, type Response } from "express";
import { store, ApiError } from "./store.js";
import type { ChargeRequest, RefundRequest } from "./types.js";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.post("/charges", async (req: Request, res: Response) => {
    const body = req.body as Partial<ChargeRequest>;
    const idempotencyKey = req.header("Idempotency-Key") || undefined;

    if (
      typeof body.amount !== "number" ||
      !Number.isInteger(body.amount) ||
      body.amount <= 0 ||
      !body.currency ||
      !body.paymentMethodId
    ) {
      return res.status(400).json({ error: "invalid_request" });
    }

    try {
      const charge = store.createCharge(
        {
          amount: body.amount,
          currency: body.currency,
          paymentMethodId: body.paymentMethodId,
        },
        idempotencyKey,
      );
      return res.status(201).json(charge);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.post("/charges/:id/refunds", async (req: Request, res: Response) => {
    const body = req.body as Partial<RefundRequest>;
    if (typeof body.amount !== "number" || !Number.isInteger(body.amount)) {
      return res.status(400).json({ error: "invalid_request" });
    }
    try {
      const charge = await store.refund(req.params["id"]!, { amount: body.amount });
      return res.status(200).json(charge);
    } catch (err) {
      return handleError(err, res);
    }
  });

  app.get("/charges/:id", (req: Request, res: Response) => {
    const charge = store.getCharge(req.params["id"]!);
    if (!charge) return res.status(404).json({ error: "charge_not_found" });
    return res.json(charge);
  });

  app.get("/ledger", (_req: Request, res: Response) => {
    return res.json({
      balance: store.ledgerBalance(),
      entries: store.listLedger(),
    });
  });

  app.post("/_reset", (_req: Request, res: Response) => {
    store.reset();
    res.status(204).end();
  });

  return app;
}

function handleError(err: unknown, res: Response) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.code });
  }
  return res.status(500).json({ error: "internal_error" });
}
