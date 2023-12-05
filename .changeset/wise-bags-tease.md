---
"@neo4j/cypher-builder": minor
---

Add support for `ON MATCH SET` after `MERGE`:

```js
const node = new Cypher.Node({
    labels: ["MyLabel"],
});

const countProp = node.property("count");
const query = new Cypher.Merge(node)
    .onCreateSet([countProp, new Cypher.Literal(1)])
    .onMatchSet([countProp, Cypher.plus(countProp, new Cypher.Literal(1))]);
```

```cypher
MERGE (this0:MyLabel)
ON MATCH SET
    this0.count = (this0.count + 1)
ON CREATE SET
    this0.count = 1
```
