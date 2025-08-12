---
"@neo4j/cypher-builder": minor
---

Support for dynamic labels in patterns

```javascript
const movie = new Cypher.Node();

const query = new Cypher.Match(
    new Cypher.Pattern(movie, {
        labels: new Cypher.Param("Movie"),
    })
).return(Cypher.count(movie));

const queryResult = query.build();
```

```cypher
MATCH (this0:$($param0))
RETURN count(this0)
```
