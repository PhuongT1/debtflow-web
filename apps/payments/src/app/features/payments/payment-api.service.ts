import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map } from 'rxjs';

import {
  type ApiEnvelope,
  type PaginatedResult,
  type PaymentRecord,
  type PaymentReversalResponse,
  unwrapApiResponse,
} from '@packages/platform-contracts';
@Injectable({ providedIn: 'root' })
export class PaymentApiService {
  private readonly http = inject(HttpClient);
  list(page: number, pageSize: number, partyId?: string) {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (partyId) params = params.set('partyId', partyId);
    return this.http
      .get<ApiEnvelope<PaymentRecord[]>>(environment.apiBasePath + '/payments', {
        params,
      })
      .pipe(map((response) => unwrapApiResponse<PaginatedResult<PaymentRecord>>(response)));
  }
  remove(id: string) {
    return this.http
      .delete<ApiEnvelope<PaymentReversalResponse>>(
        environment.apiBasePath + '/payments/' + encodeURIComponent(id),
      )
      .pipe(map((response) => unwrapApiResponse<PaymentReversalResponse>(response)));
  }
}
