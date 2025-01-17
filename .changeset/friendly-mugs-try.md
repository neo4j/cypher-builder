---
"@neo4j/cypher-builder": patch
---

Add support for `WITH HEADERS` in `LoadCSV`:

```js
new Cypher.LoadCSV("https://data.neo4j.com/bands/artists.csv", new Cypher.Variable()).withHeaders();
```

```cypher
LOAD CSV WITH HEADERS FROM \\"https://data.neo4j.com/bands/artists.csv\\" AS var0
```
