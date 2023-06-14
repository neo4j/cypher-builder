---
"@neo4j/cypher-builder": patch
---

Escapes properties in patterns.

e.g.

```
MATCH (m:Movie { `$myProp`: "Text" })
```
