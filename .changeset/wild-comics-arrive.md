---
"@neo4j/cypher-builder": patch
---

Deprecate setting up labels and types in Node and Relationship. The following examples are now deprecated:

```js
new Cypher.Node({ labels: ["Movie"] });
```

```js
new Cypher.Relationship({ type: "ACTED_IN" });
```

Instead, Nodes and Relationships should be created without parameters. Labels and types should be set in a Pattern:

```js
const n = new Cypher.Node();
const r = new Cypher.Relationship();

const pattern = new Cypher.Pattern(n, { labels: ["Movie"] }).related(r, { type: "ACTED_IN" }).to();
```
