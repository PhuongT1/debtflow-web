# Result Review

Do not accept “done” without checking these points:

| Check                              | Example: action buttons on /parties                                                                                                                                         |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Instructions were available        | AI loaded the project entry and relevant rules, or explicitly reported missing access.                                                                                      |
| Project conventions were respected | AI used applicable core rules together with the current project's architecture and comparable components; it did not impose another project's paths, libraries or commands. |
| Requested result works             | The buttons stay on one line at the reported viewport.                                                                                                                      |
| Related behavior still works       | Actions remain usable; narrower layouts do not hide required controls.                                                                                                      |
| Verification happened              | AI lists actual scenarios, commands, results and anything it could not test.                                                                                                |
| Scope is preserved                 | The patch contains relevant files and no unrelated business or UI changes.                                                                                                  |

## If the result is incomplete

Give the remaining failing case:

```text
At 1024px, Delete still wraps onto a second line. Fix this case too.
```

Check that relevant cases actually ran: zero selected tests, skipped acceptance cases and unavailable tools are not passes. Distinguish check-only commands from formatting/autofix or baseline updates, and inspect any resulting edits.

A passing build does not prove the UI works. An uploaded rule file does not prove AI followed it. Review the patch and verification evidence before accepting the work.

When reviewing a rule change, confirm its owner: reusable guidance belongs in `core/`; project facts and exceptions belong in `project/` or the affected app/package. The documentation page must still show the real Markdown source path. See [Layers](../rule-reference/layers.md) for the folder-to-website map.

[Completion requirements](../../../.ai-rules/core/execution/verify.md) · [UI verification](../../../.ai-rules/core/workflows/ui/verify.md).
