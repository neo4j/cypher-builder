---
"@neo4j/cypher-builder": minor
---

Add support for labels in set and remove:

```js
const movie = new Cypher.Node();
const clause = new Cypher.Match(new Cypher.Pattern(movie)).set(movie.label("NewLabel"));
```

```cypher
MATCH (this0)
SET
    this0:NewLabel
```
