---
"@neo4j/cypher-builder": minor
---

Add support for label expressions on `hasLabel`:

```js
const query = new Cypher.Match(node).where(node.hasLabel(Cypher.labelExpr.or("Movie", "Film")));
```

```cypher
MATCH (this0:Movie)
WHERE this0:(Movie|Film)
```
