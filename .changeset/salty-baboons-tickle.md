---
"@neo4j/cypher-builder": minor
---

Add support for `Cypher.Filter`. This implements the `FILTER` clause:

```javascript
const node = new Cypher.Node();
const query = new Cypher.Match(new Cypher.Pattern(node))
    .filter(node.hasLabel("Swedish"))
    .return([node.property("name"), "name"]);
```

```cypher
MATCH (this0)
FILTER this0:Swedish
RETURN this0.name AS name
```
