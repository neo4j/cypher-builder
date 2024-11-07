---
"@neo4j/cypher-builder": major
---

Patterns no longer create a variable by default

```js
const pattern = new Cypher.Pattern();
```

Before:

```cypher
(this0)
```

Now:

```cypher
()
```
