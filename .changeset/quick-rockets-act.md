---
"@neo4j/cypher-builder": patch
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

const pattern = new Cypher.Pattern(a, { labels: ["Movie"] }).related(rel, { type: "ACTED_IN" }).to(b);
```
