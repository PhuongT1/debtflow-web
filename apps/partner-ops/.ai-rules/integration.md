# Partner Ops Integration

- Receive host locale and navigation messages only through the embedded platform bridge and validate their version/origin.
- Keep shared messages in `@debtflow/contracts` and browser bridge helpers in `@debtflow/platform-sdk`; never place MFE business state there.
- URLs carry deep-link and navigation context. Cross-MFE events carry identifiers or small metadata, never access tokens or full entities.
- Embedded route changes request Shell navigation. The ready handshake advertises route synchronization; host route messages replace query state or use the proxied remote router for pathname changes. Only Shell adds history entries. Never route an embedded RSC request through the Shell's public `/parties` route. Preserve standalone routing.
