import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { credentialsInterceptor } from '@core/http/credentials.interceptor';
import { PaymentHistoryComponent } from '@features/payments/payment-history.component';

const ELEMENT_NAME = 'debtflow-payments';

async function register() {
  if (customElements.get(ELEMENT_NAME)) return;

  const application = await createApplication({
    providers: [provideHttpClient(withInterceptors([credentialsInterceptor]))],
  });
  const element = createCustomElement(PaymentHistoryComponent, {
    injector: application.injector,
  });
  customElements.define(ELEMENT_NAME, element);
}

void register().catch((error: unknown) => {
  console.error('Cannot register the Payments Micro Frontend.', error);
});
