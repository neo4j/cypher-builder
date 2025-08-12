---
"@neo4j/cypher-builder": patch
---

Add support for dynamic types in patterns

```javascript
const movie = new Cypher.Node();

const query = new Cypher.Match(
    new Cypher.Pattern(movie)
        .related({
            type: new Cypher.Param("ACTED_IN"),
        })
        .to()
).return(Cypher.count(movie));

const queryResult = query.build();

const queryResult = query.build();
```

```cypher
MATCH (this0)-[:$($param1)]->()
RETURN count(this0)
```
