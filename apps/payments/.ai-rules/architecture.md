# Payments Architecture

- `apps/payments` is the payment domain MFE at port 3002 and is exposed to the Shell as a custom element.
- Preserve both standalone and embedded operation. Keep custom-element inputs, outputs, and browser events explicit and backward compatible.
- Payment data and payment-specific state belong here. Context from another MFE is an identifier in URL/input, not a transferred object graph.
- Validate with `npm run typecheck:payments`; also run `npm run build:payments` after Angular configuration, custom-element, or integration changes.

## Local naming convention

- This app currently uses `feature.component.ts`, `feature.service.ts`, and matching `.html` / `.scss` files. Maintain this convention for new adjacent Angular files.
- This is a Payments-team convention, not a rule for React or Next.js applications.
