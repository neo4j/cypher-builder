---
"@neo4j/cypher-builder": minor
---

Support for dynamic labels in patterns

```javascript
const query = new Cypher.Match(
    new Cypher.Pattern(new Cypher.Node(), {
        labels: new Cypher.Param("Movie"),
    })
);
```

```cypher
MATCH (this0:$($param0))
```
