---
"@neo4j/cypher-builder": patch
---

Add `labelOperator` option on build to change the default label `AND` operator:

```js
const node = new Cypher.Node({ labels: ["Movie", "Film"] });
const query = new Cypher.Match(node);

const queryResult = new TestClause(query).build(
    undefined,
    {},
    {
        labelOperator: "&",
    }
);
```

Will return:

```cypher
MATCH (this:Movie&Film)
```
