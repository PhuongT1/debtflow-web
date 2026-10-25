# Extraction

**Activate:** splitting or promoting a module. **Scope:** this responsibility only; apply project facts and the selected task workflow.

- Split a screen when field rendering, table configuration, and request orchestration can change independently. Keep the screen responsible for composing them; do not pass the entire query/form instance to every child.
- Put a pure function in its feature when its inputs name domain concepts. Put it in `lib/<concern>` only when unrelated features use the same technical contract. A second caller in the same feature is not a reason for a global utility.
- Choose either a flat feature or cohesive subfolders for the task's size. Do not create `components/`, `hooks/`, `api/`, `types/`, and `utils/` directories containing only forwarding files.
- A new public type belongs with the module owning its meaning. Move it to `contracts` only when independently deployed consumers actually share that contract.

**Accept when:** every new file has a named owner; no duplicate adapter exists; feature UI stays outside generic primitives; the 230-line policy is met or its documented exception applies.

External comparison: [Bulletproof React project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md) supports feature ownership. The adopting project retains its established layers; do not copy that project's whole directory tree or barrel policy.
