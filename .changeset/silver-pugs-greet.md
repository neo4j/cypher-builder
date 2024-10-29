---
"@neo4j/cypher-builder": patch
---

Add support for patterns in `size()` for Neo4j 4

```js
const pattern = new Cypher.Pattern(new Cypher.Node()).related().to();
const cypherFunction = Cypher.size(pattern);
```

```cypher
size((this0)-[this1]->(this2))
```
