---
"@neo4j/cypher-builder": minor
---

Add support for dynamic labels by passing an expression to `node.label`:

```javascript
new Cypher.Match(new Cypher.Pattern(movie)).set(movie.label(Cypher.labels(anotherNode)));
```

```cypher
MATCH (this0)
SET
    this0:$(labels(this1))
```
