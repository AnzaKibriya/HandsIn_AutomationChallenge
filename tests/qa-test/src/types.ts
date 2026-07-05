// Shared domain types for the PayFlow orchestration mock.
// Amounts are ALWAYS integers in the smallest currency unit (cents, pence, yen).

export type Currency = "USD" | "GBP" | "EUR" | "JPY";

export type ChargeStatus =
  | "succeeded"
  | "failed"
  | "pending"
  | "requires_action";

export interface ChargeRequest {
  amount: number; // minor units
  currency: Currency;
  paymentMethodId: string;
}

export interface Charge {
  id: string;
  amount: number;
  currency: Currency;
  paymentMethodId: string;
  status: ChargeStatus;
  amountRefunded: number; // minor units, must never exceed `amount`
  createdAt: string;
}

export interface RefundRequest {
  amount: number; // minor units
}

export interface LedgerEntry {
  chargeId: string;
  type: "charge" | "refund";
  amount: number; // signed minor units: +charge, -refund
  at: string;
}
