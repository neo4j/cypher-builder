---
"@neo4j/cypher-builder": minor
---

Add option `retry` to `Call.inTransactions` configuration to add a `RETRY` statement to `CALL {} IN TRANSACTIONS`.
This option can be a boolean set to true or a number to define the retry seconds:

```js
new Cypher.Call(subquery).inTransactions({
    retry: true,
});
```

```cypher
CALL {
    // ...
} IN TRANSACTIONS ON ERROR RETRY
```

Using it in conjuntion with `onError` and with a defined seconds of retry:

```js
new Cypher.Call(subquery).inTransactions({
    retry: 10,
    onError: "break",
});
```

```cypher
CALL {
    // ...
} IN TRANSACTIONS ON ERROR RETRY FOR 10 SECONDS THEN BREAK
```
