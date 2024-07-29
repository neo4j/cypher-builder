---
"@neo4j/cypher-builder": minor
---

Add support for `END AS` in CASE statements:

```js
new Cypher.Case(person.property("eyes"))
    .when(new Cypher.Literal("blue"))
    .then(new Cypher.Literal(1))
    .else(new Cypher.Literal(3))
    .endAs(new Cypher.Variable(), person.property("eyes"));
```
