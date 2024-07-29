---
"@neo4j/cypher-builder": minor
---

Add support for LOAD CSV:

```js
const row = new Cypher.Variable();
const loadClause = new Cypher.LoadCSV("https://data.neo4j.com/bands/artists.csv", row).return(row);
```
