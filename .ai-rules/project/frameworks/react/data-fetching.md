# Debtflow Data Fetching

**Activate:** data fetching changes in Debtflow; load only this selected local extension.

## Request ownership and serialization

| App/call site                          | Required existing path                                            | Payload contract                                                                                     |
| -------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Shell feature reading/writing a domain | `services/<domain>.client.ts` → `apiClient`                       | `apiClient.post(path, values)` serializes JSON; do not stringify an already serialized string again. |
| Shell server loader                    | `services/<domain>.server.ts` → `apiServer`                       | Keep server session access/normalization out of the client graph.                                    |
| Partner Ops feature                    | `requestJson(path, RequestInit)` from its own `lib/api-client.ts` | Set method/body deliberately; JSON writes use `body: JSON.stringify(values)`.                        |
| Cross-app auth integration             | The Platform SDK helper                                           | Do not reproduce CSRF or redirect behavior in a component.                                           |

New request functions return records/results and throw normalized failures; they do not open dialogs, read form instances, or translate success toasts. Preserve adapter cancellation and timeout behavior.

Illustrative Partner Ops query fragment using its existing filter parser/client:

```ts
const filters = getPartyListFilters(searchParams);
const partiesQuery = useQuery({
  queryKey: ['parties', filters],
  queryFn: ({ signal }) =>
    requestJson<PaginatedResult<Party>>(getPartyListApiPath('/api/parties', filters), { signal }),
});
```

Local references: [Shell debt adapter](../../../../apps/shell/src/services/debt.client.ts), [Shell HTTP pipeline](../../../../apps/shell/src/lib/api/client.ts), [Partner Ops client](../../../../apps/partner-ops/src/lib/api-client.ts), [Parties query owner](../../../../apps/partner-ops/src/features/parties/parties-client.tsx).
