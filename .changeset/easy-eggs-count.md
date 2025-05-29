---
"@neo4j/cypher-builder": patch
---

Add support for `OPTIONAL CALL` on procedures:

```js
Cypher.db.labels().yield("*").optional();
```

```cypher
OPTIONAL CALL db.labels() YIELD *
```
