---
"@neo4j/cypher-builder": minor
---

The following methods in `Pattern` class and chains are deprecated:

-   `withoutLabels`
-   `withoutVariable`
-   `withProperties`
-   `getVariables`
-   `withoutType`
-   `withDirection`
-   `withLength`

Instead, these properties should be passed as an object, for example:

```js
const a = new Cypher.Variable();
const rel = new Cypher.Variable();
const b = new Cypher.Variable();

const pattern = new Cypher.Pattern({ variable: a, labels: ["Movie"] })
    .related({ variable: rel, type: "ACTED_IN" })
    .to({ variable: b });
```
