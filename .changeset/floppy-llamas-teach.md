---
"@neo4j/cypher-builder": major
---

Remove method `.children` from concat clauses:

```js
const query = Cypher.utils.concat(clause1, clause2);
query.children; // No longer supported
```
