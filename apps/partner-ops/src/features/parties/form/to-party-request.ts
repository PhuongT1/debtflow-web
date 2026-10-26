import type { CreatePartyRequest } from '@/services/parties/party.types';
import type { PartyFormValues } from './schema';

/** Preserve the API's existing omission semantics for blank optional form fields. */
export function toPartyRequest(values: PartyFormValues): CreatePartyRequest {
  return {
    type: values.type,
    name: values.name,
    code: values.code || undefined,
    phone: values.phone || undefined,
    email: values.email || undefined,
    taxCode: values.taxCode || undefined,
    creditLimit: values.creditLimit || undefined,
    assignedToId: values.assignedToId || undefined,
    address: values.address || undefined,
    provinceCode: values.provinceCode || undefined,
    provinceName: values.provinceName || undefined,
    note: values.note || undefined,
  };
}
