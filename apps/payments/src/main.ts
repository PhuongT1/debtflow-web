import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';

import { credentialsInterceptor } from '@core/http/credentials.interceptor';
import { PaymentWorkspaceComponent } from '@features/workspace';

const ELEMENT_NAME = 'debtflow-payments';

async function register() {
  if (customElements.get(ELEMENT_NAME)) return;

  const application = await createApplication({
    providers: [provideHttpClient(withInterceptors([credentialsInterceptor]))],
  });
  const element = createCustomElement(PaymentWorkspaceComponent, {
    injector: application.injector,
  });
  customElements.define(ELEMENT_NAME, element);
}

void register().catch((error: unknown) => {
  console.error('Cannot register the Payments Micro Frontend.', error);
});
