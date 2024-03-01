---
"@neo4j/cypher-builder": patch
---

Deprecate `Cypher.cdc` Procedures in favor of `Cypher.db.cdc`:

-   `Cypher.cdc.current` in favor of `Cypher.db.cdc.current`
-   `Cypher.cdc.earliest` in favor of `Cypher.db.cdc.earliest`
-   `Cypher.cdc.query` in favor of `Cypher.db.cdc.query`

This new procedures also update the generated Cypher namespace to `db.cdc`
