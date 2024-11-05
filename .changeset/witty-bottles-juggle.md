---
"@neo4j/cypher-builder": major
---

Remove `assignToPath` method from clauses, in favor of `assignTo` in Patterns for the following clauses:

-   `Match`
-   `Merge`
-   `Create`

Before:

```js
new Cypher.Match(pattern).assignToPath(pathVariable).return(pathVariable);
```

Now:

```js
new Cypher.Match(pattern.assignTo(pathVariable)).return(pathVariable);
```

Generates the Cypher:

```cypher
MATCH p = ()-[]-()
RETURN p
```
