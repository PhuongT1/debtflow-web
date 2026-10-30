import { HttpInterceptorFn } from '@angular/common/http';

import { getStoredLocale } from '@packages/platform-sdk';

export const credentialsInterceptor: HttpInterceptorFn = (request, next) =>
  next(
    request.clone({
      withCredentials: true,
      setHeaders: {
        'Accept-Language': getStoredLocale(),
      },
    }),
  );
