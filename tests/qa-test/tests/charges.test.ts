// PayFlow API test suite.
//
// Run with:  npm test          (single run)
//            npm run test:watch (watch mode)
//
// The one test below passes out of the box. Fill in the todos — and add new
// describe blocks freely. Where the API behaves incorrectly, assert the
// CORRECT behaviour, let the test fail, and document it in BUGS.md.

import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { get } from "http";

const app = createApp();

// Wipe state before every test so tests don't bleed into each other.
beforeEach(async () => {
  await request(app).post("/_reset");
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function createCharge(
  overrides: Record<string, unknown> = {},
  headers: Record<string, string> = {},
) {
  return request(app)
    .post("/charges")
    .set(headers)
    .send({ amount: 1000, currency: "USD", paymentMethodId: "pm_ok", ...overrides });
}

// ---------------------------------------------------------------------------

describe("POST /charges — happy path", () => {
  it("creates a successful charge with pm_ok", async () => {
    const res = await createCharge();

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("succeeded");
    expect(res.body.amountRefunded).toBe(0);
  });

  it("declined charge has status 'failed'", async () => {
    const res = await createCharge({ paymentMethodId: "pm_decline" });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("failed");
  });
  
  it("requires-action charge has status 'requires_action'", async () => {
    const res = await createCharge({ paymentMethodId: "pm_action" });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("requires_action");
  });
});

describe("POST /charges — validation", () => {
  it("rejects a missing amount", async() => {
    const res = await createCharge({amount : 'abc'});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid_request");
  });
  
  it("rejects a non-integer amount (e.g. 19.99)", async () => {
    const res = await createCharge({ amount: 19.99 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid_request");
  });

  it("rejects a zero or negative amount", async () => {
    const res = await createCharge({ amount: -200 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid_request");
  });

  it("rejects an unsupported currency", async() => {
    const res = await createCharge({currency :"ASC"});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid_request");
  });

  it("rejects a missing paymentMethodId", async() => {
    const res = await createCharge({paymentMethodId: ""});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid_request");
    const resAgain = await request(app)
    .post("/charges")
    .send({ amount: 1000, currency: "USD" });
  expect(resAgain.status).toBe(400);
  expect(resAgain.body.error).toBe("invalid_request");
  });
});

async function getLedger(){
  const res = await request(app).get("/ledger");
  expect(res.status).toBe(200);
  return res.body;
}
async function getRefund(chargeId: string, refundAmount: number) {
  const resRefund = await request(app).post(`/charges/${chargeId}/refunds`).send({ amount: refundAmount });
  expect([200, 422, 409, 404, 400]).toContain(resRefund.status);
  return { status: resRefund.status, body: resRefund.body };
}

describe("GET /ledger — consistency", () => {
  it("balance equals the sum of all charge entries minus refund entries", async() => {
    const res = await createCharge({amount: 2000});
    const chargeID = res.body.id;
    await getRefund(chargeID, 500);
    const ledgerAfter = await getLedger();
    const expectedBalance = 2000 - 500;
    expect(ledgerAfter.balance).toBe(expectedBalance);
  });

  it("only succeeded charges appear in the ledger", async () =>{
     const successfullCharge = await createCharge({amount: 2000});
     const unsuccessfullCharge = await createCharge({amount: 2000, paymentMethodId: "pm_decline"});
     const ledgerAfter = await getLedger();
     expect(ledgerAfter.entries.some((entry: any) => entry.chargeId === successfullCharge.body.id)).toBe(true);
     expect(ledgerAfter.entries.some((entry: any) => entry.chargeId === unsuccessfullCharge.body.id)).toBe(false);
  });
});

async function getCharge(id: string) {
  const res = await request(app).get(`/charges/${id}`);
  expect(res.status).toBe(200);
  return res.body;
}
describe("POST /charges/:id/refunds — sequential", () => {
  it("partial refund reduces the remaining refundable amount", async () => {
    const res = await createCharge({ amount: 2000 });
    const chargeId = res.body.id;
    await getRefund(chargeId, 500);
    const charge=await getCharge(chargeId);
    expect(charge.amountRefunded).toBe(500);
  });

  it("full refund brings amountRefunded to the charge amount", async () => {
    const res = await createCharge({ amount: 2000 });
    const chargeId = res.body.id;
    await getRefund(chargeId, 2000);
    const charge = await getCharge(chargeId);
    expect(charge.amountRefunded).toBe(2000);
  });

  it("cannot refund more than the original charge amount", async () => {
    const res = await createCharge({ amount: 2000 });
    const chargeId = res.body.id;
    const statusRefund = await getRefund(chargeId, 2500);
    expect(statusRefund.status).toBe(422);
    expect(statusRefund.body.error).toBe('refund_exceeds_remaining');
  });
  it("cannot refund a failed charge", async () => {
    const res = await createCharge({ amount: 2000, paymentMethodId: "pm_decline" });
    const chargeId = res.body.id;
    const statusRefund = await getRefund(chargeId, 2000);
    expect(statusRefund.status).toBe(409);
    expect(statusRefund.body.error).toBe('charge_not_refundable');
  });

  it("cannot refund a requires-action charge", async () => {
    const res = await createCharge({ amount: 2000, paymentMethodId: "pm_action" });
    const chargeId = res.body.id;
    const statusRefund = await getRefund(chargeId, 2000);
    expect(statusRefund.status).toBe(409);
    expect(statusRefund.body.error).toBe('charge_not_refundable');
  });

  it("refunding with amount 0 is rejected", async () => {
    const res = await createCharge({ amount: 2000 });
    const chargeId = res.body.id;
    const statusRefund = await getRefund(chargeId, 0);
    expect(statusRefund.status).toBe(400);
    expect(statusRefund.body.error).toBe('invalid_amount');
  });
});

describe("POST /charges/:id/refunds — concurrency", () => {
  // Fire both requests at the same time with Promise.all. Check the charge
  // AND the ledger after — the response body alone is not enough.
  it("two simultaneous partial refunds cannot together exceed the charge amount" , async () => {
    const res = await createCharge({ amount: 2000 });
    const chargeId = res.body.id;
    const [first , second ] =  await Promise.all([
      getRefund(chargeId, 500),
      getRefund(chargeId, 1800),
    ]);
    const successfullRefund = [first, second].filter((r) => r.status === 200);
    const failedRefund = [first, second].filter((r) => r.status !== 200);
    expect(successfullRefund.length).toBe(1);
    expect(failedRefund.length).toBe(1);
    expect(first.status).toBe(200);
    expect(failedRefund[0].status).toBe(422);
    expect(failedRefund[0].body.error).toBe('refund_exceeds_remaining');
    const charge = await getCharge(chargeId);
    expect(charge.amountRefunded).toBe(500);
    const ledgerAfter = await getLedger();
    const successfullRefundValidation = ledgerAfter.entries.some((entry : any) => entry.chargeId === successfullRefund[0].body.id);
    expect (successfullRefundValidation).toBe(true);
    expect(ledgerAfter.entries.filter((entry : any) => entry.type === "refund").some((entry : any) => entry.amount === -500)).toBe(true); 
    expect(ledgerAfter.balance).toBe(1500);
});
});
