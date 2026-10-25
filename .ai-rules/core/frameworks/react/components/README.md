# React Component Rules

Select only the responsibility being changed; do not read this folder as a bundle.

| Change                                                                 | Module                                  |
| ---------------------------------------------------------------------- | --------------------------------------- |
| Responsibilities, presentation/container boundary, composition         | [Responsibilities](responsibilities.md) |
| Props, defaults, callbacks                                             | [Props](props.md)                       |
| Mode-dependent contracts, slots, wrapper precedence, pending ownership | [Contracts](contracts.md)               |
| JSX conditions, identity, keys, purity                                 | [Rendering](rendering.md)               |

Before editing existing components, apply [impact assessment](../../../execution/impact.md); shared/reusable targets also activate [shared-code restrictions](../../../execution/shared-code.md). These are implementation modules, not authorization to change consumers or public behavior.
