---
"@neo4j/cypher-builder": minor
---

Add support for `NEXT` clause using the method `next()`

```javascript
const query = new Cypher.Match(new Cypher.Pattern(customerNode, { labels: ["Customer"] }))
    .return([customerNode, customer])
    .next()
    .match(new Cypher.Pattern(productNode, { labels: ["Product"] }))
    .return(productNode);
```

```cypher
MATCH (this0:Customer)
RETURN this0 AS var1
NEXT
MATCH (this2:Product)
RETURN this2
```
