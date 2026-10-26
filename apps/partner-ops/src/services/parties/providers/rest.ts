import type { apiRequest, apiPaginatedRequest } from '@/lib/api/http-client';
import type { Party } from '@/models/party';
import type { PartyService, PartyDetailResponse, PartyWriteResponse } from '../party.types';

type RestDependencies = {
  request: typeof apiRequest;
  requestPage: typeof apiPaginatedRequest;
};

const endpoint = '/parties';
const detailEndpoint = (id: string) => `${endpoint}/${encodeURIComponent(id)}`;

/** REST implementation; receives the configured transport from the composition owner. */
export function createRestPartyService({ request, requestPage }: RestDependencies): PartyService {
  return {
    list: (params, signal) => requestPage<Party>({ url: endpoint, params, signal }),
    detail: ({ id }, signal) => request<PartyDetailResponse>({ url: detailEndpoint(id), signal }),
    create: ({ data }) => request<PartyWriteResponse>({ url: endpoint, method: 'POST', data }),
    update: ({ id, data }) =>
      request<PartyWriteResponse>({ url: detailEndpoint(id), method: 'PATCH', data }),
    remove: ({ id }) => request<PartyWriteResponse>({ url: detailEndpoint(id), method: 'DELETE' }),
  };
}
