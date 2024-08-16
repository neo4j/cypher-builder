---
"@neo4j/cypher-builder": major
---

Removes the following deprecated features:

-   `pointDistance`
-   `utils.compileCypher`
-   `RawCypher`
-   `onCreate` method in `Merge` clauses
-   `innerWith` method in `Call` clauses
-   `PatternComprehension` second parameter
-   `cdc` namespace:
    -   `cdc.current`
    -   `cdc.earliest`
    -   `cdc.query`
-   `rTrim` and `lTrim`
-   `Pattern.withoutLabels`
-   `Pattern.withoutVariable`
-   `Pattern.withProperties`
-   `Pattern.withVariables`
-   `Pattern.related().withoutType`
-   `Pattern.related().withDirection`
-   `Pattern.related().withLength`
-   `Pattern.related().getVariables`
