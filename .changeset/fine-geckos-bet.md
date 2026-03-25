---
"@neo4j/cypher-builder": minor
---

Add support for `LET` binding clauses:

```js
new Cypher.Let([new Cypher.Variable(), Cypher.gte(nnew Cypher.Literal(200), new Cypher.Literal(500))])
```

```cypher
LET var1 = 200 + 500
```
