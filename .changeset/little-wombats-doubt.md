---
"@neo4j/cypher-builder": patch
---

Updates escape logic so names with numbers are not escaped unless they begin with a number:

-   `this0` OK
-   `0this` Should be escaped
