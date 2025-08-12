---
"@neo4j/cypher-builder": patch
---

Add support for dynamic types in patterns

```javascript
const query = new Cypher.Match(
    new Cypher.Pattern(new Cypher.Node())
        .related({
            type: new Cypher.Param("ACTED_IN"),
        })
        .to()
);
```

```cypher
MATCH (this0)-[:$($param1)]->()
```
