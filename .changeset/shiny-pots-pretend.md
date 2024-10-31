---
"@neo4j/cypher-builder": patch
---

Deprecate `assignToPath` in clauses in favor of `assignTo` in Pattern

Before:

```js
new Cypher.Match(pattern).assignToPath(path).return(path);
```

Now:

```js
new Cypher.Match(pattern.assignTo(path)).return(path);
```

Generates the Cypher:

```cypher
MATCH p = ()-[]-()
RETURN p
```
