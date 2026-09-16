import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { AuthUser } from '@debtflow/contracts';
import { catchError, map, of } from 'rxjs';
import { environment } from '@env/environment';

interface SessionResponse {
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class PlatformSessionService {
  private readonly http = inject(HttpClient);

  currentUser() {
    return this.http.get<SessionResponse>(environment.sessionPath, { withCredentials: true }).pipe(
      map((response) => response.user),
      catchError(() => of(undefined)),
    );
  }
}
