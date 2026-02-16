---
"@neo4j/cypher-builder": minor
---

Added support for multiple match patterns queries:

```js
const pattern1 = new Cypher.Pattern(actor, { labels: ["Person"] })
    .related({ type: "ACTED_IN", direction: "undirected" })
    .to(movie, { labels: ["Movie"] });

const pattern2 = new Cypher.Pattern(moreActors, { labels: ["Person"] })
    .related({ type: "ACTED_IN", direction: "undirected" })
    .to(movie);

const match = new Cypher.Match(pattern1, pattern2).return(new Cypher.Return(actor, moreActors, movie));
```

```cypher
MATCH
  (this0:Person)-[:ACTED_IN]-(this1:Movie),
  (this2:Person)-[:ACTED_IN]-(this1)
RETURN this0, this2, this1
```
