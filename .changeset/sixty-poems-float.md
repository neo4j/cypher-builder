---
"@neo4j/cypher-builder": patch
---

Fix clauses order when using `Merge.onCreate` along with `.set`

For example:

```js
const query = new Cypher.Merge(node)
    .onCreate([node.property("age"), new Cypher.Param(23)])
    .set([node.property("age"), new Cypher.Param(10)]);
```

```cypher
MERGE (this0:MyLabel)
ON CREATE SET
    this0.age = $param1
SET
    this0.age = $param0
```
