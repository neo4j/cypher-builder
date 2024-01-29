---
"@neo4j/cypher-builder": patch
---

Prepends WITH on each UNION subquery when `.importWith` is set in parent CALL:

```js
const returnVar = new Cypher.Variable();
const n1 = new Cypher.Node({ labels: ["Movie"] });
const query1 = new Cypher.Match(n1).return([n1, returnVar]);
const n2 = new Cypher.Node({ labels: ["Movie"] });
const query2 = new Cypher.Match(n2).return([n2, returnVar]);

const unionQuery = new Cypher.Union(query1, query2);
const callQuery = new Cypher.Call(unionQuery).importWith(new Cypher.Variable());
```

The statement `WITH var0` will be added to each UNION subquery

```cypher
CALL {
    WITH var0
    MATCH (this1:Movie)
    RETURN this1 AS var2
    UNION
    WITH var0
    MATCH (this3:Movie)
    RETURN this3 AS var2
}
```
