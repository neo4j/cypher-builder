---
"@neo4j/cypher-builder": minor
---

Add support for type filtering on relationships

```js
new Cypher.Match(new Cypher.Pattern().related(new Cypher.Relationship()).to()).where(relationship.hasType("ACTED_IN"));
```

```cypher
MATCH(this0)-[this1]->(this2)
WHERE this1:ACTED_IN
```
