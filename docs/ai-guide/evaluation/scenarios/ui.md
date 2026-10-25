# UI Fix Scenarios

Both cases use the same plain HTML/CSS fixture; no React/Next.js/Angular assumptions are required. They select the [UI workflow](../../../../.ai-rules/core/workflows/ui/README.md).

| Case ID         | Short prompt                                                                                                                    | Required evidence                                                                       | Preserved behavior                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `ui-actions`    | Fix the Parties table: Payment, View and Delete must stay on one row. Keep the existing actions and the Orders section working. | Before/after appearance and same-row bounds at 1280px and 390px; no whole-page overflow | Payment/View/Export actions, keyboard activation, disabled Delete permission, Orders wrapping and shared styles |
| `ui-long-label` | Fix the Export button so its full label is visible on narrow screens. Do not change the existing table or Orders controls.      | Full text without clipping; readable font at both widths; no whole-page overflow        | Existing party wrapping, Orders wrapping, actions and permissions                                               |

The expected correction is local to `src/parties.css`. A global/shared style edit is flagged by the file audit; changing unrelated rules in the same file still needs diff/visual review. Hiding actions, shrinking text or changing permission logic is not an acceptable layout fix.

`check-browser.mjs` accepts a Playwright Page, so an evaluator can reuse an existing browser installation/tool. It checks bounds, interactions, keyboard activation and browser/network errors and optionally captures screenshots. The implementing agent must also use available browser evidence or clearly report that it could not. Passing DOM assertions alone does not prove polished appearance. See [running the scenarios](README.md).
