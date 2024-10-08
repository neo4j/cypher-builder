---
"@neo4j/cypher-builder": patch
---

Add support for `OFFSET` as an alias for `SKIP`:

```js
const matchQuery = new Cypher.Return(movieNode).orderBy([movieNode.property("age")]).offset(new Cypher.Param(10));
```

```cypher
RETURN this0
ORDER BY this0.age ASC
OFFSET $param0
```
