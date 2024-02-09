---
"@neo4j/cypher-builder": minor
---

Support for WHERE predicates in patters:

```javascript
const movie = new Cypher.Node({ labels: ["Movie"] });

new Cypher.Pattern(movie).where(Cypher.eq(movie.property("title"), new Cypher.Literal("The Matrix")));
```

```cypher
(this0:Movie WHERE this0.title = "The Matrix")
```
