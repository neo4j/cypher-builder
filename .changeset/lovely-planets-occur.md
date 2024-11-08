---
"@neo4j/cypher-builder": patch
---

Fix types in `Unwind` to reflect its behaviour in Cypher:

-   Unwind without alias is not supported in Cypher.
-   Unwind does not support `*`
-   Unwind does not support multiple columns
