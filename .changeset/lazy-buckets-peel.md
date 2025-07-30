---
"@neo4j/cypher-builder": patch
---

Deprecate apoc functions and procedures. These will no longer be supported in version 3 of Cypher Builder:

- `apoc.date.convertFormat`
- `apoc.util.validate`
- `apoc.util.validatePredicate`
- `apoc.cypher.runFirstColumnMany`
- `apoc.cypher.runFirstColumnSingle`

These can still be used by using the `Function` class directly:

```js
const convertFormat = new Cypher.Function("apoc.date.convertFormat", [
    new Cypher.Variable(),
    new Cypher.Literal("iso_zoned_date_time"),
    new Cypher.Literal("iso_offset_date_time"),
]);
```
