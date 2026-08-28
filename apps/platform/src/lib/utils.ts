import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(value: number | string | { toString(): string }, currency = "VND") {
  const numericValue = Number(value.toString());

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "VND" ? 0 : 2,
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
}

export function toDateInputValue(value: Date | string) {
  return new Date(value).toISOString().slice(0, 10);
}

