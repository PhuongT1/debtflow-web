import type { PaginatedResponse } from '@packages/platform-contracts';
import type { Party, PartyDebt } from '@/models/party';
import type { UserSummary } from '@/models/user';

/** Query-string values accepted by the list endpoint. */
export interface PartyListParams {
  q?: string;
  type?: string;
  assignedToId?: string;
  balanceType?: string;
  createdFrom?: string;
  createdTo?: string;
  page?: string;
  pageSize?: string;
}

export type PartyListResponse = PaginatedResponse<Party>;
export type PartyDetailParams = Pick<Party, 'id'>;
export type PartyDetailResponse = Pick<
  Party,
  'id' | 'code' | 'name' | 'phone' | 'email' | 'taxCode' | 'address' | 'note' | 'creditLimit'
> & {
  assignedTo?: Pick<UserSummary, 'id' | 'name' | 'email'> | null;
  debts: PartyDebt[];
};

/** POST body: writable fields only; nullable response fields are not request values. */
export type CreatePartyRequest = Pick<Party, 'type' | 'name'> &
  Partial<
    Record<
      | 'code'
      | 'phone'
      | 'email'
      | 'taxCode'
      | 'address'
      | 'note'
      | 'provinceCode'
      | 'provinceName'
      | 'creditLimit'
      | 'assignedToId',
      string
    >
  >;
export type UpdatePartyRequest = Partial<CreatePartyRequest>;
export type CreatePartyParams = { data: CreatePartyRequest };
export type UpdatePartyParams = PartyDetailParams & { data: UpdatePartyRequest };
export type DeletePartyParams = PartyDetailParams;
// These operations return a Party record, without list-only aggregates/relations.
export type PartyWriteResponse = Omit<Party, '_count' | 'balance' | 'assignedTo'>;

/** Domain capability contract. Implementations must preserve these operation semantics. */
export interface PartyService {
  list(params: PartyListParams, signal?: AbortSignal): Promise<PartyListResponse>;
  detail(params: PartyDetailParams, signal?: AbortSignal): Promise<PartyDetailResponse>;
  create(params: CreatePartyParams): Promise<PartyWriteResponse>;
  update(params: UpdatePartyParams): Promise<PartyWriteResponse>;
  remove(params: DeletePartyParams): Promise<PartyWriteResponse>;
}
