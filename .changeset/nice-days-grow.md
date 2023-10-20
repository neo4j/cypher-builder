---
"@neo4j/cypher-builder": patch
---

Support for expressions on Pattern properties:

```js
const pattern = new Cypher.Pattern(node).withProperties({
    name: Cypher.plus(new Cypher.Literal("The "), new Cypher.Literal("Matrix")),
});
```

Results in:

```cypher
(this0: {name: "The " + "Matrix"})
```
