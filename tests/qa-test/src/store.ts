// In-memory store for the PayFlow mock.
//
// IMPORTANT — FOR EVALUATORS ONLY (candidates do not see this comment):
//
// Planted bugs — two distinct categories:
//
// BUG 1 (concurrency): refund() reads amountRefunded, yields the event loop
// via `await tick()`, then writes using the STALE read. Two concurrent partial
// refunds each pass the cap check on the same starting value and both commit —
// the charge gets over-refunded and the ledger goes negative. Sequential tests
// will never catch this; candidates must use Promise.all / Promise.allSettled.
//
// BUG 2 (business logic): createCharge() pushes a ledger entry for EVERY
// charge regardless of outcome. A declined (pm_decline) or action-required
// (pm_action) payment should never appear as income — but it does. A candidate
// who only tests the happy path (pm_ok) will miss this entirely.
//
// Non-concurrency validation gap (already in app.ts): the currency field is
// only checked for truthiness, not against the supported Currency union, so
// any string (e.g. "MOON") is accepted.

import type {
  Charge,
  ChargeRequest,
  LedgerEntry,
  RefundRequest,
} from "./types.js";

// Yield to the event loop to open the interleaving window.
// Node is single-threaded, but `await` yields — so two requests interleaved
// across this await observe stale reads, just like a DB without row locking.
const tick = () => new Promise<void>((r) => setImmediate(r));

let seq = 0;
const nextId = (prefix: string) =>
  `${prefix}_${(++seq).toString(36)}${Date.now().toString(36)}`;

export class Store {
  private charges = new Map<string, Charge>();
  private ledger: LedgerEntry[] = [];
  private idempotency = new Map<string, string>(); // idempotencyKey -> chargeId

  reset() {
    this.charges.clear();
    this.ledger = [];
    this.idempotency.clear();
    seq = 0;
  }

  getCharge(id: string): Charge | undefined {
    return this.charges.get(id);
  }

  listLedger(): LedgerEntry[] {
    return [...this.ledger];
  }

  ledgerBalance(): number {
    return this.ledger.reduce((acc, e) => acc + e.amount, 0);
  }

  // --- Charge creation with idempotency -----------------------------------
  //
  // No async gap here — idempotency is checked and written synchronously so
  // concurrent requests with the same key are handled correctly.
  createCharge(req: ChargeRequest, idempotencyKey: string | undefined): Charge {
    if (idempotencyKey) {
      const existingId = this.idempotency.get(idempotencyKey);
      if (existingId) {
        const existing = this.charges.get(existingId);
        if (existing) return existing;
      }
    }

    const status = resolveProviderOutcome(req.paymentMethodId);

    const charge: Charge = {
      id: nextId("ch"),
      amount: req.amount,
      currency: req.currency,
      paymentMethodId: req.paymentMethodId,
      status,
      amountRefunded: 0,
      createdAt: new Date().toISOString(),
    };

    this.charges.set(charge.id, charge);

    // BUG 2 (planted): ledger entry is pushed for every charge regardless of
    // status. Failed and action-required payments should never be income.
    this.ledger.push({
      chargeId: charge.id,
      type: "charge",
      amount: charge.amount,
      at: charge.createdAt,
    });

    if (idempotencyKey) {
      this.idempotency.set(idempotencyKey, charge.id);
    }

    return charge;
  }

  // --- Refunds ------------------------------------------------------------
  //
  // BUG 1 (planted): reads amountRefunded, yields the event loop, then writes
  // using the captured stale value. Two concurrent partial refunds each read
  // the same starting amountRefunded, both pass the cap check, and both
  // commit — the charge gets over-refunded and the ledger goes negative.
  async refund(chargeId: string, req: RefundRequest): Promise<Charge> {
    const charge = this.charges.get(chargeId);
    if (!charge) throw new ApiError(404, "charge_not_found");
    if (charge.status !== "succeeded") {
      throw new ApiError(409, "charge_not_refundable");
    }
    if (req.amount <= 0) throw new ApiError(400, "invalid_amount");

    const alreadyRefunded = charge.amountRefunded;
    const remaining = charge.amount - alreadyRefunded;

    // Cap check on the value read BEFORE the async gap.
    if (req.amount > remaining) {
      throw new ApiError(422, "refund_exceeds_remaining");
    }

    // Simulate provider round-trip — opens the race window.
    await tick();

    // Stale write: uses the captured `alreadyRefunded`, not a fresh read.
    charge.amountRefunded = alreadyRefunded + req.amount;
    this.charges.set(charge.id, charge);
    this.ledger.push({
      chargeId: charge.id,
      type: "refund",
      amount: -req.amount,
      at: new Date().toISOString(),
    });

    return charge;
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}

function resolveProviderOutcome(pmId: string): Charge["status"] {
  switch (pmId) {
    case "pm_ok":
      return "succeeded";
    case "pm_decline":
      return "failed";
    case "pm_action":
      return "requires_action";
    default:
      return "succeeded";
  }
}

export const store = new Store();
