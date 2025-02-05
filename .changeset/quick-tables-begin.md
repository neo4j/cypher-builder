---
"@neo4j/cypher-builder": patch
---

Support for assigning maps and variables directly to variables with `.set` to override all properties of a node:

```js
new Cypher.Match(new Cypher.Pattern(movie)).set([
    movie,
    new Cypher.Map({
        title: new Cypher.Param("The Matrix"),
        year: new Cypher.Param(1999),
    }),
]);
```

```cypher
MATCH (this0)
SET
    this0 = { title: $param0, year: $param1 }
```
