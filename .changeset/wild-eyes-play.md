---
"@neo4j/cypher-builder": patch
---

Explicitly exports some types that were used or returned by public functions and methods:

- `CallInTransactionOptions`
- `ForeachClauses`
- `PartialPattern`
- `LiteralValue`
- `ListIndex`
- `DeleteInput`
- `NodePatternOptions`
- `RelationshipPatternOptions`
- `YieldProjectionColumn`

Some methods and internal types have also been changed to better reflect the exposed types and avoid using internal types in public API
