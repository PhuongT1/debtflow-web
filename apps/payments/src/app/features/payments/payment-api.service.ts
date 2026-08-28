import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  unwrapApiResponse,
  type ApiEnvelope,
  type PaginatedResult,
  type PaymentRecord,
} from '@debtflow/contracts';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class PaymentApiService {
  private readonly http = inject(HttpClient);
  list(page: number, pageSize: number) {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http
      .get<ApiEnvelope<PaymentRecord[]>>(environment.apiBasePath + '/payments', {
        params,
      })
      .pipe(map((response) => unwrapApiResponse<PaginatedResult<PaymentRecord>>(response)));
  }
  remove(id: string) {
    return this.http.delete(environment.apiBasePath + '/payments/' + id);
  }
}
