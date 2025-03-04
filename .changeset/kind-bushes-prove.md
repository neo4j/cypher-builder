---
"@neo4j/cypher-builder": patch
---

Add support for `+=` operator on `SET`

```js
const movie = new Cypher.Node();
const clause = new Cypher.Match(new Cypher.Pattern(movie)).set([
    movie,
    "+=",
    new Cypher.Map({
        title: new Cypher.Param("The Matrix"),
        year: new Cypher.Param(1999),
    }),
]);
```

```cypher
MATCH (this0)
SET
    this0 += { title: $param0, year: $param1 }
```
