---
"@neo4j/cypher-builder": patch
---

Deprecate separate parameters in `.build` in favor of an object:

Before:

```js
myClause.build("another-this", { myParam: "hello" }, { labelOperator: "&" });
```

Now:

```js
myClause.build({
    prefix: "another-this",
    extraParams: {
        myParam: "hello",
    },
    labelOperator: "&",
});
```
