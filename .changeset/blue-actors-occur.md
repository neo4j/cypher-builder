---
"@neo4j/cypher-builder": minor
---

Add support for Simple subqueries, using only a Pattern in `Count` and `Exists`:

```js
const countExpr = new Cypher.Count(new Cypher.Pattern(new Cypher.Node(), { labels: ["Movie"] }));

const match = new Cypher.Match(new Cypher.Pattern(new Cypher.Node()))
    .where(Cypher.gt(countExpr, new Cypher.Literal(10)))
    .return("*");
```

```cypher
MATCH (this0)
WHERE COUNT {
    (this1:Movie)
} > 10
RETURN *
```
