import { apiPaginatedRequest, apiRequest } from '@/lib/api/http-client';

import { createRestPartyService } from './providers/rest';

/** App composition: one selected provider using the existing browser transport. */
export const partyService = createRestPartyService({
  request: apiRequest,
  requestPage: apiPaginatedRequest,
});
