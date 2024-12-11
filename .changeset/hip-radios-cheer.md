---
"@neo4j/cypher-builder": patch
---

Add support for trim expressions in `trim`:

```js
Cypher.trim("BOTH", new Cypher.Literal("x"), new Cypher.Literal("xxxhelloxxx"));
```

```cypher
trim(BOTH "x" FROM "xxxhelloxxx")
```
