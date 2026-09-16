export const UserRole = { OWNER: 'OWNER', ADMIN: 'ADMIN', ACCOUNTANT: 'ACCOUNTANT', VIEWER: 'VIEWER' } as const;

export const OrganizationKind = { PERSONAL: 'PERSONAL', BUSINESS: 'BUSINESS' } as const;
export type OrganizationKind = (typeof OrganizationKind)[keyof typeof OrganizationKind];

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const PartyType = {
  CUSTOMER: 'CUSTOMER',
  SUPPLIER: 'SUPPLIER',
  BOTH: 'BOTH',
} as const;

export type PartyType = (typeof PartyType)[keyof typeof PartyType];

export const DebtType = {
  RECEIVABLE: 'RECEIVABLE',
  PAYABLE: 'PAYABLE',
} as const;

export type DebtType = (typeof DebtType)[keyof typeof DebtType];

export const DebtStatus = {
  OPEN: 'OPEN',
  PARTIAL: 'PARTIAL',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
} as const;

export type DebtStatus = (typeof DebtStatus)[keyof typeof DebtStatus];

export const CollectionStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  PROMISED: 'PROMISED',
  DISPUTED: 'DISPUTED',
  ESCALATED: 'ESCALATED',
} as const;

export type CollectionStatus = (typeof CollectionStatus)[keyof typeof CollectionStatus];

export const PaymentMethod = {
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
  OTHER: 'OTHER',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
