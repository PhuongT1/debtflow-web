import { HttpInterceptorFn } from '@angular/common/http';
import { getStoredLocale } from '@debtflow/contracts';

export const credentialsInterceptor: HttpInterceptorFn = (request, next) =>
  next(
    request.clone({
      withCredentials: true,
      setHeaders: {
        'Accept-Language': getStoredLocale(),
      },
    }),
  );
