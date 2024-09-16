---
"@neo4j/cypher-builder": major
---

Clause build options are now passed as an object rather than parameters:

```js
myClause.build({
    prefix: "another-this",
    extraParams: {
        myParam: "hello",
    },
    labelOperator: "&",
});
```

All parameters are optional, and `build` can still be called without parameters
