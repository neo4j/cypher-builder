---
"@neo4j/cypher-builder": minor
---

Add support for concatenation operator (`||`) with `Cypher.concat`

```js
Cypher.concat(new Cypher.Literal("Hello"), new Cypher.Literal("World!"));
```

```cypher
("Hello" || "World!")
```

This is functionally equivalent to `Cypher.plus` with uses the operator `+` instead.
