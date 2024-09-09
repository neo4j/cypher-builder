---
"@neo4j/cypher-builder": patch
---

Add support for adding `Call` clauses to `Match` and `With`:

```js
const match = new Cypher.Match(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
    .call(new Cypher.Create(new Cypher.Pattern(movieNode).related().to(actorNode)), [movieNode])
    .return(movieNode);
```

```cypher
MATCH (this0:Movie)
CALL (this0) {
    CREATE (this0)-[this2]->(this1)
}
RETURN this0
```
