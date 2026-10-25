# Validation

**Activate:** schema transformations, payload mapping or server field errors. **Scope:** this responsibility only; apply project facts and the selected task workflow.

- Distinguish raw input and validated output when transformations/coercions change the shape. Use the project's installed validator or existing validation functions; the mutation must receive validated output. With Zod, `z.input` and `z.output` express this distinction.
- Keep client validation and server validation responsibilities distinct. Map API field errors through the existing helper; client checks do not authorize a request.

Separate three shapes when they differ: **input** (e.g. text/empty values), **validated output** (schema transformations), and **API payload** (omitted fields/DTO mapping). An optional number input must define whether `''` means unset; do not accidentally coerce it into a meaningful zero. Money precision follows the domain/API contract, not an arbitrary `Number()` conversion.

The following is conditional on the project already using compatible React Hook Form and Zod versions; it does not require installing either library:

```ts
type PartyFormInput = z.input<typeof partyFormSchema>;
type PartyFormValues = z.output<typeof partyFormSchema>;
// Use matching input/output generics when schema transformations differ:
useForm<PartyFormInput, unknown, PartyFormValues>({
  resolver: zodResolver(partyFormSchema),
  defaultValues: toPartyFormInput(initialParty),
});
```

`toPartyFormInput` is an illustrative feature-owned mapper, not an existing required helper. Add one only when the mapping warrants extraction.

Schema messages should be stable translation keys or produced by a locale-aware schema factory. Do not cache already translated errors indefinitely across locale changes. Validate that server field paths correspond to supported fields before assigning them; a type cast alone does not prove a backend path is safe to use.

**Accept when:** input/output/payload transformations match the contract, unsupported server field paths are rejected, and field/form errors remain recoverable.

Library reference: [React Hook Form reset guidance](https://github.com/react-hook-form/documentation/blob/master/src/content/docs/useform/reset.mdx).
