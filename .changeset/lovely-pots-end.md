---
"@neo4j/cypher-builder": minor
---

Add support for `CALL { …​ } IN CONCURRENT TRANSACTIONS`:

```js
new Cypher.Call(subquery).inTransactions({
    concurrentTransactions: 3,
});
```

```cypher
CALL {
    // Subquery
} IN 3 CONCURRENT TRANSACTIONS
```
