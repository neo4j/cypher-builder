---
"@neo4j/cypher-builder": minor
---

Add support for trim expressions in `trim`:

```js
Cypher.trim("BOTH", new Cypher.Literal("x"), new Cypher.Literal("xxxhelloxxx"));
```

```cypher
trim(BOTH "x" FROM "xxxhelloxxx")
```
