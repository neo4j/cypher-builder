---
"@neo4j/cypher-builder": patch
---

Fix types to support paths on chained `.match` and `.optionalMatch`:

```js
const path = new Cypher.PathVariable();
const query = new Cypher.Match(new Cypher.Node()).match(pattern.assignTo(path)).return(path);
```

```cypher
MATCH (this0)
MATCH p3 = (this0)-[this1:ACTED_IN]->(this2)
RETURN p3
```
