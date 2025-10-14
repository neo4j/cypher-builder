---
"@neo4j/cypher-builder": major
---

Remove labelOperator, all labels will now use operator `&`

No longer supported:

```js
const { cypher, params } = matchQuery.build({
    labelOperator: "&",
});
```

_Before_

```js
MATCH (this1:Movie:Film)
```

_After_

```cypher
MATCH (this1:Movie&Film)
```
