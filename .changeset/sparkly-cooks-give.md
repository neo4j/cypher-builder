---
"@neo4j/cypher-builder": patch
---

Revert change: Emit methods and classes marked as internal again.

This change was introduced in v3.1.0 as an optimisation of the bundle, and to provide better typings,
but caused some incompatibilities when using `compile`
