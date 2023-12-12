---
"@neo4j/cypher-builder": minor
---

Support for NODETACH:

```js
new Cypher.Match(n).noDetachDelete(n);
```

```cypher
MATCH(n)
NODETACH DELETE n
```
