---
"@neo4j/cypher-builder": patch
---

Add support for `Cypher 25` version prefix:

```js
const { cypher } = matchQuery.build({
    cypherVersion: "25",
});
```
