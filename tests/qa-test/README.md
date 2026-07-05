# PayFlow — QA Engineer Take-Home

You have **one hour**. The goal is to show us how you reason about testing a
payments API — not how much coverage you can generate. A focused suite with a
clear write-up beats a sprawling one with no explanation.

---

## The API

A miniature payment-orchestration service with five endpoints.

| Endpoint | Description |
|---|---|
| `POST /charges` | Create a charge. Accepts an optional `Idempotency-Key` header. Amounts are integers in the **smallest currency unit** (cents for USD/GBP/EUR, yen for JPY — no decimals). |
| `POST /charges/:id/refunds` | Refund part or all of a charge. |
| `GET /charges/:id` | Fetch a single charge. |
| `GET /ledger` | Running balance and all entries. `balance` must always equal captures minus refunds. |
| `POST /_reset` | Wipe all state. Call this between tests. |

**Deterministic payment methods** — use these as `paymentMethodId`:

| Value | Outcome |
|---|---|
| `pm_ok` | `succeeded` |
| `pm_decline` | `failed` |
| `pm_action` | `requires_action` |

---

## Setup

```bash
npm install
npm test            # run the suite once
npm run test:watch  # re-run on save (recommended while writing)
```

The test suite boots the API in-process — no separate server needed.
If you want to poke the API by hand, `npm run api` starts it on `:3001`.

Your starting point is `tests/api/charges.test.ts`. It has one passing test.
Extend it — add files if you like.

---

## What to test

Work through these areas. Some hide bugs; some don't. Part of the task is
deciding which is which.

**1. Input validation**
Does the API reject malformed requests with the right status code and error
body? Think about: missing fields, wrong types, amounts that aren't positive
integers, currencies the API doesn't support.

**2. Payment outcomes and ledger consistency**
The ledger tracks every financial movement. Think about what *should* and
*should not* appear there depending on the payment outcome. A charge that never
collected money should have a clear answer.

**3. Refunds**
The happy path: partial refund, full refund. The edge cases: refund a charge
that isn't in a refundable state, refund more than the original amount.

**4. Concurrency — two simultaneous refunds**
This service processes requests asynchronously. A single refund working
correctly doesn't mean two refunds arriving at the same instant both work
correctly. Use `Promise.all` to fire requests in parallel:

```ts
const [r1, r2] = await Promise.all([
  request(app).post(`/charges/${id}/refunds`).send({ amount: 600 }),
  request(app).post(`/charges/${id}/refunds`).send({ amount: 600 }),
]);
```

Then check the charge and the ledger — not just the response bodies.

---

## Where you find a bug

Write the test to assert the **correct** behaviour, let it fail, and add an
entry to `BUGS.md`.

**`BUGS.md` format — one entry per bug, ordered most-severe first:**
```
## [Short title]
**Expected:** what should happen
**Actual:** what does happen
**Severity:** Critical / High / Medium / Low — and why
**Reproduced by:** which test proves it
```

---

## What to hand back

1. Your tests (`tests/api/` — extend or add files freely).
2. **`BUGS.md`** — every bug you found, ordered by severity.
3. **`NOTES.md`** — what you'd test next with more time, any assumptions you
   made, and how you'd run this suite in CI.

Judgement and clarity matter more than volume. Tell us what you chose *not* to
test and why.
