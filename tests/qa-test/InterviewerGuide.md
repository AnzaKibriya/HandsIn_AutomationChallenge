# PayFlow — Interviewer Guide (Live Pairing)

This is for running the PayFlow exercise **live, with the candidate**, as a
collaborative pairing session — not for grading a take-home. The goal is to
watch how they reason about testing a payments system under concurrency, and to
have a real conversation while you do it. Reaching the "right answer" matters
less than *how* they get there.

Keep the answer key (`EVALUATOR_GUIDE.md`) open for yourself. Do **not** share
it. This guide tells you what to say, when to nudge, and what to listen for.

---

## Before the session (5 min, on your own)

- Have the repo running: `npm install && npm test`. Confirm the starter test
  passes so you're not debugging the harness on the candidate's time.
- Decide the format: screen-share with the candidate driving is best. If they
  prefer you to drive while they direct, that's fine — narrate as you type.
- Re-read the two planted races in `store.ts` (createCharge, refund) so you can
  recognise partial insights when they surface.
- Set expectations out loud at the start (script below).

## Framing the session (first 2-3 min)

Say something like:

> "This is a small payment API — create charges, refund them, read a ledger.
> It works for the happy path. We're going to spend the next hour writing tests
> together and seeing what we find. I care much more about how you think than
> about getting through a checklist. Talk out loud, ask me anything, and treat
> me as a teammate — if you'd Google something, ask me instead."

Then let them drive. Resist filling silence too quickly; thinking time is signal.

---

## The arc you're steering toward

There are two timing-dependent bugs. Both require firing requests **in
parallel** to surface; sequential tests miss them entirely.

1. **Idempotency double-charge** — same `Idempotency-Key`, two concurrent
   `POST /charges`, both create a charge.
2. **Refund over-spend** — two concurrent partial refunds each pass a stale cap
   check; the ledger goes negative.

A great session reaches at least one of these deterministically and has a real
discussion about *why* it happens and how to test it reliably. You are not
trying to get through both — depth on one beats a rushed tour of both.

---

## Hint ladder

Give the **minimum** nudge that unblocks them, and note where on this ladder
they needed help — that's your strongest signal. Start at the top only if they
stall; a candidate who self-navigates the whole ladder is a strong hire.

**Level 0 — open prompt (always start here)**
> "Where would you start testing this?"

Listen for whether they reach for edge cases and failure modes unprompted, or
only test the happy path.

**Level 1 — point at the domain, not the bug**
> "This is a payments system. What goes wrong in payments specifically that
> wouldn't matter in, say, a blog API?"

You want them to land on: retries, double-charges, idempotency, money
invariants. If they say "idempotency," you're in great shape.

**Level 2 — introduce concurrency**
> "What happens if a customer double-clicks Pay, or the client retries on a
> timeout — and both requests arrive at the same moment?"

Watch whether they realise sequential tests can't catch this and reach for
`Promise.all` or parallel firing.

**Level 3 — point at the seam (only if stuck)**
> "Take a look at how `createCharge` handles the idempotency key. Read it line
> by line — what happens between checking the key and writing it?"

This hands them the `await`-between-read-and-write insight. Needing this level
is fine for a mid-level candidate; a senior should rarely need it.

**Level 4 — rescue (so the session ends well)**
If they're stuck near the end, just walk it together. A candidate who follows
your reasoning, asks good questions, and writes a clean assertion still shows
plenty. End on a working test, not on a wall.

---

## What to probe with questions

Once a bug surfaces, the conversation is where the real signal lives. Good
prompts:

- **On determinism:** "You fired these in parallel and it failed. Will it fail
  *every* time? How would you make sure this test isn't flaky in CI?"
  — Listen for: running it in a loop, reasoning about the event-loop yield,
  understanding why the race is reliably reproducible here.

- **On assertions:** "You asserted the balance is `10000`. Is that the cleanest
  thing to assert?"
  — You're fishing for **invariants**: `balance === captures - refunds`, or
  `amountRefunded ∈ [0, amount]`. Asserting an invariant instead of a magic
  number is a senior tell.

- **On the fix (don't let them code it — discuss):** "How would you fix this in
  the real service?"
  — Listen for: a lock, optimistic concurrency / version column,
  `SELECT ... FOR UPDATE`, atomic upsert, idempotency key reserved *before* the
  provider call. You're testing whether they understand the failure, not asking
  for production code.

- **On the idempotency design itself:** "Suppose someone reuses the same key but
  with a *different* amount. What happens?" — surfaces that keying on the key
  string alone (ignoring the request body) is its own flaw. Unprompted = strong.

- **On prioritisation:** "We have ten minutes left. What's the one more test you'd
  write and why?" — tests judgement under time pressure.

---

## Reading the signal

**Strong hire**
- Reaches concurrency on their own (Level 0-1), articulates the read-modify-write
  hazard, writes a deterministic parallel test, asserts an invariant, and
  discusses a real fix. Often flags the idempotency-body issue unprompted.

**Hire**
- Gets to at least one race with a Level 2-3 nudge, writes a test that reliably
  proves it, and reasons sensibly about flakiness and a fix when prompted.

**Lean no**
- Stays on the happy path even after Level 1-2, treats the parallel failure as
  "weird, probably the test's fault," or can't articulate why a test might be
  flaky. Note *which* — not reaching concurrency vs. not understanding it are
  different misses.

A candidate doesn't need to finish to pass. Curiosity, money-safety instinct,
clean assertions, and the quality of the discussion outweigh raw coverage.

---

## Anti-patterns to avoid as the interviewer

- **Don't quiz.** This is pairing, not a viva. If they're moving, stay quiet.
- **Don't reveal the bug early to save time.** The hint ladder exists so the
  *level of help they needed* stays interpretable.
- **Don't penalise unfamiliarity with the tooling.** Vitest/supertest specifics
  are Googleable — answer those freely; they cost you no signal.
- **Don't let a stuck candidate end on failure.** Use Level 4. How someone
  collaborates when rescued is itself useful signal.

## Logistics & fairness

- Same exercise, same framing, same hint ladder for every candidate, so scores
  are comparable.
- Write your notes against the hint level reached **during** the session — memory
  fades fast afterward.
- Reset state with `POST /_reset` (or restart) between attempts if you run it
  more than once.
- Budget: ~3 min framing, ~45 min pairing, ~10 min their questions for you.