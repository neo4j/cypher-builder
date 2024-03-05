---
"@neo4j/cypher-builder": patch
---

Add support for arbitrary variables in Patterns instead of Node and Relationship. For example:

```js
const a = new Cypher.Variable();

const pattern = new Cypher.Pattern({ variable: a });
```
