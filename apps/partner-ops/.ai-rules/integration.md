# Partner Ops Integration

- Receive host locale and navigation messages only through the embedded platform bridge and validate their version/origin.
- Keep shared messages in `@debtflow/contracts` and browser bridge helpers in `@debtflow/platform-sdk`; never place MFE business state there.
- URLs carry deep-link and navigation context. Cross-MFE events carry identifiers or small metadata, never access tokens or full entities.
