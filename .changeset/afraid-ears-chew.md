---
"@neo4j/cypher-builder": patch
---

Add callProcedure method to With and Match clauses

```js
const withQuery = new Cypher.With("*").callProcedure(Cypher.db.labels()).yield("label");
```
