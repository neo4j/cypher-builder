---
"@neo4j/cypher-builder": major
---

Remove support for fine-grained prefix configuration

No longer supported:

```js
myClause.build({
    variable: "var_prefix_",
    params: "param_prefix_",
});
```
