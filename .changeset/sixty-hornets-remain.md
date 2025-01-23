---
"@neo4j/cypher-builder": minor
---

Add cypherVersion parameter in build:

```js
const { cypher } = matchQuery.build({
    cypherVersion: "5",
});
```

This prepends the Cypher version to the query:

```cypher
CYPHER 5
MATCH (this0:Movie)
RETURN this0
```
