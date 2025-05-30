---
"@neo4j/cypher-builder": minor
---

Add support for `OPTIONAL CALL` on procedures:

```js
Cypher.db.labels().optional().yield("*");
```

```cypher
OPTIONAL CALL db.labels() YIELD *
```
