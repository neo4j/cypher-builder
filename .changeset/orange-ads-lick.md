---
"@neo4j/cypher-builder": minor
---

Add support for quantifier patterns:

```js
const m = new Cypher.Node();
const m2 = new Cypher.Node();

const quantifiedPath = new Cypher.QuantifiedPath(
    new Cypher.Pattern(m, { labels: ["Movie"], properties: { title: new Cypher.Param("V for Vendetta") } }),
    new Cypher.Pattern({ labels: ["Movie"] })
        .related({ type: "ACTED_IN" })
        .to({ labels: ["Person"] })
        .quantifier({ min: 1, max: 2 }),
    new Cypher.Pattern(m2, {
        labels: ["Movie"],
        properties: { title: new Cypher.Param("Something's Gotta Give") },
    })
);

const query = new Cypher.Match(quantifiedPath).return(m2);
```

_Cypher_

```cypher
MATCH (this0:Movie { title: $param0 })
      ((:Movie)-[:ACTED_IN]->(:Person)){1,2}
      (this1:Movie { title: $param1 })
RETURN this1
```
