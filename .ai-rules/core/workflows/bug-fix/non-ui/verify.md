# Retest Non-UI Behavior

**Read when:** the patch affects a request, command, or background behavior.

- Repeat the original failing request/test/command with relevant inputs and state. Assert the corrected outcome, not just the absence of an exception.
- Check the nearest meaningful edge: invalid inputs, failure/retry, timing, compatibility, or affected consumers according to the actual change. Use available tooling and safe data.
- Distinguish simulated failures from unexpected errors. A build does not prove an API or race scenario passes.
- If a browser consumer also changed, use [UI retest](../ui/verify.md). Failed checks return to [diagnosis](../README.md#investigation); report unavailable verification explicitly.

**Exit:** relevant scenarios checked or limits recorded. Follow [owner checks/reporting](../../../execution/verify.md).
